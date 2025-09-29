'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { Search, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface GrowGuide {
  guide_id: string
  title: string
  content?: string
  strain_id?: string
  strains?: {
    name: string
  }
}

export default function GrowGuidesPage() {
  const [guides, setGuides] = useState<GrowGuide[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const { data, error } = await supabase
          .from('grow_guides')
          .select(`
            guide_id,
            title,
            content,
            strain_id,
            strains(name)
          `)
          .order('title')

        if (error) {
          console.error('Error fetching guides:', error)
        } else {
          setGuides(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGuides()
  }, [supabase])

  const filteredGuides = guides.filter(guide =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.strains?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
          Growing Guides
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Learn how to grow cannabis with our comprehensive guides and tips.
        </p>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search growing guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <Card key={guide.guide_id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{guide.title}</CardTitle>
              {guide.strains && (
                <Badge variant="outline" className="w-fit">
                  {guide.strains.name}
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {guide.content && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {guide.content}
                </p>
              )}
              
              <Button variant="outline" size="sm" asChild>
                <Link href={`/grow-guides/${guide.guide_id}`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read Guide
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No growing guides found matching your search.</p>
        </div>
      )}
    </div>
  )
}

