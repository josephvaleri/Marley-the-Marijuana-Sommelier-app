'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { Heart, Star, Share2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface StrainDetails {
  strain_id: string
  name: string
  description?: string
  breeder_id?: string
  cultivar_type?: string
  chemovar_type?: string
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
  strain_notes?: Array<{
    aroma_flavor_notes: {
      name: string
      slug: string
    }
  }>
  strain_typical_ranges?: Array<{
    cannabinoids: {
      name: any
    }[]
    min_value: any
    max_value: any
  }>
}

export default function StrainPage() {
  const params = useParams()
  const strainId = params.id as string
  const [strain, setStrain] = useState<StrainDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorited, setIsFavorited] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchStrain = async () => {
      try {
        const { data, error } = await supabase
          .from('strains')
          .select(`
            strain_id,
            name,
            description,
            breeder_id,
            cultivar_type,
            chemovar_type,
            strain_effects(effects(name, slug)),
            strain_conditions(conditions(name, slug)),
            strain_note(aroma_flavor_notes(name, slug)),
            strain_typical_ranges(cannabinoids(name), min_value, max_value)
          `)
          .eq('strain_id', strainId)
          .single()

        if (error) {
          console.error('Error fetching strain:', error)
        } else {
          setStrain(data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (strainId) {
      fetchStrain()
    }
  }, [strainId, supabase])

  const handleFavorite = async () => {
    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('strain_id', strainId)
        
        if (error) {
          toast.error('Failed to remove from favorites')
        } else {
          setIsFavorited(false)
          toast.success('Removed from favorites')
        }
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({ strain_id: strainId })
        
        if (error) {
          toast.error('Failed to add to favorites')
        } else {
          setIsFavorited(true)
          toast.success('Added to favorites')
        }
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!strain) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Strain Not Found</h1>
          <p className="text-gray-600 mb-4">The strain you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/strains">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Strains
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/strains">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Strains
          </Link>
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {strain.name}
            </h1>
            {strain.cultivar_type && (
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {strain.cultivar_type} • {strain.chemovar_type}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavorite}
              className={isFavorited ? 'text-red-500' : ''}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="effects">Effects</TabsTrigger>
              <TabsTrigger value="growing">Growing</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {strain.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">
                      {strain.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {strain.strain_typical_ranges && strain.strain_typical_ranges.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cannabinoid Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {strain.strain_typical_ranges.map((range, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium">{range.cannabinoids[0]?.name || 'Unknown'}</span>
                          <span className="text-gray-600">
                            {range.min_value}% - {range.max_value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="effects" className="space-y-6">
              {strain.strain_effects && strain.strain_effects.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Effects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {strain.strain_effects.map((effect, index) => (
                        <Badge key={index} variant="secondary">
                          {effect.effects[0]?.name || 'Unknown'}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {strain.strain_conditions && strain.strain_conditions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Medical Conditions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {strain.strain_conditions.map((condition, index) => (
                        <Badge key={index} variant="outline">
                          {condition.conditions[0]?.name || 'Unknown'}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {strain.strain_notes && strain.strain_notes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Aroma & Flavor</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {strain.strain_notes.map((note, index) => (
                        <Badge key={index} variant="outline">
                          {note.aroma_flavor_notes.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="growing">
              <Card>
                <CardHeader>
                  <CardTitle>Growing Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Growing information for {strain.name} will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>User Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Reviews for {strain.name} will be available soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Type</h4>
                <div className="flex gap-2">
                  {strain.cultivar_type && (
                    <Badge variant="secondary">{strain.cultivar_type}</Badge>
                  )}
                  {strain.chemovar_type && (
                    <Badge variant="outline">{strain.chemovar_type}</Badge>
                  )}
                </div>
              </div>
              
              {strain.strain_effects && strain.strain_effects.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Top Effects</h4>
                  <div className="space-y-1">
                    {strain.strain_effects.slice(0, 3).map((effect, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {effect.effects[0]?.name || 'Unknown'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                onClick={handleFavorite} 
                variant={isFavorited ? "default" : "outline"}
                className="w-full"
              >
                <Heart className={`mr-2 h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="mr-2 h-4 w-4" />
                Share Strain
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

