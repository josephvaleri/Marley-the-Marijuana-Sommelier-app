import { AvatarMarley } from '@/components/AvatarMarley'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <AvatarMarley state="idle" className="scale-75" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Marley the Marijuana Sommelier
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Your expert cannabis consultant
            </p>
          </div>
          
          {/* Auth Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

