'use client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MessageCircle, HelpCircle, Mail, Phone, ExternalLink } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 font-sans">
      <div className="page-header-card">
        <h1 className="text-4xl font-black text-black flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-primary" />
          Soporte y Ayuda
        </h1>
        <p className="text-black/60 mt-2 font-medium">¿Tienes alguna duda o problema? Estamos aquí para ayudarte.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="rounded-3xl border-2 border-black overflow-hidden shadow-lg bg-white group hover:border-primary transition-colors">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border-2 border-black mb-4 group-hover:scale-110 transition-transform">
              <MessageCircle className="h-6 w-6 text-black" />
            </div>
            <CardTitle className="text-xl font-black">Chat en vivo</CardTitle>
            <CardDescription className="text-black/60 font-medium">Hablemos ahora mismo.</CardDescription>
          </CardHeader>
          <CardContent>
            <button className="agendar-prueba-button w-full py-4 text-xs">Iniciar Chat</button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-black overflow-hidden shadow-lg bg-white group hover:border-primary transition-colors">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border-2 border-black mb-4 group-hover:scale-110 transition-transform">
              <Mail className="h-6 w-6 text-black" />
            </div>
            <CardTitle className="text-xl font-black">Correo electrónico</CardTitle>
            <CardDescription className="text-black/60 font-medium">Te responderemos en 24h.</CardDescription>
          </CardHeader>
          <CardContent>
            <button className="bg-white hover:bg-black/5 text-black w-full py-4 text-xs font-black border-2 border-black rounded-full transition-all">hola@grayola.com</button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-black overflow-hidden shadow-lg bg-white group hover:border-primary transition-colors">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center border-2 border-black mb-4 group-hover:scale-110 transition-transform">
              <Phone className="h-6 w-6 text-black" />
            </div>
            <CardTitle className="text-xl font-black">Centro de Ayuda</CardTitle>
            <CardDescription className="text-black/60 font-medium">Preguntas frecuentes y tutoriales.</CardDescription>
          </CardHeader>
          <CardContent>
            <button className="bg-white hover:bg-black/5 text-black w-full py-4 text-xs font-black border-2 border-black rounded-full transition-all">Ir al Centro</button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-black text-white p-12 rounded-[2.5rem] border-2 border-black shadow-xl text-center space-y-6">
        <h2 className="text-3xl font-black tracking-tight">¿No encuentras lo que buscas?</h2>
        <p className="text-white/60 font-medium max-w-xl mx-auto">Nuestro equipo de soporte está disponible de lunes a viernes de 8:00 AM a 6:00 PM (GMT-5).</p>
        <div className="flex justify-center gap-4">
          <button className="agendar-prueba-button px-10 py-5 text-sm">Enviar un ticket</button>
        </div>
      </div>
    </div>
  )
}
