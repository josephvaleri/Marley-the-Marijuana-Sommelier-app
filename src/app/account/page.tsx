'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/lib/types'
import { User as UserIcon, Heart, CreditCard, Settings } from 'lucide-react'
import Link from 'next/link'

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [favorites, setFavorites] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        window.location.href = '/auth/sign-in'
        return
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single()

      if (profile) {
        setUser(profile)
      }

      // Get user favorites
      const { data: favData } = await supabase
        .from('favorites')
        .select(`
          strain_id,
          strains(name, description)
        `)
        .eq('user_id', authUser.id)

      setFavorites(favData || [])
      setIsLoading(false)
    }

    fetchUserData()
  }, [supabase])

  const getSubscriptionStatus = () => {
    if (user?.subscription_status === 'active') {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
    }
    if (user?.trial_started_at) {
      const trialEnd = new Date(user.trial_started_at)
      trialEnd.setDate(trialEnd.getDate() + 7)
      if (new Date() < trialEnd) {
        const daysLeft = Math.ceil((trialEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          Trial ({daysLeft} days left)
        </Badge>
      }
      return <Badge className="bg-red-100 text-red-800 border-red-200">Trial Expired</Badge>
    }
    return <Badge variant="outline">No Subscription</Badge>
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
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

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Account Not Found</h1>
          <p className="text-gray-600">Please sign in to access your account.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Account
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your profile, subscription, and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Heart className="mr-2 h-4 w-4" />
                Favorites
              </TabsTrigger>
              <TabsTrigger value="billing">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Account Type</label>
                    <div className="mt-1">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        {user.app_role}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Member Since</label>
                    <p className="text-gray-900">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Favorite Strains</CardTitle>
                </CardHeader>
                <CardContent>
                  {favorites.length > 0 ? (
                    <div className="space-y-4">
                      {favorites.map((fav) => (
                        <div key={fav.strain_id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{fav.strains.name}</h3>
                            {fav.strains.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {fav.strains.description}
                              </p>
                            )}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/strains/${fav.strain_id}`}>
                              View
                            </Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No favorite strains yet</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Start exploring strains and add them to your favorites
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/strains">Browse Strains</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current Status</span>
                    {getSubscriptionStatus()}
                  </div>
                  
                  {user.subscription_status === 'active' && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Next Billing Date</label>
                      <p className="text-gray-900">
                        {user.renewal_at ? new Date(user.renewal_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  )}
                  
                  {user.trial_started_at && !user.subscription_status && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Trial Started</label>
                      <p className="text-gray-900">
                        {new Date(user.trial_started_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    {user.subscription_status !== 'active' ? (
                      <Button className="w-full">
                        Upgrade to Premium
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full">
                        Manage Subscription
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Favorite Strains</span>
                <span className="font-medium">{favorites.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Type</span>
                <Badge variant="outline">{user.app_role}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/strains">
                  Browse Strains
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/">
                  Ask Marley
                </Link>
              </Button>
              {user.app_role === 'admin' && (
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin">
                    Admin Panel
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

