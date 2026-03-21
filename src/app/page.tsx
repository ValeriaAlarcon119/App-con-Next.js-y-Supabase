'use client'
import React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { 
  ArrowRight, Sparkles, Zap, Shield, Laptop, ChevronRight, FileText, Briefcase, 
  Users, Check, Palette, Share2, Instagram, Linkedin, Github, PieChart, Bell, Layout 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ClientLogos from "@/components/ClientLogos"
import { ModeToggle } from "@/components/ui/mode-toggle"

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-emerald-400 selection:text-black overflow-x-hidden selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center translate-y-[6px]">
              <img 
                src="/images/grayola-bird-logo.svg?v=2"
                alt="Grayola Bird"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground">GRAYOLA</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Características</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">Cómo funciona</Link>
            <a href="https://www.grayola.io/" target="_blank" className="hover:text-primary transition-colors">Website Oficial</a>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Link href="/login" className="text-sm font-bold hover:text-primary transition-colors text-foreground/80 hover:text-foreground">
              Login
            </Link>
            <Link 
              href="/register" 
              className="hidden md:flex items-center gap-2 agendar-prueba-button py-2.5 px-6 !h-auto !text-sm border-black/20"
            >
              Comenzar <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden"
        initial={{ opacity: 0, y: -80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false }}
      >
        {/* Abstract Background Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-400/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-pink-400/20 blur-[120px] rounded-full pointer-events-none animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-400/10 blur-[100px] rounded-full pointer-events-none animate-float-delay-2" />
        
        <div className="container mx-auto px-6 relative z-10 text-center max-w-5xl">
          <motion.div 
            className="inline-flex items-center gap-2 bg-muted/50 border border-primary/20 px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">La nueva era de gestión de proyectos</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-8 text-foreground">
            Diseño. Organización.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-pink-400 to-emerald-500 animate-gradient">
              Evolución Digital.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Grayola App es tu ecosistema definitivo para conectar clientes, diseñadores y managers.  Acelera tus flujos de trabajo con precisión milimétrica.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="/login" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 agendar-prueba-button text-base px-10 py-4"
            >
              Acceder a la Plataforma <ChevronRight className="w-5 h-5 text-black" />
            </Link>
            <Link 
              href="https://www.grayola.io/"
              target="_blank"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-muted border border-border text-foreground px-10 py-4 rounded-full text-base font-bold hover:bg-muted/80 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              Conocer Grayola Agency
            </Link>
          </div>
        </div>

        {/* Hero Dashboard Preview mockup */}
        <motion.div 
          className="container mx-auto px-6 mt-20 relative z-10"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: false }}
        >
          <div className="relative rounded-[2.5rem] overflow-hidden card-gradient-border shadow-2xl bg-card/50 backdrop-blur-xl mx-auto max-w-6xl aspect-[16/9] md:aspect-[21/9] flex items-center justify-center group">
             <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 opacity-80 group-hover:opacity-40 transition-opacity"></div>
             <img src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 dark:opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Dashboard Preview" />
             <div className="absolute z-20 text-center">
                 <div className="w-20 h-20 mx-auto bg-grayola-lime rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(180,242,100,0.4)] mb-6 animate-bounce">
                    <Laptop className="w-10 h-10 text-black" />
                 </div>
                 <h3 className="text-4xl font-black text-foreground px-4 tracking-tighter">Workspace Inteligente</h3>
             </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Client Logos Marquee */}
      <section className="py-12 bg-transparent border-b border-border/20">
        <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">
          EMPRESAS DE TODO EL MUNDO ESCALAN SUS OPERACIONES DE DISEÑO CON GRAYOLA
        </p>
        <ClientLogos />
      </section>

      {/* Benefits Section */}
      <motion.section 
        className="py-24 bg-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter">Beneficios de usar GrayolaOS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: "Marca Centralizada", desc: "Assets, guías, manuales y editables siempre al día.", icon: Shield, bg: "indigo-100", border: "#818cf8" },
              { title: "Flujo Claro", desc: "Pedidos, feedback y aprobaciones en un solo lugar.", icon: Zap, bg: "emerald-100", border: "#10b981" },
              { title: "Memoria Compartida", desc: "Historial y contexto para que el equipo no empiece de cero.", icon: Briefcase, bg: "pink-100", border: "#f472b6" },
              { title: "Colaboración", desc: "Equipos internos y externos trabajando desde la misma fuente.", icon: Users, bg: "sky-100", border: "#38bdf8" }
            ].map((benefit, i) => (
              <div key={i} className={`card-gradient-border bg-${benefit.bg}/40 p-8 rounded-[2rem] transition-all hover:shadow-2xl hover:-translate-y-2 group shadow-lg`}>
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md transform group-hover:rotate-12 transition-transform">
                  <benefit.icon className="w-7 h-7 text-black" />
                </div>
                <h3 className="font-black text-2xl mb-3 tracking-tighter">{benefit.title}</h3>
                <p className="text-black/70 text-sm font-medium leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Process Section */}
      <motion.section className="py-24 bg-black text-white rounded-[4rem] mx-4 my-8 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-black mb-8 leading-tight tracking-tighter">Gestiona todos tus pedidos a la vez <span className="text-emerald-400">sin caos.</span></h2>
              <div className="space-y-6">
                {[
                  { n: "1", t: "Crea un pedido", d: "Completa un formulario corto con todos los detalles. ¡No toma más de 2 minutos!" },
                  { n: "2", t: "Asignamos un equipo", d: "Seleccionamos al mejor grupo de especialistas y directores creativos." },
                  { n: "3", t: "Entregamos tus diseños", d: "En menos de 48h tendrás las primeras versiones para iterar hasta estar 100% satisfecho." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-full border-2 border-emerald-400 flex items-center justify-center font-black text-emerald-400 shrink-0">{step.n}</div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">{step.t}</h4>
                      <p className="text-gray-400 text-sm">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-4 group relative overflow-hidden dark:shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)]">
               <div className="aspect-video bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl">
                  {/* Decorative Floating Icons */}
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                     <div className="p-2 bg-pink-500/20 rounded-lg border border-pink-500/30 backdrop-blur-sm animate-bounce">
                        <Palette className="w-4 h-4 text-pink-400" />
                     </div>
                     <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30 backdrop-blur-sm animate-pulse">
                        <Zap className="w-4 h-4 text-emerald-400" />
                     </div>
                  </div>
                  <div className="absolute bottom-4 right-4 z-20 p-3 bg-white/10 rounded-full border border-white/20 backdrop-blur-md animate-float">
                     <PieChart className="w-5 h-5 text-white" />
                  </div>
                  
                  <img 
                    src="/images/dashboard-preview.png" 
                    alt="GrayolaOS Dashboard Preview" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  
                  {/* Dark mode 'light effect' overlay */}
                  <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
               </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <section className="py-24 bg-transparent px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black mb-6 tracking-tighter">Todo en un solo lugar.</h2>
              <p className="text-muted-foreground text-lg">Explora más de 100 servicios de diseño disponibles con nuestra suscripción.</p>
            </div>
            <Button className="agendar-prueba-button px-8 py-6 text-sm">Ver todos los servicios</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { t: "Brand Design", i: Palette, c: "emerald" },
              { t: "Social Media", i: Share2, c: "pink" },
              { t: "Video Editing", i: Zap, c: "indigo" },
              { t: "Presentations", i: Laptop, c: "sky" },
              { t: "2D Animation", i: Sparkles, c: "emerald" },
              { t: "Illustration", i: Palette, c: "pink" }
            ].map((s, i) => (
              <div key={i} className={`card-gradient-border bg-${s.c}-100/40 p-8 rounded-[2.5rem] text-center hover:bg-white hover:shadow-2xl transition-all group cursor-default shadow-md hover:-translate-y-2`}>
                <div className={`bg-white w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-${s.c}-500 transition-all shadow-sm`}>
                  <s.i className="w-7 h-7 text-black group-hover:text-white" />
                </div>
                <h4 className="font-black text-xs uppercase tracking-tighter text-black">{s.t}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-transparent px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[48px] font-black text-black mb-16 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-primary/20 px-4 py-1.5 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">+8500 proyectos</span>
                <span>terminados para 142 empresas</span>
              </div>
              <span className="text-black/60">alrededor del mundo con calidad premium</span>
            </div>
          </h2>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-muted/30 border-y border-border/20 px-6" id="pricing">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 tracking-tighter">Un equipo de diseño on demand</h2>
            <p className="text-muted-foreground text-lg">Precios transparentes y escalables.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { n: "Pro", p: "300", f: ["1 Brand", "Brand assets", "File management", "180 credits/sem", "Unlimited projects", "3 team members"] },
              { n: "Business", p: "500", f: ["5 Brands", "Brand assets", "File management", "300 credits/sem", "Unlimited projects", "5 team members"], popular: true },
              { n: "Scale", p: "1000", f: ["Unlimited brands", "Brand assets", "File management", "480 credits/sem", "Unlimited projects", "10 team members", "Priority support"] },
              { n: "Enterprise", p: "Custom", f: ["Unlimited brands", "Brand assets", "File management", "Custom credits", "Unlimited projects", "Unlimited storage", "API integrations"] }
            ].map((plan, i) => (
              <div key={i} className={`bg-card p-10 rounded-[2.5rem] border-2 ${plan.popular ? 'border-primary shadow-2xl relative' : 'border-border'} flex flex-col`}>
                {plan.popular && <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest border-2 border-black">Most Popular</span>}
                <div className="mb-8">
                   <h3 className="text-2xl font-black mb-2">{plan.n}</h3>
                   <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black">${plan.p}</span>
                      {plan.p !== 'Custom' && <span className="text-muted-foreground text-sm font-bold uppercase tracking-widest ml-1">USD/mo</span>}
                   </div>
                   {plan.p !== 'Custom' && <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Billed semi-annually</p>}
                </div>
                <ul className="space-y-4 mb-10 flex-grow">
                   {plan.f.map((f, k) => (
                     <li key={k} className="flex gap-2 items-center text-sm font-medium">
                        <Check className="w-4 h-4 text-emerald-500" /> {f}
                     </li>
                   ))}
                </ul>
                <Button className={`${plan.popular ? 'agendar-prueba-button' : 'bg-black text-white hover:bg-black/80 rounded-full py-6'} w-full font-black text-sm uppercase`}>Start Now</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Designer Network Section */}
      <section className="py-24 bg-transparent px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-emerald-50 rounded-[3rem] border-2 border-black p-12 md:p-20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <Palette className="w-96 h-96 text-emerald-600" />
             </div>
             <div className="relative z-10 max-w-2xl">
                <p className="text-emerald-700 font-black uppercase tracking-widest text-xs mb-4">PARA DISEÑADORES</p>
                <h2 className="text-5xl font-black text-black mb-8 tracking-tighter">Únete a la red de diseñadores de Grayola</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   {[
                     { t: "Trabajo 100% Remoto", d: "Desde cualquier lugar con horarios flexibles." },
                     { t: "Proyectos Constantes", d: "Flujo continuo de proyectos de empresas reconocidas." },
                     { t: "Crecimiento", d: "Feedback de directores creativos senior." },
                     { t: "Pagos Puntuales", d: "Pagos transparentes y sin demoras." }
                   ].map((item, i) => (
                     <div key={i}>
                        <h4 className="font-bold mb-1">{item.t}</h4>
                        <p className="text-black/60 text-sm">{item.d}</p>
                     </div>
                   ))}
                </div>
                <Button className="bg-black text-white hover:bg-black/90 px-10 py-6 rounded-full font-black text-sm uppercase">Aplicar como diseñador</Button>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-transparent px-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Testimonios que nos impulsan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Valentina Moreno", role: "Head of Marketing - Latam Fintech", img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Valentina" },
              { name: "Joseh Burns", role: "Founder - Lupa", img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Joseh" },
              { name: "Felipe Santamaría", role: "CEO - Rockstart", img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Felipe" },
              { name: "Claudia Garcia", role: "Design Lead - Agora Partnerships", img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Claudia" }
            ].map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border-2 border-black hover:-translate-y-2 transition-all shadow-lg">
                <div className="w-20 h-20 rounded-full border-2 border-black overflow-hidden mb-6 mx-auto">
                   <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                   <h4 className="font-black text-lg">{t.name}</h4>
                   <p className="text-muted-foreground text-[10px] font-bold uppercase mt-1 leading-tight">{t.role}</p>
                   <div className="mt-4 flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => <Sparkles key={s} className="w-3 h-3 text-emerald-400" />)}
                   </div>
                   <p className="text-sm italic text-gray-600 mt-4">"Increíble calidad y velocidad en cada entrega. Grayola ha sido clave para nuestro éxito."</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Designer Network Section */}
      <section className="py-24 bg-transparent px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="bg-pink-50 rounded-[3rem] border-2 border-black p-12 md:p-20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <Palette className="w-96 h-96 text-pink-600" />
             </div>
             <div className="relative z-10 max-w-2xl">
                <p className="text-pink-700 font-black uppercase tracking-widest text-xs mb-4">FOR DESIGNERS</p>
                <h2 className="text-5xl font-black text-black mb-8 tracking-tighter">Join the Grayola designer network</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   {[
                     { t: "Work 100% remote", d: "Work from anywhere with flexible hours." },
                     { t: "Steady projects", d: "Continuous flow of projects from recognized companies." },
                     { t: "Grow professionally", d: "Build your portfolio with real brands and feedback." },
                     { t: "On-time payments", d: "Get paid on time and transparently." }
                   ].map((item, i) => (
                     <div key={i}>
                        <h4 className="font-bold mb-1">{item.t}</h4>
                        <p className="text-black/60 text-sm">{item.d}</p>
                     </div>
                   ))}
                </div>
                <Button className="bg-black text-white hover:bg-black/90 px-10 py-6 rounded-full font-black text-sm uppercase">Sign up as a designer</Button>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-transparent px-6" id="faq">
        <div className="container mx-auto max-w-3xl">
           <div className="text-center mb-16">
              <h2 className="text-4xl font-black tracking-tighter">Preguntas Frecuentes</h2>
           </div>
           <Accordion type="single" collapsible className="space-y-4">
              {[
                { q: "¿Qué diseños están incluidos?", a: "Casi cualquier cosa que te de diseño necesites: marcas, redes sociales, presentaciones, video, etc." },
                { q: "¿Cuántos créditos necesito?", a: "Depende del plan que elijas, cada servicio tiene un costo en créditos claro." },
                { q: "¿Quiénes serán mis diseñadores?", a: "Solo trabajamos con el Top 2% de diseñadores mundiales para asegurar calidad." }
              ].map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-border rounded-2xl px-6 bg-white/50">
                  <AccordionTrigger className="font-bold text-lg hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
           </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-transparent px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-pink-50 -z-10"></div>
        <div className="container mx-auto max-w-4xl text-center border-4 border-black p-16 rounded-[4rem] bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative z-10">
           <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Sign up and upload your first request</h2>
           <p className="text-xl text-muted-foreground mb-12">Meet your next creative team instantly and let's design your first order on Grayola today.</p>
           <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button className="agendar-prueba-button px-10 py-7 text-lg">Schedule a meeting</Button>
              <Button variant="outline" className="rounded-full border-2 border-black px-10 py-7 text-lg font-black hover:bg-black hover:text-white transition-all">Explore GrayolaOS</Button>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-16 border-t border-border/50 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img src="/images/grayola-bird-logo.svg?v=2" className="w-10 h-10" alt="Logo" />
                <span className="text-2xl font-black tracking-tighter">GRAYOLA</span>
              </div>
              <p className="text-muted-foreground max-w-md text-sm mb-8">Diseño gráfico y video bajo demanda para empresas en etapa de escalamiento.</p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-pink-50 cursor-pointer transition-all group scale-100 hover:scale-110 active:scale-95">
                  <Instagram className="w-5 h-5 text-[#E4405F]" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-sky-50 cursor-pointer transition-all group scale-100 hover:scale-110 active:scale-95">
                  <Linkedin className="w-5 h-5 text-[#0077B5]" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-all group scale-100 hover:scale-110 active:scale-95">
                  <Github className="w-5 h-5 text-[#333]" />
                </div>
              </div>
            </div>
            <div>
               <h4 className="font-black text-sm uppercase tracking-widest mb-6 text-black/50">Recursos</h4>
               <ul className="space-y-4 text-sm font-bold">
                  <li><Link href="#" className="hover:text-primary transition-colors">Portafolio</Link></li>
                  <li><Link href="#pricing" className="hover:text-primary transition-colors">Precios</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Servicios</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-black text-sm uppercase tracking-widest mb-6 text-black/50">Empresa</h4>
               <ul className="space-y-4 text-sm font-bold">
                  <li><Link href="#" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Carreras</Link></li>
               </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Grayola Agency. Hecho con ❤️ desde Latam para el mundo.</p>
            <div className="flex gap-6">
               <Link href="/login">Login</Link>
               <Link href="/register">Registro</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
