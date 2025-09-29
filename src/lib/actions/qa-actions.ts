'use server'

import { answerQuestion } from '@/lib/rag/answer-generator'
import { createClient } from '@/lib/supabase/server'
import { AnswerResult } from '@/lib/types'
import { revalidatePath } from 'next/cache'

export async function submitQuestion(questionText: string): Promise<AnswerResult> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  try {
    const result = await answerQuestion(questionText, user?.id)
    revalidatePath('/')
    return result
  } catch (error) {
    console.error('Error answering question:', error)
    throw new Error('Failed to answer question')
  }
}

export async function submitFeedback(
  questionId: string,
  answerId: string,
  feedback: 1 | -1
): Promise<void> {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Authentication required')
  }
  
  const { error } = await supabase
    .from('qa_feedback')
    .upsert({
      question_id: questionId,
      answer_id: answerId,
      user_id: user.id,
      feedback
    })
  
  if (error) {
    throw new Error(`Failed to submit feedback: ${error.message}`)
  }
  
  revalidatePath('/')
}

export async function toggleFavorite(strainId: string): Promise<void> {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Authentication required')
  }
  
  // Check if already favorited
  const { data: existing } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user.id)
    .eq('strain_id', strainId)
    .single()
  
  if (existing) {
    // Remove from favorites
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('strain_id', strainId)
    
    if (error) {
      throw new Error(`Failed to remove favorite: ${error.message}`)
    }
  } else {
    // Add to favorites
    const { error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        strain_id: strainId
      })
    
    if (error) {
      throw new Error(`Failed to add favorite: ${error.message}`)
    }
  }
  
  revalidatePath('/strains')
  revalidatePath('/account')
}

export async function postReview(
  strainId: string,
  rating: number,
  text: string
): Promise<void> {
  const supabase = createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Authentication required')
  }
  
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5')
  }
  
  const { error } = await supabase
    .from('reviews')
    .insert({
      user_id: user.id,
      strain_id: strainId,
      rating,
      text
    })
  
  if (error) {
    throw new Error(`Failed to post review: ${error.message}`)
  }
  
  revalidatePath(`/strains/${strainId}`)
}
