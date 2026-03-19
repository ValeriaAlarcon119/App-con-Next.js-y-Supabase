'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, ChevronRight, ChevronUp, ExternalLink, Github, Instagram, Laptop, Linkedin, Mail, Palette, Phone, Share2, FileText, Briefcase, Zap, Shield, Sparkles } from "lucide-react"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ClientLogos from "@/components/ClientLogos"
import { Suspense } from "react"
import { cn } from "@/lib/utils"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="relative w-full overflow-x-hidden font-sans bg-gradient-to-br from-emerald-50 via-white to-pink-50 min-h-screen">
      <div className="w-full">

        <motion.div
          className="w-full min-h-screen bg-transparent"
          initial={{ opacity: 0, y: -80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false }}
        >
          <div className="flex flex-col min-h-screen w-full max-w-6xl mx-auto px-4">
            <div className="absolute left-1/2 -translate-x-1/2 top-[-5vh] w-[350px] h-[350px] z-10 opacity-100 flex items-center justify-center">
              <img
                src="/images/grayola-bird-logo.svg"
                alt="Grayola Bird"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-grow flex items-center justify-center">
              <div className="relative z-20 text-center mt-[20vh] max-w-6xl mx-auto">
                <h1 className="mb-8 text-4xl sm:text-5xl md:text-[65px] lg:text-[72px] tracking-tight font-black text-black mx-auto leading-[1.1] max-w-[1500px]">
                  Suscripción de diseño para<br />
                  equipos que necesitan <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-pink-400 animate-gradient">
                    velocidad y calidad
                  </span>
                </h1>
                <p className="text-base md:text-lg text-black/70 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
                  Escala y delega todas la operaciones de diseño de forma rápida y sencilla, sin la preocupación de contratar o administrar recursos adicionales.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-10">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                    Diseño gráfico
                  </span>
                  <span className="bg-pink-100 text-pink-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-pink-200">
                    Edición de video
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                  <button className="agendar-prueba-button px-10 py-5 text-sm">
                    Agendar prueba
                  </button>
                  <div className="flex flex-col items-start text-left">
                    <p className="text-black/60 font-medium text-[10px] uppercase tracking-widest">
                      Agenda una reunión
                    </p>
                    <p className="text-black font-black text-sm">
                      37 días en tu primer mes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="py-16 bg-transparent overflow-hidden">
          <div className="max-w-6xl mx-auto px-4">
            <h3 className="text-center text-black text-sm font-medium uppercase tracking-[0.2em] mb-16">
              EMPRESAS DE TODO EL MUNDO ESCALAN SUS OPERACIONES DE DISEÑO CON GRAYOLA
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center animate-marquee-left">
              <div className="text-lg font-black text-black border-2 border-t-[1px] border-b-[3px] border-black py-1.5 px-3 text-center hover:bg-black hover:text-white transition-colors rounded-lg w-full">
                Fundraising
              </div>
              <div className="text-lg font-black text-black border-2 border-t-[1px] border-b-[3px] border-black py-1.5 px-3 text-center hover:bg-black hover:text-white transition-colors rounded-lg w-full">
                Mavericks
              </div>
              <div className="text-lg font-black text-black border-2 border-t-[1px] border-b-[3px] border-black py-1.5 px-3 text-center hover:bg-black hover:text-white transition-colors rounded-lg w-full">
                Payana
              </div>
              <div className="text-lg font-black text-black border-2 border-t-[1px] border-b-[3px] border-black py-1.5 px-3 text-center hover:bg-black hover:text-white transition-colors rounded-lg w-full">
                Naranja
              </div>
              <div className="text-lg font-black text-black border-2 border-t-[1px] border-b-[3px] border-black py-1.5 px-3 text-center hover:bg-black hover:text-white transition-colors rounded-lg w-full">
                Finky
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center mt-6 animate-marquee-right">
              <div className="text-lg font-black text-black border-2 border-t-[1px] border-b-[3px] border-black py-1.5 px-3 text-center hover:bg-black hover:text-white transition-colors rounded-lg w-full">
                Frubana
              </div>
              <div className="text-lg font-black text-black border-2 border-t-[1px] border-b-[3px] border-black py-1.5 px-3 text-center hover:bg-black hover:text-white transition-colors rounded-lg w-full">
                LaHaus
              </div>
              <div className="text-lg font-black text-black border-2 border-t-[1px] border-b-[3px] border-black py-1.5 px-3 text-center hover:bg-black hover:text-white transition-colors rounded-lg w-full">
                Hoytrabajas
              </div>
              <div className="text-lg font-black text-black border-2 border-t-[1px] border-b-[3px] border-black py-1.5 px-3 text-center hover:bg-black hover:text-white transition-colors rounded-lg w-full">
                Rockstart
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes marquee-left {
            from { transform: translateX(0); }
            to { transform: translateX(-10%); }
          }

          @keyframes marquee-right {
            from { transform: translateX(0); }
            to { transform: translateX(10%); }
          }

          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }

          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes float-slow {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(10px, -10px); }
            50% { transform: translate(20px, 0); }
            75% { transform: translate(10px, 10px); }
          }

          @keyframes grow {
            0% { width: 0; }
            100% { width: 75%; }
          }

          @keyframes scale-sequence-1 {
            0%, 15%, 100% { transform: scale(1); }
            5%, 10% { transform: scale(1.15); }
          }

          @keyframes scale-sequence-2 {
            0%, 30%, 100% { transform: scale(1); }
            20%, 25% { transform: scale(1.15); }
          }

          @keyframes scale-sequence-3 {
            0%, 45%, 100% { transform: scale(1); }
            35%, 40% { transform: scale(1.15); }
          }

          .animate-marquee-left {
            animation: marquee-left 3s linear infinite alternate;
          }

          .animate-marquee-right {
            animation: marquee-right 3s linear infinite alternate;
          }

          .animate-bounce-slow {
            animation: bounce-slow 3s ease-in-out infinite;
          }

          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }

          .animate-float-slow {
            animation: float-slow 8s ease-in-out infinite;
          }

          .animate-grow {
            animation: grow 2s ease-out forwards;
          }

          .animate-pulse-slow {
            animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }

          .animate-scale-1 {
            animation: scale-sequence-1 8s ease-in-out infinite;
          }

          .animate-scale-2 {
            animation: scale-sequence-2 8s ease-in-out infinite;
          }

          .animate-scale-3 {
            animation: scale-sequence-3 8s ease-in-out infinite;
          }
        `}</style>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                const container = document.getElementById('mouseMoveContainer');
                if (!container) return;
                
                const elements = container.querySelectorAll('[data-depth]');
                let lastX = 0;
                let lastY = 0;
                
                // Posición inicial del mouse en el centro
                const initialX = window.innerWidth / 2;
                const initialY = window.innerHeight / 2;
                lastX = initialX;
                lastY = initialY;
                
                function updatePositions(x, y) {
                  // Suavizado de movimiento
                  lastX = lastX + (x - lastX) * 0.03;
                  lastY = lastY + (y - lastY) * 0.03;
                  
                  elements.forEach(element => {
                    const depth = parseFloat(element.getAttribute('data-depth'));
                    const moveX = (lastX - window.innerWidth / 2) * depth * 0.5;
                    const moveY = (lastY - window.innerHeight / 2) * depth * 0.5;
                    
                    element.style.transform = \`translate(\${moveX}px, \${moveY}px)\`;
                  });
                }
                
                document.addEventListener('mousemove', function(e) {
                  updatePositions(e.clientX, e.clientY);
                });
                
                // Animación suave inicial
                setInterval(() => {
                  if (!container.classList.contains('mouse-moved')) {
                    const now = Date.now() / 1000;
                    const x = initialX + Math.sin(now * 0.5) * 50;
                    const y = initialY + Math.cos(now * 0.3) * 30;
                    updatePositions(x, y);
                  }
                }, 1000/30);
                
                // Detener flotación automática cuando se mueve el mouse
                document.addEventListener('mousemove', function() {
                  container.classList.add('mouse-moved');
                }, { once: true });
              });
            `
          }}
        />

        <motion.section
          className="bg-transparent py-24"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
        >
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-2xl text-black font-medium leading-relaxed relative">
                <span className="absolute -left-10 top-0 text-8xl font-black text-emerald-300 opacity-20" style={{ transform: 'translateY(-30%) rotate(-15deg)' }}>"</span>
                Grayola se adapta y respalda a empresas y agencias de todos los tamaños, escalando sus operaciones de diseño a gran escala.
                <span className="absolute -right-10 bottom-0 text-8xl font-black text-pink-300 opacity-20" style={{ transform: 'translateY(30%) rotate(-15deg)' }}>"</span>
              </p>

              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="bg-emerald-50/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-black flex items-center justify-center transform transition-all hover:scale-105 duration-300 animate-scale-1 shadow-md">
                  <span className="text-3xl font-black text-emerald-600">142+</span>
                </div>
                <div className="bg-pink-50/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-black flex items-center justify-center transform transition-all hover:scale-105 duration-300 animate-scale-2 shadow-md">
                  <span className="text-3xl font-black text-pink-600">4000+</span>
                </div>
                <div className="bg-emerald-50/50 backdrop-blur-sm p-6 rounded-2xl border-2 border-black flex items-center justify-center transform transition-all hover:scale-105 duration-300 animate-scale-3 shadow-md">
                  <span className="text-3xl font-black text-emerald-600">24/7</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-200 to-pink-200 opacity-20 rounded-xl blur-[100px] animate-pulse-slow"></div>
              <h2 className="text-[42px] font-black leading-tight text-black relative z-10 bg-white/40 backdrop-blur-md p-10 rounded-[2rem] card-gradient-border">
                Un <span className="inline-flex items-center gap-2 bg-emerald-100 px-3 py-1 rounded-full border border-black transform transition-all hover:scale-105 duration-300 hover:shadow-lg">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-black flex items-center justify-center animate-spin-slow">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-[42px]">equipo creativo</span>
                </span> listo para diseñar a cualquier escala
              </h2>

              <div className="absolute -bottom-10 -right-10 w-40 h-40">
                <div className="relative w-full h-full">
                  <div className="absolute top-0 left-0 w-8 h-8 bg-emerald-400 rounded-full animate-float-slow"></div>
                  <div className="absolute top-10 left-20 w-6 h-6 bg-pink-400 rounded-full animate-float-slow delay-300"></div>
                  <div className="absolute top-20 left-5 w-10 h-10 bg-emerald-200 rounded-full animate-float-slow delay-700"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="bg-transparent py-24"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center mb-16 relative">
              <span className="relative inline-block px-8 py-3 bg-gradient-to-r from-emerald-100 to-pink-100 rounded-2xl border-2 border-black shadow-lg">
                ¿Cómo funciona?
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center relative group">
                <div className="mb-6 relative flex justify-center w-full">
                  <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center border-2 border-black relative overflow-hidden group-hover:border-emerald-400 transition-colors duration-300">
                    <div className="absolute -inset-1 border-2 border-emerald-400 opacity-30 animate-pulse rounded-xl"></div>
                    <Zap className="w-8 h-8 text-black" />
                  </div>
                  <div className="absolute top-0 right-1/3 -mr-2 -mt-2 w-7 h-7 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-black shadow-md">
                    <span className="text-xs font-black">1</span>
                  </div>
                </div>
                <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border-2 border-black group-hover:border-emerald-400 transition-colors duration-300 w-full h-full shadow-sm">
                  <h3 className="text-2xl font-black text-black mb-4 text-center">
                    Crea<br />un pedido
                  </h3>
                  <p className="text-lg text-black/80 font-medium">
                    Completa un breve formulario con todos los detalles que tengas en mente para tu diseño. ¡No te tomará más de 2 minutos!
                  </p>
                  <div className="w-full h-1.5 bg-black/5 rounded-full mt-8 overflow-hidden">
                    <div className="h-full w-0 bg-emerald-400 group-hover:w-full transition-all duration-1000"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center relative group">
                <div className="mb-6 relative flex justify-center w-full">
                  <div className="w-16 h-16 bg-pink-50 rounded-xl flex items-center justify-center border-2 border-black relative overflow-hidden group-hover:border-pink-400 transition-colors duration-300">
                    <div className="absolute -inset-1 border-2 border-pink-400 opacity-30 animate-pulse rounded-xl"></div>
                    <Briefcase className="w-8 h-8 text-black" />
                  </div>
                  <div className="absolute top-0 right-1/3 -mr-2 -mt-2 w-7 h-7 bg-pink-400 rounded-full flex items-center justify-center border-2 border-black shadow-md">
                    <span className="text-xs font-black">2</span>
                  </div>
                </div>
                <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border-2 border-black group-hover:border-pink-400 transition-colors duration-300 w-full h-full shadow-sm">
                  <h3 className="text-2xl font-black text-black mb-4 text-center">
                    Lo asignamos<br />a nuestro equipo
                  </h3>
                  <p className="text-lg text-black/80 font-medium">
                    Nuestro equipo seleccionará al mejor grupo de especialistas para tu proyecto, con un director creativo y diseñadores dedicados.
                  </p>
                  <div className="w-full h-1.5 bg-black/5 rounded-full mt-8 overflow-hidden">
                    <div className="h-full w-0 bg-pink-400 group-hover:w-full transition-all duration-1000"></div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center relative group">
                <div className="mb-6 relative flex justify-center w-full">
                  <div className="w-16 h-16 bg-emerald-50 rounded-xl flex items-center justify-center border-2 border-black relative overflow-hidden group-hover:border-emerald-400 transition-colors duration-300">
                    <div className="absolute -inset-1 border-2 border-emerald-400 opacity-30 animate-pulse rounded-xl"></div>
                    <FileText className="w-8 h-8 text-black" />
                  </div>
                  <div className="absolute top-0 right-1/3 -mr-2 -mt-2 w-7 h-7 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-black shadow-md">
                    <span className="text-xs font-black">3</span>
                  </div>
                </div>
                <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] border-2 border-black group-hover:border-emerald-400 transition-colors duration-300 w-full h-full shadow-sm">
                  <h3 className="text-2xl font-black text-black mb-4 text-center">
                    Entregamos<br />tus diseños
                  </h3>
                  <p className="text-lg text-black/80 font-medium">
                    Recibe las primeras iteraciones de tus pedidos en tiempo récord y con tu feedback haremos ajustes lo más rápido posible.
                  </p>
                  <div className="w-full h-1.5 bg-black/5 rounded-full mt-8 overflow-hidden">
                    <div className="h-full w-0 bg-emerald-400 group-hover:w-full transition-all duration-1000"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="bg-transparent py-24"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
        >
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            <div className="relative overflow-hidden rounded-[2.5rem] card-gradient-border p-10 bg-white/20 backdrop-blur-xl transform transition-all hover:scale-[1.02] duration-500 shadow-2xl">
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-emerald-400 rounded-full opacity-10 animate-pulse"></div>
              <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-pink-400 rounded-full opacity-10 animate-pulse delay-700"></div>
              <h2 className="text-[64px] font-black leading-[1.1] text-black relative z-10 tracking-tighter">
                Te encantará<br />
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-pink-600">
                  nuestra aplicación
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-emerald-100 -z-10" style={{ transform: 'translateY(4px) rotate(-1deg)' }}></span>
                </span>
              </h2>
            </div>
            <div className="space-y-8 relative">
              <p className="text-xl text-black/80 font-medium leading-relaxed bg-white/30 backdrop-blur-sm p-8 rounded-[2rem] border border-black/10 shadow-sm">
                Nuestra plataforma de gestión creativa te brinda la posibilidad de enviar proyectos, dar feedback, y recibir todos tus proyectos, incluyendo sus editables, todo en un mismo lugar.
              </p>
              <div className="relative group flex justify-center">
                <div className="absolute inset-0 bg-emerald-400 blur-[80px] opacity-10 group-hover:opacity-30 transition-all duration-700 rounded-2xl"></div>
                <div className="bg-white/50 backdrop-blur-md rounded-[2rem] p-10 text-center inline-block border-2 border-black relative transform transition-all group-hover:translate-y-[-5px] duration-300 shadow-xl">
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center border-2 border-black shadow-lg">
                    <span className="text-[10px] font-black text-pink-600 uppercase tracking-tighter">wow!</span>
                  </div>
                  <p className="text-5xl font-black text-black mb-2 relative tracking-tighter">
                    <span className="inline-block animate-bounce-slow text-emerald-500">+</span>3900
                  </p>
                  <p className="text-lg text-black/70 font-bold leading-tight">pedidos<br />completados</p>
                  <div className="w-full h-2 bg-black/5 rounded-full mt-6 overflow-hidden">
                    <div className="h-full w-3/4 bg-emerald-400 animate-grow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="bg-transparent py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/tfFnNi1iro4?autoplay=0"
                title="Video de Grayola"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full scale-[1.01]"
              ></iframe>
            </div>
          </div>
        </section>

        <motion.section
          className="bg-transparent py-24"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-12 gap-12 items-center mb-16">
              <div className="md:col-span-4 relative flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-emerald-100 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <Image
                    src="/images/grayola-bird-logo.svg"
                    alt="Grayola Bird"
                    width={300}
                    height={300}
                    className="w-auto h-auto relative z-10"
                    unoptimized
                  />
                </div>
              </div>
              <div className="md:col-span-8 flex flex-col space-y-6">
                <h2 className="text-[48px] font-black text-black leading-tight tracking-tight">
                  Todos los servicios creativos que necesitas en un solo lugar.
                </h2>
                <p className="text-xl text-black/60 font-medium">
                  Explora más de 100 servicios de diseño disponibles con nuestra suscripción
                </p>
                <div className="flex flex-col sm:flex-row gap-6 mt-4">
                  <button className="agendar-prueba-button px-8 py-5 text-sm">
                    Agendar prueba
                  </button>
                  <button className="bg-white hover:bg-black/5 text-black px-8 py-5 text-sm font-bold border-2 border-black rounded-full transition-all">
                    Ver todos los servicios
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Diseño de marca", desc: "Manuales de marca, logotipos, key visuals y activos de marca.", icon: Palette, color: "emerald" },
                { title: "Social Media", desc: "Anuncios para redes sociales y ads para Meta o Google.", icon: Share2, color: "pink" },
                { title: "Edición de video", desc: "Tutoriales, demos de productos, podcast o videos informativos.", icon: Zap, color: "emerald" },
                { title: "Presentaciones", desc: "Infografías, decks, ebooks y presentaciones comerciales.", icon: Laptop, color: "pink" },
                { title: "Animación 2D/3D", desc: "Motion graphics, demos de producto y animación 2D/3D.", icon: Sparkles, color: "emerald" },
                { title: "Ilustración", desc: "Assets digitales, iconos, personajes y material ilustrado.", icon: Palette, color: "pink" },
              ].map((service, idx) => (
                <div key={idx} className="bg-white/40 backdrop-blur-sm p-8 rounded-[2rem] border-2 border-black hover:border-emerald-400 transition-all duration-300 hover:shadow-xl group relative overflow-hidden">
                  <div className={`w-14 h-14 bg-${service.color}-50 rounded-2xl flex items-center justify-center border-2 border-black mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon className="h-7 w-7 text-black" />
                  </div>
                  <h3 className="text-2xl font-black text-black mb-4">
                    {service.title}
                  </h3>
                  <p className="text-lg text-black/70 font-medium">
                    {service.desc}
                  </p>
                  <div className={`absolute -right-8 -bottom-8 w-24 h-24 bg-${service.color}-400/5 rounded-full`}></div>
                </div>
              ))}

              <div className="bg-emerald-50/50 backdrop-blur-md p-10 rounded-[2.5rem] border-2 border-black col-span-1 md:col-span-3 flex flex-col md:flex-row items-center justify-between shadow-lg">
                <div className="flex items-center gap-8 mb-6 md:mb-0">
                  <div className="text-7xl font-black text-black tracking-tighter">+100</div>
                  <div className="text-xl font-bold text-black/60 max-w-[200px]">Servicios de diseño adicionales</div>
                </div>
                <button className="agendar-prueba-button px-10 py-5 text-sm">
                  Ver todos los servicios
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="bg-transparent py-24 px-8"
          id="planes"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: false }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="relative mb-24">
              <div className="text-center">
                <h2 className="text-[56px] font-black text-black mb-6 tracking-tighter leading-tight">
                  Diseños rápidos y de calidad<br />por una fracción del costo
                </h2>
                <p className="text-xl text-black/60 font-medium max-w-2xl mx-auto">
                  Selecciona el plan de acuerdo al tamaño de tu empresa y necesidades de tu equipo.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-24">
              {[
                { name: "Basic", price: "390", features: ["80 créditos por mes", "2 pedidos activos", "1 Marca incluida", "Archivos editables"], popular: false, color: "emerald" },
                { name: "Premium", price: "690", features: ["140 créditos por mes", "5 pedidos activos", "2 Marcas incluidas", "Archivos editables"], popular: false, color: "pink" },
                { name: "Advance", price: "990", features: ["200 créditos por mes", "10 pedidos activos", "3 Marcas incluidas", "Archivos editables"], popular: true, color: "emerald" },
                { name: "Enterprise", price: "1490", features: ["300 créditos por mes", "20 pedidos activos", "5 Marcas incluidas", "Archivos editables"], popular: false, color: "pink" },
              ].map((plan, idx) => (
                <div key={idx} className={`bg-white/60 backdrop-blur-sm p-10 rounded-[2.5rem] border-2 ${plan.popular ? 'border-emerald-400 scale-105 shadow-2xl relative z-20' : 'border-black shadow-lg'} hover:translate-y-[-10px] transition-all duration-300`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      Más popular
                    </div>
                  )}

                  <h3 className="text-2xl font-black text-black mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-black tracking-tighter">${plan.price}</span>
                    <div className="text-black/50 leading-none">
                      <p className="text-xs font-bold">USD</p>
                      <p className="text-xs font-medium">/mes</p>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <div className={`mt-1 text-${plan.color === 'emerald' ? 'emerald' : 'pink'}-500`}>
                          <Check className="h-4 w-4 stroke-[3px]" />
                        </div>
                        <span className="text-sm font-bold text-black/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`agendar-prueba-button w-full py-4 text-xs font-black ${plan.color === 'pink' ? 'before:bg-pink-100 after:border-pink-300' : ''}`}>
                    Empezar ahora
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="bg-transparent py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-3xl border-2 border-black p-16 text-center">
              <h2 className="text-[48px] font-black text-black mb-4">
                Comienza hoy mismo
              </h2>
              <p className="text-xl text-black mb-8">
                Conoce al instante a tu próximo equipo creativo y diseñemos hoy mismo tu primer pedido en Grayola.
              </p>
              <div className="flex flex-col items-center gap-2">
                <button className="bg-[#7fff00] hover:bg-[#90ff20] text-black px-6 py-3 text-base font-bold rounded-full border-2 border-b-4 border-black">
                  Agendar prueba
                </button>
                <div className="flex flex-col items-center">
                  <p className="text-black">
                    Agenda y obtén 37 días
                  </p>
                  <p className="text-black font-medium">
                    en tu primer mes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-transparent py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-[48px] font-black text-black mb-16 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#e8ffdb] px-3 py-1 rounded-full border border-black">+4000 proyectos</span>
                  <span>terminados para 142 empresas</span>
                </div>
                <span>alrededor del mundo</span>
              </div>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">

              <div className="bg-white p-8 rounded-2xl border-2 border-black">
                <p className="text-xl text-black mb-8">
                  Lo que más me gusta de trabajar con Grayola es que se puede diseñar cualquier cosa, iterar rápido y lanzar en tiempo récord.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#e8ffdb] rounded-full flex items-center justify-center border border-black">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C9.79086 2 8 3.79086 8 6C8 8.20914 9.79086 10 12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2Z" fill="black" />
                      <path d="M12 12C7.58172 12 4 15.5817 4 20V22H20V20C20 15.5817 16.4183 12 12 12Z" fill="black" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-black">Andrés Bilbao</p>
                    <p className="text-black">Rappi</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border-2 border-black">
                <p className="text-xl text-black mb-4">
                  No queríamos comprometernos con aumentar nuestra nómina de diseñadores inhouse, teniendo en cuenta que el flujo de clientes podía subir y bajar.
                </p>
                <p className="text-xl text-black mb-8">
                  Con Grayola encontramos esa flexibilidad de tener un equipo de diseñadores senior por el precio de uno y con flexibilidad.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#e8ffdb] rounded-full flex items-center justify-center border border-black">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C9.79086 2 8 3.79086 8 6C8 8.20914 9.79086 10 12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2Z" fill="black" />
                      <path d="M12 12C7.58172 12 4 15.5817 4 20V22H20V20C20 15.5817 16.4183 12 12 12Z" fill="black" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-black">Mariana Mejía</p>
                    <p className="text-black">CEO de Viceversable</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black py-20 px-4" id="preguntas">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">Preguntas frecuentes</h2>
            <p className="text-lg text-white">Todo lo que necesitas saber sobre Grayola</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex justify-center">
              <button className="bg-[#7fff00] hover:bg-[#90ff20] text-black px-6 py-3 text-base font-bold rounded-full border-2 border-b-4 border-black">
                Comencemos
              </button>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-4">General</h3>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="border border-white/20 rounded-xl px-6 py-2">
                  <AccordionTrigger className="font-medium text-left text-white hover:no-underline">
                    ¿Qué diseños están incluidos?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Básicamente todo lo que le pedirías a tu propio equipo de diseño, desde una impresión o un gráfico digital. Ilustraciones, edición de foto, diseño de marcas, presentaciones, edición de reels e incluso merchandising…. ¡Casi cualquier cosa que te puedas imaginar!
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-white/20 rounded-xl px-6 py-2">
                  <AccordionTrigger className="font-medium text-left text-white hover:no-underline">
                    ¿Para cuantos pedidos alcanza mi suscripción?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Dependiendo el plan que elijas, tendrás cierta cantidad de créditos disponibles en el mes, podrás revisar los costos en créditos de cada uno de nuestros servicios en este link. ¡Cada mes se recargarán tus créditos de manera automática al renovar nuestra suscripción!
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border border-white/20 rounded-xl px-6 py-2">
                  <AccordionTrigger className="font-medium text-left text-white hover:no-underline">
                    ¿Avances en 24 a 72 horas? wow!
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    No, no es magia. Gracias a nuestra metodología y a nuestro increible equipo de diseño, trabajaremos arduamente en tu pedidos logrando los mejores tiempos.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold text-white mb-4">Nuestro equipo</h3>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-4" className="border border-white/20 rounded-xl px-6 py-2">
                  <AccordionTrigger className="font-medium text-left text-white hover:no-underline">
                    ¿Quienes serán mis diseñadores?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Nuestros diseñadores cuentan con una amplia variedad de habilidades listas para aplicarlas a tus proyectos. Ya sea que necesites un diseño de Presentaciones o ilustraciones personalizadas para camisetas, nuestro equipo de diseñadores podrán crear todo lo que necesites.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border border-white/20 rounded-xl px-6 py-2">
                  <AccordionTrigger className="font-medium text-left text-white hover:no-underline">
                    ¿Cómo son elegidos los diseñadores?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Para garantizar la calidad y la velocidad, cada uno de nuestros diseñadores deben realizar una rigurosa prueba de diseño antes de unirse a nuestro equipo. Solo el Top 2% de nuestros aplicantes son contratados.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">Nuestro trabajo</h3>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-6" className="border border-white/20 rounded-xl px-6 py-2">
                  <AccordionTrigger className="font-medium text-left text-white hover:no-underline">
                    ¿Cuanto tiempo demora una revisión?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Nos tomaremos un máximo de 72 horas más para enviarte una nueva versión mucho mas ajustada a tus expectativas.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="border border-white/20 rounded-xl px-6 py-2">
                  <AccordionTrigger className="font-medium text-left text-white hover:no-underline">
                    ¿No te gusta el estilo de un diseñador?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    ¡Sin problemas! Háznoslo saber y te los cambiamos por otro diseñador más compatible con tu marca.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="border border-white/20 rounded-xl px-6 py-2">
                  <AccordionTrigger className="font-medium text-left text-white hover:no-underline">
                    ¿Dónde quedan mis archivos?
                  </AccordionTrigger>
                  <AccordionContent className="text-white/80">
                    Todos tus archivos se almacenarán en nuestra plataforma y podrás acceder a ellos sin limitaciones desde el Dashboard, incluyendo los editables.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <footer className="bg-black text-white py-16 px-4">
          <div className="container max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
              <div>
                <h3 className="text-2xl font-bold mb-4">
                  Suscríbete a<br />nuestro newsletter
                </h3>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Tu correo electrónico"
                    className="py-1.5 px-3 text-sm rounded-l-full bg-gray-800 text-white border-0 focus:outline-none"
                  />
                  <button className="bg-lime-400 hover:bg-lime-500 text-black text-sm font-medium rounded-r-full px-3 py-1.5">
                    Enviar
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Grayola</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white">Grayola for Startups</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Portafolio</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Carreras</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Servicios</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Precios</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Blog</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Free Trial</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Recursos</h3>
                <ul className="space-y-2">
                  <li><Link href="#" className="text-gray-400 hover:text-white">Grayola para agencias</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Grayola para ecommerce</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Por qué elegir Grayola</Link></li>
                  <li><Link href="#" className="text-gray-400 hover:text-white">Plantilla de parrilla de contenidos para redes</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Servicios</h3>
                <div className="grid grid-cols-2 gap-2">
                  <ul className="space-y-2">
                    <li><Link href="#" className="text-gray-400 hover:text-white">Diseño de marca</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white">Social media</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white">Presentaciones</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white">Ilustración</Link></li>
                  </ul>

                  <ul className="space-y-2">
                    <li><Link href="#" className="text-gray-400 hover:text-white">Edición de video</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white">Animación 2D/3D</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white">Diseño web</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white">Diseño de producto</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-8 max-w-4xl">
              <strong className="text-white block mb-4">Grayola es una forma revolucionaria para que las empresas obtengan buen diseño a gran escala.</strong>
              Confiado por más de 100 empresas ambiciosas, Grayola hace que el diseño sea sin complicaciones para equipos de marketing y creativos. Al combinar el 1% superior del talento creativo de todo el mundo con tecnología específicamente diseñada y la rigurosidad de las operaciones de diseño, Grayola ayuda a marcas ambiciosas a crecer más rápido. Desde su inicio, Grayola ha sido una empresa completamente remota, con más de 15 miembros del equipo trabajando en 2 países y 2 zonas horarias. Grayola es una forma revolucionaria para que las empresas obtengan buen diseño a gran escala.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div>
                <p className="text-white font-bold mb-2">Contáctanos</p>
                <a href="mailto:team@grayola.io" className="text-white font-bold">team@grayola.io</a>
              </div>

              <div>
                <p className="text-white font-bold mb-2">Llámanos</p>
                <a href="tel:+573107370651" className="text-white font-bold">+57 310-7370651</a>
              </div>

              <div>
                <p className="text-white font-bold mb-2">Todos nuestros servicios</p>
                <div className="flex gap-4">
                  <Link href="#" className="text-white hover:text-lime-400">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="text-white hover:text-lime-400">
                    <Instagram className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © Grayola LLC {new Date().getFullYear()}. Todos los derechos reservados
              </p>

              <div className="flex gap-6">
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Términos y condiciones
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Política de privacidad
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
} 