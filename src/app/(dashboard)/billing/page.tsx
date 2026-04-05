'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreditCard, History, Zap, ShieldCheck } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 font-sans">
      <div className="page-header-card">
        <h1 className="text-3xl md:text-4xl font-black text-foreground flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-primary" />
          Facturación y Planes
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">Gestiona tu suscripción y métodos de pago</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 rounded-[2.5rem] border-2 border-border overflow-hidden shadow-xl bg-card transition-all">
          <CardHeader className="bg-primary/10 dark:bg-primary/5 border-b-2 border-border">
            <CardTitle className="text-2xl font-black text-foreground">Plan Actual: Premium</CardTitle>
            <CardDescription className="text-muted-foreground font-bold">$690 USD / Mes</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="flex items-center gap-4 p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/20">
              <Zap className="h-6 w-6 text-emerald-500" />
              <div>
                <p className="font-bold text-foreground">Uso de Créditos</p>
                <p className="text-sm text-muted-foreground">Has usado 45 de 140 créditos este mes.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-black text-lg text-foreground uppercase tracking-widest">Método de Pago</h3>
              <div className="flex items-center justify-between p-6 border-2 border-border rounded-[2rem] hover:border-primary transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-9 bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-black text-xs">VISA</div>
                  <span className="font-bold text-foreground">**** **** **** 4242</span>
                </div>
                <button className="text-sm font-black text-primary hover:underline">Editar</button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-2 border-border overflow-hidden shadow-xl bg-slate-950 text-white">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-xl font-black uppercase tracking-widest">Historial</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/5">
              <div className="p-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                <div>
                  <p className="font-bold">Marzo 2024</p>
                  <p className="text-xs text-white/40">Pagado</p>
                </div>
                <span className="font-black text-primary">$690</span>
              </div>
              <div className="p-6 flex justify-between items-center hover:bg-white/5 transition-colors">
                <div>
                  <p className="font-bold">Febrero 2024</p>
                  <p className="text-xs text-white/40">Pagado</p>
                </div>
                <span className="font-black text-primary">$690</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
