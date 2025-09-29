'use client'

import { useState } from 'react'
import AvatarMarley from '@/components/AvatarMarley'
import QuestionBox from '@/components/QuestionBox'
import AnswerPanel from '@/components/AnswerPanel'
import { submitQuestion, submitFeedback } from '@/lib/actions/qa-actions'
import { AnswerResult } from '@/lib/types'
import { toast } from 'sonner'

export default function HomePage() {
  const [answer, setAnswer] = useState<AnswerResult | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [marleyState, setMarleyState] = useState<'idle' | 'listening' | 'thinking' | 'answering' | 'clarifying' | 'celebrating'>('idle')

  const handleQuestionSubmit = async (question: string) => {
    setIsLoading(true)
    setMarleyState('thinking')
    
    try {
      const result = await submitQuestion(question)
      setAnswer(result)
      setMarleyState('answering')
      
      // Reset to idle after a delay
      setTimeout(() => {
        setMarleyState('idle')
      }, 3000)
    } catch (error) {
      console.error('Error submitting question:', error)
      toast.error('Failed to get answer. Please try again.')
      setMarleyState('idle')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFeedback = async (questionId: string, answerId: string, feedback: 1 | -1) => {
    try {
      await submitFeedback(questionId, answerId, feedback)
      
      if (feedback === 1) {
        setMarleyState('celebrating')
        setTimeout(() => setMarleyState('idle'), 2000)
        toast.success('Thanks for the feedback!')
      } else {
        toast.info('Thanks for the feedback. I\'ll try to improve!')
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error('Failed to submit feedback')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Marley Avatar & Question Input */}
          <div className="lg:col-span-1 space-y-6">
            {/* Marley Avatar */}
            <div className="flex justify-center lg:justify-start">
              <AvatarMarley state={marleyState} />
            </div>
            
            {/* Question Input */}
            <div className="lg:sticky lg:top-8">
              <QuestionBox 
                onSubmit={handleQuestionSubmit}
                isLoading={isLoading}
              />
            </div>
          </div>
          
          {/* Right Column - Answer Panel */}
          <div className="lg:col-span-2">
            <AnswerPanel 
              answer={answer}
              onFeedback={handleFeedback}
            />
          </div>
        </div>
      </div>
    </div>
  )
}