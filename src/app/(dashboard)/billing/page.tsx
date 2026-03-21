'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreditCard, History, Zap, ShieldCheck } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 font-sans">
      <div className="page-header-card">
        <h1 className="text-4xl font-black text-black flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-primary" />
          Facturación y Planes
        </h1>
        <p className="text-black/60 mt-2 font-medium">Gestiona tu suscripción y métodos de pago</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 rounded-3xl border-2 border-black overflow-hidden shadow-lg bg-white">
          <CardHeader className="bg-primary/10 border-b-2 border-black">
            <CardTitle className="text-2xl font-black">Plan Actual: Premium</CardTitle>
            <CardDescription className="text-black/60 font-bold">$690 USD / Mes</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <Zap className="h-6 w-6 text-emerald-600" />
              <div>
                <p className="font-bold text-black">Uso de Créditos</p>
                <p className="text-sm text-black/60">Has usado 45 de 140 créditos este mes.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-black text-lg">Método de Pago</h3>
              <div className="flex items-center justify-between p-4 border-2 border-black rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-zinc-100 rounded border border-zinc-200 flex items-center justify-center font-bold text-[10px]">VISA</div>
                  <span className="font-bold">**** **** **** 4242</span>
                </div>
                <button className="text-sm font-black text-primary hover:underline">Editar</button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-black overflow-hidden shadow-lg bg-black text-white">
          <CardHeader>
            <CardTitle className="text-xl font-black">Historial</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/10">
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">Marzo 2024</p>
                  <p className="text-xs text-white/40">Pagado</p>
                </div>
                <span className="font-bold">$690</span>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">Febrero 2024</p>
                  <p className="text-xs text-white/40">Pagado</p>
                </div>
                <span className="font-bold">$690</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
