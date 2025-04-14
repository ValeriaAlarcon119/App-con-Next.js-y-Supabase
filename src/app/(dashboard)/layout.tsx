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
      <div className="min-h-screen w-full">
        <Navbar />
        <main className="w-full">
          {children}
        </main>
      </div>
      <Toaster />
    </ProtectedRoute>
  )
} 