import { ProtectedRoute } from '@/components/auth/protected-route'
import { Toaster } from '@/components/ui/sonner'
import { Navbar } from '@/components/dashboard/navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full overflow-x-hidden relative">
        <Navbar />
        <main className="w-full overflow-x-hidden">
          {children}
        </main>
      </div>
      <Toaster />
    </ProtectedRoute>
  )
} 