import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'
import Sidebar from '@/components/admin/Sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.Node
}) {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen bg-vintage-cream">
      <Sidebar />
      <main className="flex-1">
        <div className="bg-retro-purple border-b-4 border-vintage-brown px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-vintage-brown font-pixel">
              思い出売場 CMS
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-vintage-brown font-bold">
                👤 {user.name}
              </span>
              <span className="px-3 py-1 bg-retro-pink text-white rounded-full text-sm font-bold">
                管理者
              </span>
            </div>
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
