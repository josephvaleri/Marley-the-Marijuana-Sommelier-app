import { createServiceClient } from '@/lib/supabase/server'
import { AnswerResult, QuestionType } from '@/lib/types'
import OpenAI from 'openai'
import env from '@/lib/env'
import { detectQuestionType } from './question-detector'

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export async function answerQuestion(
  questionText: string,
  userId?: string
): Promise<AnswerResult> {
  const supabase = createServiceClient()
  
  // Detect question type
  const questionType = detectQuestionType(questionText)
  
  // Log the question
  const { data: questionData, error: questionError } = await supabase
    .from('qa_questions')
    .insert({
      text: questionText,
      user_id: userId
    })
    .select()
    .single()
  
  if (questionError) {
    console.error('Failed to log question:', questionError)
    // Continue without logging if database fails
  }
  
  let answer: AnswerResult
  
  try {
    // Try database-first approach
    answer = await tryDatabaseAnswer(questionText, questionType, supabase)
    
    // If database answer is not confident enough, try reference docs
    if (answer.confidence && answer.confidence < 0.7) {
      const referenceAnswer = await tryReferenceAnswer(questionText, supabase)
      if (referenceAnswer.confidence && referenceAnswer.confidence > answer.confidence) {
        answer = referenceAnswer
      }
    }
    
    // If still not confident, use OpenAI fallback
    if (answer.confidence && answer.confidence < 0.5) {
      answer = await tryOpenAIAnswer(questionText, questionType)
    }
  } catch (error) {
    console.error('Database search failed:', error)
    // Fallback to OpenAI if anything fails
    answer = await tryOpenAIAnswer(questionText, questionType)
  }
  
  // Log the answer
  if (questionData) {
    const { error: answerError } = await supabase
      .from('qa_answers')
      .insert({
        question_id: questionData.question_id,
        source: answer.source,
        answer_md: answer.md,
        confidence: answer.confidence
      })
    
    if (answerError) {
      console.error('Failed to log answer:', answerError)
    }
  }
  
  return {
    ...answer,
    question_id: questionData?.question_id || 'temp-' + Date.now(),
    answer_id: 'temp-' + Date.now()
  }
}

async function tryDatabaseAnswer(
  question: string,
  questionType: QuestionType,
  supabase: any
): Promise<AnswerResult> {
  let result: any = null
  
  try {
    switch (questionType.type) {
      case 'strain':
        const { data: strains } = await supabase
          .from('strains')
          .select('*')
          .textSearch('search_tsv', question)
          .limit(5)
        result = strains
        break
      case 'effects':
        const { data: effects } = await supabase
          .from('effects')
          .select('*')
          .textSearch('name', question)
          .limit(5)
        result = effects
        break
      default:
        // Try general search
        const { data: general } = await supabase
          .from('strains')
          .select('*')
          .textSearch('search_tsv', question)
          .limit(3)
        result = general
    }
  } catch (error) {
    console.error('Database search error:', error)
    return {
      md: "I couldn't search the database right now.",
      source: 'database',
      confidence: 0.1
    }
  }
  
  if (result && result.length > 0) {
    return {
      md: formatDatabaseResults(result, questionType),
      source: 'database',
      confidence: Math.min(result.length / 5, 1),
      citations: result.map((r: any) => r.name || r.title).slice(0, 3)
    }
  }
  
  return {
    md: "I couldn't find specific information in the database for that question.",
    source: 'database',
    confidence: 0.1
  }
}

async function tryReferenceAnswer(
  question: string,
  supabase: any
): Promise<AnswerResult> {
  try {
    // Get embedding for the question
    const embedding = await getEmbedding(question)
    
    // Search reference chunks
    const { data: chunks, error } = await supabase.rpc(
      'rpc_search_ref_chunks_embedding',
      {
        query_embedding: embedding,
        match_count: 8,
        min_cosine_sim: 0.25
      }
    )
    
    if (error || !chunks || chunks.length === 0) {
      return {
        md: "I couldn't find relevant reference documents.",
        source: 'reference',
        confidence: 0.1
      }
    }
    
    return {
      md: formatReferenceResults(chunks),
      source: 'reference',
      confidence: Math.min(chunks.length / 8, 1),
      citations: chunks.map((c: any) => c.title).slice(0, 3)
    }
  } catch (error) {
    console.error('Reference search error:', error)
    return {
      md: "I couldn't search reference documents right now.",
      source: 'reference',
      confidence: 0.1
    }
  }
}

async function tryOpenAIAnswer(
  question: string,
  questionType: QuestionType
): Promise<AnswerResult> {
  const systemPrompt = `You are Marley, the Marijuana Sommelier. You are an expert cannabis consultant with deep knowledge of strains, effects, growing, and consumption. You provide helpful, accurate, and educational information about cannabis.

Your personality:
- Knowledgeable and friendly
- Uses cannabis terminology appropriately
- Provides practical advice
- Cites sources when possible
- Encourages responsible use

Answer the user's question about ${questionType.type} in a helpful, informative way. Keep responses concise but comprehensive.`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ],
    max_tokens: 1000,
    temperature: 0.7
  })
  
  return {
    md: completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate an answer.",
    source: 'openai',
    confidence: 0.8
  }
}

// Helper functions
function formatDatabaseResults(results: any[], questionType: QuestionType): string {
  if (results.length === 0) {
    return "I couldn't find specific information for that question."
  }
  
  let response = `Here's what I found about ${questionType.type}:\n\n`
  
  results.forEach((result, index) => {
    response += `**${index + 1}. ${result.name || result.title}**\n`
    if (result.description) {
      response += `${result.description}\n`
    }
    response += '\n'
  })
  
  return response
}

function formatReferenceResults(chunks: any[]): string {
  if (chunks.length === 0) {
    return "I couldn't find relevant reference documents."
  }
  
  let response = "Based on my reference materials:\n\n"
  
  chunks.forEach((chunk, index) => {
    response += `**${chunk.title}**\n`
    response += `${chunk.content.substring(0, 200)}...\n\n`
  })
  
  return response
}

async function getEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: env.RAG_EMBEDDING_MODEL,
    input: text
  })
  
  return response.data[0].embedding
}
