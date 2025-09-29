import { detectQuestionType } from '../rag/question-detector'

describe('Question Type Detection', () => {
  test('detects strain questions', () => {
    const result = detectQuestionType('What are the best strains for pain relief?')
    expect(result.type).toBe('strain')
    expect(result.confidence).toBeGreaterThan(0)
  })

  test('detects effects questions', () => {
    const result = detectQuestionType('What effects does Blue Dream have?')
    expect(result.type).toBe('effects')
    expect(result.confidence).toBeGreaterThan(0)
  })

  test('detects growing questions', () => {
    const result = detectQuestionType('How do I grow cannabis indoors?')
    expect(result.type).toBe('growing')
    expect(result.confidence).toBeGreaterThan(0)
  })

  test('detects cannabinoid questions', () => {
    const result = detectQuestionType('What is the THC content of OG Kush?')
    expect(result.type).toBe('cannabinoids')
    expect(result.confidence).toBeGreaterThan(0)
  })

  test('handles unknown questions', () => {
    const result = detectQuestionType('What is the weather like?')
    expect(result.type).toBe('strain') // Default fallback
    expect(result.confidence).toBeLessThan(0.5)
  })
})

