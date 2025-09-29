import { QuestionType } from '@/lib/types'

const STRAIN_KEYWORDS = [
  'strain', 'strains', 'cultivar', 'chemovar', 'variety', 'genetics',
  'blue dream', 'og kush', 'sour diesel', 'white widow', 'purple haze'
]

const EFFECTS_KEYWORDS = [
  'effect', 'effects', 'euphoric', 'relaxing', 'energizing', 'sedating',
  'uplifting', 'creative', 'focused', 'sleepy', 'happy', 'giggly'
]

const GROWING_KEYWORDS = [
  'grow', 'growing', 'cultivation', 'plant', 'seedling', 'vegetative',
  'flowering', 'harvest', 'yield', 'ppfd', 'light', 'nutrients', 'soil',
  'hydroponic', 'indoor', 'outdoor', 'greenhouse'
]

const PLANTS_KEYWORDS = [
  'plant', 'plants', 'seedling', 'clone', 'mother', 'phenotype',
  'genotype', 'morphology', 'structure', 'height', 'width'
]

const PRODUCTS_KEYWORDS = [
  'product', 'products', 'edible', 'concentrate', 'vape', 'tincture',
  'topical', 'capsule', 'gummy', 'chocolate', 'beverage'
]

const AROMA_FLAVOR_KEYWORDS = [
  'aroma', 'flavor', 'taste', 'smell', 'citrus', 'pine', 'earthy',
  'floral', 'fruity', 'spicy', 'sweet', 'sour', 'terpene', 'terpenes'
]

const CANNABINOIDS_KEYWORDS = [
  'thc', 'cbd', 'cbn', 'cbg', 'cannabinoid', 'cannabinoids',
  'potency', 'percentage', 'ratio', 'concentration', 'content'
]

export function detectQuestionType(question: string): QuestionType {
  const lowerQuestion = question.toLowerCase()
  
  // Check for strain-related keywords
  const strainScore = STRAIN_KEYWORDS.filter(keyword => 
    lowerQuestion.includes(keyword)
  ).length
  
  // Check for effects-related keywords
  const effectsScore = EFFECTS_KEYWORDS.filter(keyword => 
    lowerQuestion.includes(keyword)
  ).length
  
  // Check for growing-related keywords
  const growingScore = GROWING_KEYWORDS.filter(keyword => 
    lowerQuestion.includes(keyword)
  ).length
  
  // Check for plants-related keywords
  const plantsScore = PLANTS_KEYWORDS.filter(keyword => 
    lowerQuestion.includes(keyword)
  ).length
  
  // Check for products-related keywords
  const productsScore = PRODUCTS_KEYWORDS.filter(keyword => 
    lowerQuestion.includes(keyword)
  ).length
  
  // Check for aroma/flavor-related keywords
  const aromaFlavorScore = AROMA_FLAVOR_KEYWORDS.filter(keyword => 
    lowerQuestion.includes(keyword)
  ).length
  
  // Check for cannabinoids-related keywords
  const cannabinoidsScore = CANNABINOIDS_KEYWORDS.filter(keyword => 
    lowerQuestion.includes(keyword)
  ).length
  
  const scores = [
    { type: 'strain' as const, score: strainScore },
    { type: 'effects' as const, score: effectsScore },
    { type: 'growing' as const, score: growingScore },
    { type: 'plants' as const, score: plantsScore },
    { type: 'products' as const, score: productsScore },
    { type: 'aroma_flavor' as const, score: aromaFlavorScore },
    { type: 'cannabinoids' as const, score: cannabinoidsScore }
  ]
  
  const maxScore = Math.max(...scores.map(s => s.score))
  
  if (maxScore === 0) {
    return { type: 'strain', confidence: 0.1 } // Default fallback
  }
  
  const bestMatch = scores.find(s => s.score === maxScore)!
  const confidence = Math.min(maxScore / 3, 1) // Normalize confidence
  
  return {
    type: bestMatch.type,
    confidence
  }
}
