'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Send, Mic, MicOff } from 'lucide-react'

interface QuestionBoxProps {
  onSubmit: (question: string) => void
  isLoading?: boolean
  className?: string
}

const PROMPT_CHIPS = [
  "Best strains for insomnia?",
  "Grow targets for Blue Dream (veg & flower)",
  "Terpenes dominant in OG Kush",
  "How to treat powdery mildew organically?",
  "Indoor PPFD for flowering Sativa hybrids",
  "Compare THC/CBD ranges for Harlequin vs ACDC",
  "Effects of limonene terpene",
  "Best strains for chronic pain",
  "How to clone cannabis plants",
  "Indoor vs outdoor growing differences"
]

export default function QuestionBox({ onSubmit, isLoading = false, className = '' }: QuestionBoxProps) {
  const [question, setQuestion] = useState('')
  const [isListening, setIsListening] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (question.trim() && !isLoading) {
      onSubmit(question.trim())
      setQuestion('')
    }
  }

  const handleChipClick = (chipText: string) => {
    setQuestion(chipText)
  }

  const handleMicToggle = () => {
    if (isListening) {
      // Stop listening
      setIsListening(false)
    } else {
      // Start listening (placeholder - would integrate with Web Speech API)
      setIsListening(true)
      // Simulate speech recognition
      setTimeout(() => {
        setIsListening(false)
        // In real implementation, this would be the recognized text
        setQuestion("Tell me about Blue Dream strain")
      }, 2000)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Question Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask Marley anything about cannabis..."
            className="pr-20"
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleMicToggle}
            disabled={isLoading}
          >
            {isListening ? (
              <MicOff className="h-4 w-4 text-red-500" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button 
          type="submit" 
          disabled={!question.trim() || isLoading}
          className="px-6"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Thinking...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Ask
            </div>
          )}
        </Button>
      </form>

      {/* Prompt Chips */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {PROMPT_CHIPS.map((chip, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleChipClick(chip)}
            >
              {chip}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

