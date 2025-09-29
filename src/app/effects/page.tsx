'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Search } from 'lucide-react'

interface Effect {
  effect_id: string
  name: string
  slug: string
  description?: string
}

export default function EffectsPage() {
  const [effects, setEffects] = useState<Effect[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchEffects = async () => {
      try {
        const { data, error } = await supabase
          .from('effects')
          .select('*')
          .order('name')

        if (error) {
          console.error('Error fetching effects:', error)
        } else {
          setEffects(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEffects()
  }, [supabase])

  const filteredEffects = effects.filter(effect =>
    effect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    effect.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Cannabis Effects
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Explore the various effects that different cannabis strains can produce.
        </p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search effects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEffects.map((effect) => (
          <Card key={effect.effect_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{effect.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {effect.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {effect.description}
                </p>
              )}
              
              <Badge variant="secondary" className="text-xs">
                {effect.slug}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEffects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No effects found matching your search.</p>
        </div>
      )}
    </div>
  )
}

