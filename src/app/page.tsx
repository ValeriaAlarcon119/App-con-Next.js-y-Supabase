'use client'
import React from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, Sparkles, Zap, Shield, Laptop, ChevronRight, FileText, Briefcase } from 'lucide-react'

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
            <Link href="/login" className="text-sm font-bold hover:text-grayola-teal transition-colors text-foreground">
              Iniciar Sesión
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-pink-400 to-emerald-400 animate-gradient">
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

      {/* Features Bento Grid */}
      <motion.section 
        id="features" 
        className="py-24 bg-background relative border-t border-border/50"
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.1 }}
      >
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-16 md:w-2/3">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground tracking-tighter">
              Un espacio, <span className="text-primary">poder ilimitado.</span>
            </h2>
            <p className="text-muted-foreground text-lg">Todo lo que necesitas para que tus equipos creativos y clientes converjan en el lugar perfecto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[300px]">
            {/* Bento Card 1 */}
            <motion.div 
              className="md:col-span-2 bg-gradient-to-br from-card to-background card-gradient-border rounded-3xl p-8 relative overflow-hidden group"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 transition-opacity duration-500">
                 <Zap className="w-32 h-32 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 relative z-10 text-foreground">Automatización Creativa</h3>
              <p className="text-muted-foreground max-w-sm relative z-10">Asigna proyectos inteligentemente. Los diseñadores reciben los requerimientos de los clientes en tiempo real, sin fricciones ni intermediarios innecesarios.</p>
              
              <div className="absolute bottom-8 left-8 flex items-center gap-2 z-10">
                <div className="w-10 h-10 rounded-full bg-emerald-400 border-4 border-background z-20 shadow-lg"></div>
                <div className="w-10 h-10 rounded-full bg-pink-400 border-4 border-background -ml-4 z-10 shadow-lg"></div>
                <div className="w-10 h-10 rounded-full bg-muted border-4 border-background -ml-4 z-0"></div>
                <span className="ml-3 text-sm font-bold text-muted-foreground">Conectando equipos</span>
              </div>
            </motion.div>

            {/* Bento Card 2 */}
            <motion.div 
              className="bg-card card-gradient-border rounded-3xl p-8 flex flex-col justify-between group hover:border-primary/50 transition-colors"
              whileHover={{ y: -5 }}
            >
              <div>
                <div className="rounded-2xl w-12 h-12 flex items-center justify-center bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Roles Seguros</h3>
                <p className="text-muted-foreground text-sm">Privacidad absoluta en cada workspace. Solo tú ves tus proyectos y asignaciones.</p>
              </div>
            </motion.div>

            {/* Bento Card 3 */}
            <motion.div 
              className="bg-card card-gradient-border rounded-3xl p-8 flex flex-col justify-between group hover:border-primary/50 transition-colors"
              whileHover={{ y: -5 }}
            >
              <div>
                <div className="rounded-2xl w-12 h-12 flex items-center justify-center bg-pink-400/10 mb-6 group-hover:bg-pink-400/20 transition-colors">
                  <FileText className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Documentos Unificados</h3>
                <p className="text-muted-foreground text-sm">Centraliza assets, branding y entregables en un solo entorno cifrado.</p>
              </div>
            </motion.div>

            {/* Bento Card 4 */}
            <motion.div 
              className="md:col-span-2 bg-gradient-to-r from-emerald-400 to-pink-400 rounded-[2rem] p-10 flex items-center justify-between relative overflow-hidden group"
              whileHover={{ scale: 1.01 }}
            >
               <div className="relative z-10 w-2/3">
                 <h3 className="text-3xl font-black text-black mb-6 tracking-tight leading-tight">Experimenta el verdadero flujo de trabajo digital.</h3>
                 <Link href="/register" className="inline-flex items-center font-bold text-black border-b-2 border-black pb-1 hover:pr-4 hover:border-transparent transition-all">
                    Crear mi cuenta gratis <ArrowRight className="w-4 h-4 ml-2" />
                 </Link>
               </div>
               <div className="absolute right-[-10%] bottom-[-10%] opacity-20 transform rotate-12 transition-transform duration-700 group-hover:rotate-0 group-hover:scale-110">
                  <Briefcase className="w-80 h-80 text-black" />
               </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-background py-16 border-t border-border/50 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="container mx-auto px-6 flex flex-col items-center relative z-10">
          <motion.div 
            className="w-12 h-12 rounded-xl bg-emerald-400 flex items-center justify-center mb-8 shadow-xl shadow-emerald-400/30"
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <span className="text-black font-black text-2xl leading-none">G</span>
          </motion.div>
          <div className="flex gap-10 text-sm font-bold text-muted-foreground mb-8">
            <Link href="https://www.grayola.io/" target="_blank" className="hover:text-primary transition-colors">Website</Link>
            <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
            <Link href="/register" className="hover:text-primary transition-colors">Registro</Link>
          </div>
          <p className="text-muted-foreground/60 text-xs">
            &copy; {new Date().getFullYear()} Grayola Agency. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
