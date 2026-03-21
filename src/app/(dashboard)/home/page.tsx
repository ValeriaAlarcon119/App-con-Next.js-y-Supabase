'use client'
import React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  ArrowRight, Sparkles, Zap, Shield, Laptop, ChevronRight, FileText, Briefcase, 
  Users, Check, Palette, Share2, Instagram, Linkedin, Github, PieChart, Bell, Layout 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ClientLogos from "@/components/ClientLogos"
import { ModeToggle } from "@/components/ui/mode-toggle"

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const yRange = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="w-full min-h-screen bg-background text-foreground font-sans selection:bg-emerald-400 selection:text-black overflow-x-hidden selection:bg-primary/30 relative">
      {/* Hero Section */}
      <motion.section 
        className="relative pt-12 pb-12 md:pt-20 md:pb-20 overflow-hidden"
        initial={{ opacity: 0, y: -80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] lg:w-[800px] lg:h-[800px] bg-emerald-400/10 blur-[80px] sm:blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-300">GrayolaOS is now available 24/7</span>
          </motion.div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] mb-8 text-foreground text-center">
            Diseño. Organización.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] to-[#EC4899]">
              Evolución Digital.
            </span>
          </h1>

          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Centraliza tu marca, conecta la producción y preserva la memoria creativa para moverte rápido sin perder la consistencia.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Button className="agendar-prueba-button px-12 py-8 text-lg group">
              Explorar GrayolaOS <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="ghost" className="rounded-full px-8 py-8 text-lg font-black hover:bg-emerald-50 dark:hover:bg-emerald-900/10">
              Ver Portafolio
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Client Logos Section */}
      <section className="py-12 border-y border-border/50 bg-muted/10">
        <div className="container mx-auto px-6">
           <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-8">Brands worldwide scale their design operations with Grayola</p>
           <ClientLogos />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20" id="features">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-black mb-6 md:mb-8 tracking-tighter leading-none">Un espacio, <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] to-[#EC4899] font-black italic">poder ilimitado.</span></h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-12">Gestiona todos tus pedidos a la vez sin caos. Diseñado para equipos de alto rendimiento.</p>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Marca Centralizada", desc: "Assets, guías, manuales y editables siempre al día.", icon: Shield, bg: "indigo-100" },
                  { title: "Flujo Claro", desc: "Pedidos, feedback y aprobaciones en un solo lugar.", icon: Zap, bg: "emerald-100" },
                  { title: "Memoria Compartida", desc: "Historial y contexto para que el equipo no empiece de cero.", icon: Briefcase, bg: "pink-100" },
                  { title: "Colaboración", desc: "Equipos internos y externos trabajando desde la misma fuente.", icon: Users, bg: "sky-100" }
                ].map((benefit, i) => (
                  <div key={i} className={`card-gradient-border bg-${benefit.bg}/60 dark:bg-emerald-950/20 p-8 rounded-[2rem] transition-all hover:shadow-2xl hover:-translate-y-2 group shadow-lg`}>
                    <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-md transform group-hover:rotate-12 transition-transform border border-black/5 dark:border-white/10">
                      <benefit.icon className="w-7 h-7 text-black dark:text-white" />
                    </div>
                    <h3 className="font-black text-2xl mb-3 tracking-tighter text-foreground">{benefit.title}</h3>
                    <p className="text-muted-foreground dark:text-white/60 text-sm font-medium leading-relaxed">{benefit.desc}</p>
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
                     <div className="p-2 bg-primary/20 rounded-lg border border-primary/30 backdrop-blur-sm animate-pulse">
                        <Zap className="w-4 h-4 text-primary" />
                     </div>
                  </div>
                  <div className="absolute bottom-4 right-4 z-20 p-3 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
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
      </section>

      {/* Process Section */}
      <motion.section className="py-20 bg-black text-white rounded-[4rem] mx-4 my-8 relative overflow-hidden" id="how-it-works">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6 tracking-tighter">Cómo funciona Grayola</h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto">Un proceso pulido para entregarte calidad en tiempo récord.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { n: 1, t: "Crea un pedido", d: "Completa un formulario corto con todos los detalles. ¡No toma más de 2 minutos!" },
              { n: 2, t: "Asignamos un equipo", d: "Seleccionamos al mejor grupo de especialistas y directores creativos." },
              { n: 3, t: "Entregamos tus diseños", d: "En menos de 48h tendrás las primeras versiones para iterar hasta estar 100% satisfecho." }
            ].map((step, i) => (
              <div key={i} className="relative p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border-2 border-white/20 hover:border-emerald-500 transition-all group overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-8xl md:text-9xl font-black text-white/5 group-hover:text-emerald-500/10 transition-colors">{step.n}</div>
                <div className="w-10 h-10 rounded-full border-2 border-emerald-500 flex items-center justify-center font-black text-emerald-500 shrink-0 mb-6 md:mb-8">{step.n}</div>
                <h3 className="text-xl md:text-2xl font-black mb-4 tracking-tight">{step.t}</h3>
                <p className="text-white/50 text-sm md:text-base leading-relaxed">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Services Grid */}
      <section className="py-20 bg-transparent overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">

            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Servicios que transforman</h2>
              <p className="text-muted-foreground">Más de 100 servicios creativos a tu disposición.</p>
            </div>

            <Button variant="outline" className="rounded-full border-2 border-primary font-black uppercase text-[10px] md:text-xs px-6 md:px-10 py-4 md:py-6 mb-4 hover:bg-primary hover:text-black shrink-0">Ver Catálogo</Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              { t: "Brand Design", i: Palette, c: "emerald" },
              { t: "Social Media", i: Share2, c: "pink" },
              { t: "Video Editing", i: Zap, c: "indigo" },
              { t: "Presentations", i: Laptop, c: "sky" },
              { t: "2D Animation", i: Sparkles, c: "emerald" },
              { t: "Illustration", i: Palette, c: "pink" }
            ].map((s, i) => (
              <div key={i} className={`card-gradient-border bg-${s.c}-100/40 dark:bg-${s.c}-950/20 p-8 rounded-[2.5rem] text-center hover:bg-white dark:hover:bg-gray-800 hover:shadow-2xl transition-all group cursor-default shadow-md hover:-translate-y-2`}>
                <div className={`bg-white dark:bg-gray-800 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-${s.c}-500 transition-all shadow-sm border border-black/5 dark:border-white/10`}>
                  <s.i className="w-7 h-7 text-black dark:text-white group-hover:text-white" />
                </div>
                <h4 className="font-black text-xs uppercase tracking-tighter text-foreground group-hover:text-primary transition-colors">{s.t}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

    <section className="py-20 bg-transparent px-4 sm:px-6 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="font-black text-foreground mb-16 text-center leading-tight">
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col md:flex-row items-center gap-4 w-full justify-center">
                <span className="bg-primary/20 px-5 md:px-6 py-2 rounded-full border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:text-white text-lg sm:text-xl md:text-2xl break-words">+8500 proyectos</span>
                <span className="dark:text-white text-lg sm:text-xl md:text-2xl text-center">terminados para 142 empresas</span>
              </div>
              <span className="text-sm sm:text-base md:text-xl text-black/60 dark:text-white/60 text-center max-w-md">alrededor del mundo con calidad premium</span>
            </div>
          </h2>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30 border-y border-border/20 px-6" id="pricing">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 md:mb-20 px-4">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter dark:text-foreground leading-none">Un equipo de diseño on demand</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">Precios transparentes y escalables para cada etapa de tu negocio.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              { n: "Pro", p: "300", f: ["1 Brand", "Brand assets", "File management", "180 credits/sem", "Unlimited projects", "3 team members"] },
              { n: "Business", p: "500", f: ["5 Brands", "Brand assets", "File management", "300 credits/sem", "Unlimited projects", "5 team members"], popular: true },
              { n: "Scale", p: "1000", f: ["Unlimited brands", "Brand assets", "File management", "480 credits/sem", "Unlimited projects", "10 team members", "Priority support"] },
              { n: "Enterprise", p: "Custom", f: ["Unlimited brands", "Brand assets", "File management", "Custom credits", "Unlimited projects", "Unlimited storage", "API integrations"] }
            ].map((plan, i) => (
              <div key={i} className={`bg-card p-10 rounded-[2.5rem] border-2 ${plan.popular ? 'border-primary shadow-2xl relative' : 'border-border'} flex flex-col transition-all hover:scale-[1.02]`}>
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

      {/* Testimonials Section */}
      <section className="py-32 bg-transparent px-6 overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Testimonios que nos impulsan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Valentina Moreno", role: "Head of Marketing - Latam Fintech", img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Valentina" },
              { name: "Joseh Burns", role: "Founder - Lupa", img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Joseh" },
              { name: "Felipe Santamaría", role: "CEO - Rockstart", img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Felipe" },
              { name: "Claudia Garcia", role: "Design Lead - Agora Partnerships", img: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Claudia" }
            ].map((t, i) => (
              <div key={i} className="bg-white dark:bg-[#0f172a]/40 p-10 rounded-[2.5rem] border border-black/5 dark:border-white/5 hover:-translate-y-2 transition-all shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_-15px_rgba(255,255,255,0.02)] group relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 to-rose-50/30 dark:from-emerald-600/5 dark:to-rose-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="w-20 h-20 rounded-full border border-black/5 dark:border-white/10 overflow-hidden mb-8 mx-auto relative z-10 p-1 bg-white dark:bg-slate-800 shadow-inner">
                   <img src={t.img} alt={t.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="text-center text-foreground relative z-10">
                   <h4 className="font-black text-lg">{t.name}</h4>
                   <p className="text-muted-foreground text-[10px] font-bold uppercase mt-1 leading-tight">{t.role}</p>
                   <div className="mt-4 flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map(s => <Sparkles key={s} className="w-3 h-3 text-emerald-400" />)}
                   </div>
                   <p className="text-sm italic text-muted-foreground mt-4 leading-relaxed">"Increíble calidad y velocidad en cada entrega. Grayola ha sido clave para nuestro éxito."</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Designer Network Section */}
      <section className="py-32 bg-transparent px-6 border-b border-border/50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="bg-pink-50 dark:bg-pink-900/10 rounded-[4rem] border border-black/5 dark:border-white/10 p-12 md:p-24 relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 p-12 opacity-5">
                <Palette className="w-96 h-96 text-pink-600" />
             </div>
             <div className="relative z-10 max-w-2xl text-foreground text-center md:text-left">
                <p className="text-pink-700 dark:text-pink-400 font-black uppercase tracking-widest text-xs mb-4">PARA DISEÑADORES</p>
                <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-none">Únete a la <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] to-[#EC4899]">red de talentos</span> Grayola</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                   {[
                     { t: "Trabajo 100% remoto", d: "Diseña desde cualquier lugar con horarios flexibles." },
                     { t: "Proyectos constantes", d: "Flujo continuo de pedidos de empresas reconocidas." },
                     { t: "Crece profesionalmente", d: "Mejora tu portafolio con marcas reales y feedback directo." },
                     { t: "Pagos a tiempo", d: "Recibe tu pago de forma puntual y transparente." }
                   ].map((item, i) => (
                     <div key={i}>
                        <h4 className="font-black mb-2">{item.t}</h4>
                        <p className="text-muted-foreground text-sm font-medium">{item.d}</p>
                     </div>
                   ))}
                </div>
                <Button className="bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 px-12 py-8 rounded-full font-black text-sm uppercase">Postular como diseñador</Button>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-transparent px-6" id="faq">
        <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-20">
               <h2 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] to-[#EC4899]">Preguntas Frecuentes</h2>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
               {[
                 { q: "¿Qué diseños están incluidos?", a: "Casi cualquier cosa que tu equipo de diseño necesite: marcas, redes sociales, presentaciones, video, etc." },
                 { q: "¿Cuántos créditos necesito?", a: "Depende del plan que elijas, cada servicio tiene un costo en créditos claro." },
                 { q: "¿Quiénes serán mis diseñadores?", a: "Solo trabajamos con el Top 2% de diseñadores mundiales para asegurar calidad." }
               ].map((faq, i) => (
                 <AccordionItem key={i} value={`item-${i}`} className="border-none mb-4 group">
                   <AccordionTrigger className="font-black text-xl hover:no-underline py-8 text-foreground dark:text-white px-8 bg-white/40 dark:bg-slate-900/40 rounded-[2rem] border border-black/5 dark:border-white/5 data-[state=open]:rounded-b-none transition-all shadow-sm">
                     {faq.q}
                   </AccordionTrigger>
                   <AccordionContent className="text-muted-foreground text-lg pb-8 pt-4 px-8 bg-white/40 dark:bg-slate-900/40 rounded-b-[2rem] border-x border-b border-black/5 dark:border-white/5 border-t-none">
                     {faq.a}
                   </AccordionContent>
                 </AccordionItem>
               ))}
            </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 md:py-32 bg-transparent px-4 md:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-pink-50 dark:from-emerald-950 dark:via-background dark:to-pink-950 -z-10"></div>
        <div className="container mx-auto max-w-4xl text-center border border-black/5 dark:border-white/10 p-10 md:p-24 rounded-[3rem] md:rounded-[4rem] bg-white dark:bg-slate-900/60 backdrop-blur-2xl shadow-[0_50px_150px_-30px_rgba(0,0,0,0.2)] dark:shadow-[0_50px_150px_-30px_rgba(0,0,0,0.6)] relative z-10 overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#10B981] to-[#EC4899]"></div>
           <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tighter text-foreground leading-[1.05]">Da el salto a un <br /><span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10B981] to-[#EC4899] italic">diseño escalable.</span></h2>
           <p className="text-lg md:text-xl text-muted-foreground mb-12 md:mb-16 font-medium max-w-2xl mx-auto">Conoce a tu próximo equipo creativo al instante y diseñemos tu primer pedido hoy mismo.</p>
           <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
              <Button className="agendar-prueba-button px-14 py-8 text-xl">Agendar una reunión</Button>
              <Button variant="ghost" className="rounded-full px-12 py-8 text-lg font-black hover:bg-primary/10 transition-all group flex items-center gap-2">
                 Explora GrayolaOS <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-background py-24 border-t border-border/50 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10 text-black dark:text-foreground">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <img src="/images/grayola-bird-logo.svg?v=2" className="w-12 h-12" alt="Logo" />
                <span className="text-3xl font-black tracking-tighter">GRAYOLA</span>
              </div>
              <p className="text-muted-foreground max-w-md text-lg mb-10 font-medium">Diseño gráfico y video bajo demanda para empresas en etapa de escalamiento.</p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-pink-50 cursor-pointer transition-all group scale-100 hover:scale-110 active:scale-95">
                  <Instagram className="w-6 h-6 text-[#E4405F]" />
                </div>
                <div className="w-12 h-12 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-sky-50 cursor-pointer transition-all group scale-100 hover:scale-110 active:scale-95">
                  <Linkedin className="w-6 h-6 text-[#0077B5]" />
                </div>
                <div className="w-12 h-12 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-gray-50 cursor-pointer transition-all group scale-100 hover:scale-110 active:scale-95">
                  <Github className="w-6 h-6 text-[#333]" />
                </div>
              </div>
            </div>
            <div>
               <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-black/40 dark:text-white/40">Recursos</h4>
               <ul className="space-y-4 text-sm font-black">
                  <li><Link href="#" className="hover:text-primary transition-colors">Portafolio</Link></li>
                  <li><Link href="#pricing" className="hover:text-primary transition-colors">Precios</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Servicios</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
               </ul>
            </div>
            <div>
               <h4 className="font-black text-xs uppercase tracking-[0.3em] mb-8 text-black/40 dark:text-white/40">Empresa</h4>
               <ul className="space-y-4 text-sm font-black">
                  <li><Link href="#" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                  <li><Link href="#" className="hover:text-primary transition-colors">Carreras</Link></li>
               </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Grayola Agency. Hecho con ❤️ desde Latam para el mundo.</p>
            <div className="flex gap-8">
               <Link href="/login" className="hover:text-primary">Login</Link>
               <Link href="/register" className="hover:text-primary">Registro</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}