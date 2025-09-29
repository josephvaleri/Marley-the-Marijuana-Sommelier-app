export interface User {
  id: string
  email: string
  app_role: 'admin' | 'moderator' | 'user'
  avatar_url?: string
  trial_started_at?: string
  subscription_status?: string
  price_id?: string
  renewal_at?: string
}

export interface QAQuestion {
  question_id: string
  user_id?: string
  text: string
  created_at: string
}

export interface QAAnswer {
  answer_id: string
  question_id: string
  source: 'database' | 'reference' | 'openai'
  answer_md: string
  confidence?: number
  created_at: string
}

export interface QAFeedback {
  question_id: string
  answer_id: string
  user_id: string
  feedback: 1 | -1
  created_at: string
}

export interface MLTrainingItem {
  item_id: string
  question_id: string
  answer_id: string
  status: 'pending' | 'accepted' | 'denied' | 'exported'
  moderator_user_id?: string
  notes?: string
  updated_at: string
}

export interface Strain {
  strain_id: string
  name: string
  breeder_id?: string
  cultivar_type?: string
  chemovar_type?: string
  description?: string
  search_tsv?: string
  strain_effects?: Array<{
    effects: {
      name: any
      slug: any
    }[]
  }>
  strain_conditions?: Array<{
    conditions: {
      name: any
      slug: any
    }[]
  }>
}

export interface Effect {
  effect_id: string
  name: string
  slug: string
  description?: string
}

export interface Condition {
  condition_id: string
  name: string
  slug: string
  description?: string
}

export interface Terpene {
  terpene_id: string
  name: string
  slug: string
  description?: string
}

export interface AromaFlavorNote {
  note_id: string
  name: string
  slug: string
  description?: string
}

export interface AnswerResult {
  md: string
  source: 'database' | 'reference' | 'openai'
  confidence?: number
  question_id: string
  answer_id: string
  citations?: string[]
}

export interface QuestionType {
  type: 'strain' | 'effects' | 'growing' | 'plants' | 'products' | 'aroma_flavor' | 'cannabinoids'
  confidence: number
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  trial_days: number
}

