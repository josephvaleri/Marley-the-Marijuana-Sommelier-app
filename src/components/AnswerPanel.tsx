'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import { AnswerResult } from '@/lib/types'

interface AnswerPanelProps {
  answer?: AnswerResult
  onFeedback?: (questionId: string, answerId: string, feedback: 1 | -1) => void
  className?: string
}

export default function AnswerPanel({ answer, onFeedback, className = '' }: AnswerPanelProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)
  const [userFeedback, setUserFeedback] = useState<1 | -1 | null>(null)

  if (!answer) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>Ask Marley a question to get started!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleFeedback = (feedback: 1 | -1) => {
    if (onFeedback && answer.question_id && answer.answer_id) {
      onFeedback(answer.question_id, answer.answer_id, feedback)
      setUserFeedback(feedback)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer.md)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'database':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'reference':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'openai':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'database':
        return 'Database'
      case 'reference':
        return 'Reference Docs'
      case 'openai':
        return 'AI Generated'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="p-6">
        {/* Header with source and confidence */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge className={getSourceColor(answer.source)}>
              {getSourceLabel(answer.source)}
            </Badge>
            {answer.confidence && (
              <Badge variant="outline" className="text-xs">
                {Math.round(answer.confidence * 100)}% confidence
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Answer content */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: answer.md.replace(/\n/g, '<br />') 
            }} 
          />
        </div>

        {/* Citations */}
        {answer.citations && answer.citations.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">Sources:</p>
            <div className="flex flex-wrap gap-2">
              {answer.citations.map((citation, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {citation}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Feedback section */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Was this helpful?</p>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback(1)}
                  className={`h-8 w-8 p-0 ${
                    userFeedback === 1 
                      ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                      : 'hover:bg-green-50'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback(-1)}
                  className={`h-8 w-8 p-0 ${
                    userFeedback === -1 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'hover:bg-red-50'
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-muted-foreground"
            >
              {showDetails ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Hide details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  How I found this
                </>
              )}
            </Button>
          </div>

          {/* Details section */}
          {showDetails && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Answer Details</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Source:</span> {getSourceLabel(answer.source)}
                </div>
                {answer.confidence && (
                  <div>
                    <span className="font-medium">Confidence:</span> {Math.round(answer.confidence * 100)}%
                  </div>
                )}
                <div>
                  <span className="font-medium">Question ID:</span> {answer.question_id}
                </div>
                <div>
                  <span className="font-medium">Answer ID:</span> {answer.answer_id}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

