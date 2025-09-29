'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Strain } from '@/lib/types'
import { Search, Heart, Star } from 'lucide-react'
import Link from 'next/link'

export default function StrainsPage() {
  const [strains, setStrains] = useState<Strain[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStrains = async () => {
      try {
        const { data, error } = await supabase
          .from('strains')
          .select(`
            strain_id,
            name,
            description,
            strain_effects(effects(name, slug)),
            strain_conditions(conditions(name, slug))
          `)
          .limit(20)

        if (error) {
          console.error('Error fetching strains:', error)
        } else {
          setStrains(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStrains()
  }, [supabase])

  const filteredStrains = strains.filter(strain =>
    strain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strain.description?.toLowerCase().includes(searchTerm.toLowerCase())
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
          Cannabis Strains
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Explore our comprehensive database of cannabis strains with detailed information about effects, growing, and more.
        </p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search strains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStrains.map((strain) => (
          <Card key={strain.strain_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{strain.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {strain.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {strain.description}
                </p>
              )}
              
              {strain.strain_effects && strain.strain_effects.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Effects:</h4>
                  <div className="flex flex-wrap gap-1">
                    {strain.strain_effects.slice(0, 3).map((effect: any) => (
                      <Badge key={effect.effects[0]?.slug || 'unknown'} variant="secondary" className="text-xs">
                        {effect.effects[0]?.name || 'Unknown'}
                      </Badge>
                    ))}
                    {strain.strain_effects.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{strain.strain_effects.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              {strain.strain_conditions && strain.strain_conditions.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Conditions:</h4>
                  <div className="flex flex-wrap gap-1">
                    {strain.strain_conditions.slice(0, 2).map((condition: any) => (
                      <Badge key={condition.conditions[0]?.slug || 'unknown'} variant="outline" className="text-xs">
                        {condition.conditions[0]?.name || 'Unknown'}
                      </Badge>
                    ))}
                    {strain.strain_conditions.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{strain.strain_conditions.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <Button asChild className="w-full mt-4">
                <Link href={`/strains/${strain.strain_id}`}>
                  View Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStrains.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No strains found matching your search.</p>
        </div>
      )}
    </div>
  )
}

