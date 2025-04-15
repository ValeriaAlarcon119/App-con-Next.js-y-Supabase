'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Check, ChevronRight, ChevronUp, ExternalLink, Github, Instagram, Laptop, Linkedin, Mail, Palette, Phone, Share2 } from "lucide-react"
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
    <div className="relative w-full overflow-x-hidden font-sans bg-gradient-to-r from-[#c9efb3] via-[#7ee8ff] to-[#94e0ff]">
      <div className="w-full">

        <div className="w-full min-h-screen bg-transparent">
          <div className="flex flex-col min-h-screen w-full max-w-6xl mx-auto px-4">
            <div className="absolute left-1/2 transform -translate-x-1/2 top-[12vh] z-10">
              <Image 
                src="/images/grayola-bird-logo.svg"
                alt="Grayola Bird"
                width={2000}
                height={2000}
                className="w-auto h-auto"
                priority
              />
            </div>
            <div className="flex-grow flex items-center justify-center">
              <div className="relative z-20 text-center mt-[20vh] max-w-6xl mx-auto">
                <h1 className="mb-8 text-4xl sm:text-5xl md:text-[65px] lg:text-[72px] tracking-normal font-extrabold text-black mx-auto leading-[1.2] max-w-[1500px]">
                  Suscripción de diseño para<br/>
                  equipos que necesitan <br/>
                  velocidad y calidad
          </h1>
                <p className="text-base md:text-lg text-black mb-8 max-w-2xl mx-auto leading-snug">
                  Escala y delega todas la operaciones de diseño de forma rápida y sencilla, sin la preocupación de contratar o administrar recursos adicionales.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
                  <span className="text-black font-medium text-sm">
                    Diseño gráfico | Edición de video
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <a href="#" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto bg-[#7fff00] hover:bg-[#90ff20] text-black px-4 py-3.5 text-xs border-2 border-b-4 border-black rounded-lg" style={{ letterSpacing: '0.5px' }}>
                      Agendar prueba
                    </button>
                  </a>
                  <div className="flex flex-col items-start text-left">
                    <p className="text-black font-medium text-xs">
                      Agenda una reunión
                    </p>
                    <p className="text-black font-bold text-xs">
                      37 días en tu primer mes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
          
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

        <section className="bg-transparent py-12">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xl text-black leading-relaxed relative">
                <span className="absolute -left-6 top-0 text-6xl font-black text-[#7fff00] opacity-30" style={{ transform: 'translateY(-30%) rotate(-15deg)' }}>"</span>
                Grayola se adapta y respalda a empresas y agencias de todos los tamaños, escalando sus operaciones de diseño a gran escala.
                <span className="absolute -right-6 bottom-0 text-6xl font-black text-[#7fff00] opacity-30" style={{ transform: 'translateY(30%) rotate(-15deg)' }}>"</span>
              </p>
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-[#e0d4ff]/70 backdrop-blur-sm p-4 rounded-xl border-2 border-black flex items-center justify-center transform transition-all hover:scale-105 duration-300 animate-scale-1">
                  <span className="text-3xl font-black text-[#6b4dc9]">142+</span>
                </div>
                <div className="bg-[#e0d4ff]/70 backdrop-blur-sm p-4 rounded-xl border-2 border-black flex items-center justify-center transform transition-all hover:scale-105 duration-300 animate-scale-2">
                  <span className="text-3xl font-black text-[#6b4dc9]">4000+</span>
                </div>
                <div className="bg-[#e0d4ff]/70 backdrop-blur-sm p-4 rounded-xl border-2 border-black flex items-center justify-center transform transition-all hover:scale-105 duration-300 animate-scale-3">
                  <span className="text-3xl font-black text-[#6b4dc9]">24/7</span>
                </div>
                <div className="col-span-3 bg-[#e0d4ff]/70 backdrop-blur-sm p-4 rounded-xl border-2 border-black text-center transform transition-all hover:scale-105 duration-300">
                  <span className="text-xl font-black text-[#6b4dc9]">Diseños de alta calidad a gran escala</span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#e8ffdb] to-[#7ee8ff] opacity-20 rounded-xl blur-xl animate-pulse-slow"></div>
              <h2 className="text-[42px] font-black leading-tight text-black relative z-10 bg-white/70 backdrop-blur-sm p-8 rounded-xl border-2 border-black">
                Un <span className="inline-flex items-center gap-2 bg-[#e8ffdb] px-3 py-1 rounded-full border border-black transform transition-all hover:scale-105 duration-300 hover:shadow-lg">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-black flex items-center justify-center animate-spin-slow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                      <path d="M12 2C9.79086 2 8 3.79086 8 6C8 8.20914 9.79086 10 12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2Z" fill="white"/>
                      <path d="M12 12C7.58172 12 4 15.5817 4 20V22H20V20C20 15.5817 16.4183 12 12 12Z" fill="white"/>
                    </svg>
                  </div>
                  <span className="text-[42px]">equipo creativo</span>
                </span> listo para diseñar a cualquier escala
              </h2>

              <div className="absolute -bottom-10 -right-10 w-40 h-40">
                <div className="relative w-full h-full">
                  <div className="absolute top-0 left-0 w-8 h-8 bg-[#7fff00] rounded-full animate-float-slow"></div>
                  <div className="absolute top-10 left-20 w-6 h-6 bg-[#7ee8ff] rounded-full animate-float-slow delay-300"></div>
                  <div className="absolute top-20 left-5 w-10 h-10 bg-[#e8ffdb] rounded-full animate-float-slow delay-700"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-transparent py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-4xl font-black text-center mb-16 relative">
              <span className="relative inline-block px-6 py-2 bg-gradient-to-r from-[#c9efb3] via-[#7ee8ff] to-[#94e0ff] rounded-xl border-2 border-black">
                ¿Cómo funciona?
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center relative group">
                <div className="mb-6 relative flex justify-center w-full">
                  <div className="w-16 h-16 bg-[#e8ffdb] rounded-xl flex items-center justify-center border-2 border-black relative overflow-hidden group-hover:border-[#7fff00] transition-colors duration-300">
                    <div className="absolute -inset-1 border-2 border-[#7fff00] opacity-30 animate-pulse rounded-xl"></div>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7Z" stroke="black" strokeWidth="2"/>
                      <path d="M7 14L10 11M10 11L13 14M10 11V19M17 11H14" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="absolute top-0 right-1/3 -mr-2 -mt-2 w-6 h-6 bg-[#7fff00] rounded-full flex items-center justify-center border-2 border-black">
                    <span className="text-xs font-bold">1</span>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border-2 border-black group-hover:border-[#7fff00] transition-colors duration-300 w-full h-full">
                  <h3 className="text-2xl font-black text-black mb-4 text-center">
                    Crea<br/>un pedido
                  </h3>
                  <p className="text-lg text-black">
                    Completa un breve formulario con todos los detalles que tengas en mente para tu diseño. ¡No te tomará más de 2 minutos!
                  </p>
                  <div className="w-full h-1 bg-black/10 rounded-full mt-6 overflow-hidden">
                    <div className="h-full w-0 bg-[#7fff00] group-hover:w-full transition-all duration-1000"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center relative group">
                <div className="mb-6 relative flex justify-center w-full">
                  <div className="w-16 h-16 bg-[#e8ffdb] rounded-xl flex items-center justify-center border-2 border-black relative overflow-hidden group-hover:border-[#7fff00] transition-colors duration-300">
                    <div className="absolute -inset-1 border-2 border-[#7fff00] opacity-30 animate-pulse rounded-xl"></div>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="4" stroke="black" strokeWidth="2"/>
                      <path d="M5 19C5 16.2386 8.13401 14 12 14C15.866 14 19 16.2386 19 19" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="17" cy="6" r="2" fill="#e8ffdb" stroke="black" strokeWidth="2"/>
                      <circle cx="7" cy="6" r="2" fill="#e8ffdb" stroke="black" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div className="absolute top-0 right-1/3 -mr-2 -mt-2 w-6 h-6 bg-[#7fff00] rounded-full flex items-center justify-center border-2 border-black">
                    <span className="text-xs font-bold">2</span>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border-2 border-black group-hover:border-[#7fff00] transition-colors duration-300 w-full h-full">
                  <h3 className="text-2xl font-black text-black mb-4 text-center">
                    Lo asignamos<br/>a nuestro equipo
                  </h3>
                  <p className="text-lg text-black">
                    Nuestro equipo seleccionará al mejor grupo de especialistas para tu proyecto, con un director creativo y diseñadores dedicados.
                  </p>
                  <div className="w-full h-1 bg-black/10 rounded-full mt-6 overflow-hidden">
                    <div className="h-full w-0 bg-[#7fff00] group-hover:w-full transition-all duration-1000"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center relative group">
                <div className="mb-6 relative flex justify-center w-full">
                  <div className="w-16 h-16 bg-[#e8ffdb] rounded-xl flex items-center justify-center border-2 border-black relative overflow-hidden group-hover:border-[#7fff00] transition-colors duration-300">
                    <div className="absolute -inset-1 border-2 border-[#7fff00] opacity-30 animate-pulse rounded-xl"></div>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 16L10 13L15 16L19 13" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M5 12L10 9L15 12L19 9" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M5 8L10 5L15 8L19 5" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="absolute top-0 right-1/3 -mr-2 -mt-2 w-6 h-6 bg-[#7fff00] rounded-full flex items-center justify-center border-2 border-black">
                    <span className="text-xs font-bold">3</span>
                  </div>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border-2 border-black group-hover:border-[#7fff00] transition-colors duration-300 w-full h-full">
                  <h3 className="text-2xl font-black text-black mb-4 text-center">
                    Entregamos<br/>tus diseños
                  </h3>
                  <p className="text-lg text-black">
                    Recibe las primeras iteraciones de tus pedidos en tiempo récord y con tu feedback haremos ajustes lo más rápido posible.
                  </p>
                  <div className="w-full h-1 bg-black/10 rounded-full mt-6 overflow-hidden">
                    <div className="h-full w-0 bg-[#7fff00] group-hover:w-full transition-all duration-1000"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="bg-transparent py-12">
          <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
            <div className="relative overflow-hidden rounded-2xl border-2 border-black p-8 bg-white/70 backdrop-blur-sm transform transition-all hover:scale-105 duration-500 shadow-xl">
              <div className="absolute -right-16 -top-16 w-32 h-32 bg-[#7fff00] rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute -left-16 -bottom-16 w-32 h-32 bg-[#7ee8ff] rounded-full opacity-30 animate-pulse delay-700"></div>
              <h2 className="text-[64px] font-black leading-tight text-black relative z-10">
                Te encantará<br/>
                <span className="relative inline-block">
                  nuestra aplicación
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-[#7fff00]" style={{ transform: 'translateY(8px) rotate(-1deg)'}}></span>
                </span>
              </h2>
            </div>
            <div className="space-y-8 relative">
              <p className="text-xl text-black leading-relaxed bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-black">
                Nuestra plataforma de gestión creativa te brinda la posibilidad de enviar proyectos, dar feedback, y recibir todos tus proyectos, incluyendo sus editables, todo en un mismo lugar.
              </p>
              <div className="relative group flex justify-center">
                <div className="absolute inset-0 bg-[#7fff00] blur-xl opacity-30 group-hover:opacity-70 transition-all duration-700 rounded-2xl"></div>
                <div className="bg-[#e8ffdb] rounded-2xl p-8 text-center inline-block border-2 border-black relative transform transition-all group-hover:translate-y-[-5px] duration-300">
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#7ee8ff] rounded-full flex items-center justify-center border-2 border-black shadow-md">
                    <span className="text-xs font-bold text-black">wow!</span>
                  </div>
                  <p className="text-4xl font-black text-black mb-1 relative">
                    <span className="inline-block animate-bounce-slow">+</span>3900
                  </p>
                  <p className="text-lg text-black">pedidos<br/>completados</p>
                  <div className="w-full h-1 bg-black/10 rounded-full mt-3 overflow-hidden">
                    <div className="h-full w-3/4 bg-[#7fff00] animate-grow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-transparent py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/tfFnNi1iro4?autoplay=0"
                title="Video de Grayola"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </section>


        <section className="bg-transparent py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 relative">
                <div className="relative">
                  <Image 
                    src="/images/grayola-bird-logo.svg"
                    alt="Grayola Bird"
                    width={300}
                    height={300}
                    className="w-auto h-auto"
                  />
                </div>
              </div>
              <div className="md:col-span-8 flex flex-col space-y-6">
                <h2 className="text-[48px] font-black text-black leading-tight">
                  Todos los servicios creativos que necesitas en un solo lugar.
                </h2>
                <p className="text-xl text-black">
                  Explora más de 100 servicios de diseño disponibles con nuestra suscripción
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <button className="w-full sm:w-auto bg-[#7fff00] hover:bg-[#90ff20] text-black px-6 py-3.5 text-lg font-bold border-2 border-b-4 border-black rounded-full">
                    Agendar prueba
                  </button>
                  <button className="w-full sm:w-auto bg-transparent hover:bg-black/5 text-black px-6 py-3.5 text-lg font-bold border-2 border-black rounded-full">
                    Ver todos los servicios
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border-2 border-black hover:border-[#7fff00] transition-all duration-300 hover:shadow-lg relative overflow-hidden">
                <div className="mb-6">
                  <div className="w-14 h-14 bg-[#e8ffdb] rounded-xl flex items-center justify-center border-2 border-black">
                    <Palette className="h-7 w-7 text-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-black mb-4">
                  Diseño de marca
                </h3>
                <p className="text-lg text-black">
                  Manuales de marca, logotipos, key visuals y activos de marca.
                </p>
                <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#7fff00]/10 rounded-full"></div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-black hover:border-[#7fff00] transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                <div className="mb-6">
                  <div className="w-14 h-14 bg-[#c9efb3] rounded-full flex items-center justify-center border-2 border-black">
                    <Share2 className="h-7 w-7 text-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-black mb-4">
                  Social Media
                </h3>
                <p className="text-lg text-black">
                  Anuncios para redes sociales y ads para Meta o Google.
                </p>
              </div>
              
              <div className="bg-white/75 backdrop-blur-sm p-8 rounded-2xl border-2 border-black hover:border-[#7fff00] transition-all duration-300 hover:shadow-lg relative">
                <div className="absolute top-3 right-3 w-20 h-20 bg-[#7ee8ff]/20 rounded-full"></div>
                <div className="mb-6 relative z-10">
                  <div className="w-14 h-14 bg-[#7ee8ff] rounded-xl flex items-center justify-center border-2 border-black">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 8V16L12 20L20 16V8L12 4L4 8Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 4V20" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 8L20 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 8L4 16" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-black mb-4 relative z-10">
                  Edición de video
                </h3>
                <p className="text-lg text-black relative z-10">
                  Tutoriales, demos de productos, podcast o videos informativos.
                </p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border-2 border-black hover:border-[#7fff00] transition-all duration-300 hover:shadow-lg hover:rotate-1">
                <div className="mb-6">
                  <div className="w-14 h-14 bg-[#e8ffdb] rounded-lg flex items-center justify-center border-2 border-black transform rotate-3">
                    <Laptop className="h-7 w-7 text-black" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-black mb-4">
                  Presentaciones
                </h3>
                <p className="text-lg text-black">
                  Infografías, decks, ebooks y presentaciones comerciales.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-sm p-8 rounded-2xl border-2 border-black hover:border-[#7fff00] transition-all duration-300 hover:shadow-lg">
                <div className="mb-6 flex justify-between items-center">
                  <div className="w-14 h-14 bg-[#94e0ff] rounded-full flex items-center justify-center border-2 border-black">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3L4 6V12C4 15.3137 7.13401 18 12 18C16.866 18 20 15.3137 20 12V6L12 3Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 18V21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 12V16.5C4 17.8807 7.58172 19 12 19C16.4183 19 20 17.8807 20 16.5V12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="w-8 h-8 bg-[#7fff00]/30 rounded-full"></div>
                </div>
                <h3 className="text-2xl font-black text-black mb-4">
                  Animación 2D/3D
                </h3>
                <p className="text-lg text-black">
                  Motion graphics, demos de producto y animación 2D/3D.
                </p>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border-2 border-black hover:border-[#7fff00] transition-all duration-300 hover:shadow-lg relative">
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#7fff00]/20 rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#7ee8ff]/15 rounded-full"></div>
                <div className="mb-6">
                  <div className="w-14 h-14 bg-[#c9efb3] rounded-xl flex items-center justify-center border-2 border-black">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 3L19 12L5 21V3Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-black mb-4">
                  Ilustración
                </h3>
                <p className="text-lg text-black">
                  Assets digitales, iconos, personajes y material ilustrado.
                </p>
              </div>
              
              <div className="bg-[#f0ffe0] p-8 rounded-2xl border-2 border-black col-span-1 md:col-span-3 flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="text-6xl font-black text-black">+100</div>
                  <div className="text-xl font-bold text-black">Servicios de diseño adicionales</div>
                </div>
                <button className="bg-[#7fff00] hover:bg-[#90ff20] text-black px-6 py-3 text-lg font-bold rounded-full border-2 border-b-4 border-black">
                  Ver todos los servicios
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Planes */}
        <section className="bg-transparent py-20 px-8" id="planes">
          <div className="max-w-7xl mx-auto">
            <div className="relative mb-16">
              <div className="absolute left-1/2 transform -translate-x-1/2 -top-24">
                <Image 
                  src="/images/grayola-bird-logo.svg"
                  alt="Grayola Bird"
                  width={120}
                  height={120}
                  className="w-auto h-auto"
                />
              </div>
              <div className="text-center">
                <h2 className="text-[48px] font-black text-black mb-4">
                  Diseños rápidos y de calidad<br/>por una fracción del costo
                </h2>
                <p className="text-xl text-black">
                  Selecciona el plan de acuerdo al tamaño de tu empresa y necesidades de tu equipo.
                </p>
              </div>
            </div>
          
          <div className="grid md:grid-cols-4 gap-4 mb-16">
            <div className="bg-white p-8 rounded-2xl border border-black">
              <h3 className="text-2xl font-black text-black mb-1">Basic</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-black text-black">$390</span>
                <div className="ml-2">
                  <p className="text-sm font-bold text-black">USD</p>
                  <p className="text-sm text-black">/mes</p>
                </div>
              </div>
              
              <p className="mt-4 mb-6 text-sm text-black">
                Para pequeños equipos. Ideal para emprendimientos.
              </p>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">80 créditos por mes</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">2 pedidos activos a la vez</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">1 Marca incluida</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">Archivos editables</span>
                </li>
              </ul>
              
              <button className="w-full bg-[#7fff00] hover:bg-[#90ff20] text-black px-6 py-3 text-lg font-bold rounded-full border-2 border-b-4 border-black">
                Empezar ahora
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-black">
              <h3 className="text-2xl font-black text-black mb-1">Premium</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-black text-black">$690</span>
                <div className="ml-2">
                  <p className="text-sm font-bold text-black">USD</p>
                  <p className="text-sm text-black">/mes</p>
                </div>
              </div>
              
              <p className="mt-4 mb-6 text-sm text-black">
                Para empresa con equipos de marketing y comunicaciones.
              </p>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">140 créditos por mes</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">5 pedidos activos a la vez</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">2 Marcas incluidas</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">Archivos editables</span>
                </li>
              </ul>
              
              <button className="w-full bg-[#7fff00] hover:bg-[#90ff20] text-black px-6 py-3 text-lg font-bold rounded-full border-2 border-b-4 border-black">
                Empezar ahora
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border-2 border-lime-400 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-full">
                Más popular
              </div>
              
              <h3 className="text-2xl font-black text-black mb-1">Advance</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-black text-black">$990</span>
                <div className="ml-2">
                  <p className="text-sm font-bold text-black">USD</p>
                  <p className="text-sm text-black">/mes</p>
                </div>
              </div>
              
              <p className="mt-4 mb-6 text-sm text-black">
                Para agencias o empresas con varias marcas o proyectos.
              </p>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">200 créditos por mes</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">10 pedidos activos a la vez</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">3 Marcas incluidas</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">Archivos editables</span>
                </li>
              </ul>
              
              <button className="w-full bg-[#7fff00] hover:bg-[#90ff20] text-black px-6 py-3 text-lg font-bold rounded-full border-2 border-b-4 border-black">
                Empezar ahora
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-black">
              <h3 className="text-2xl font-black text-black mb-1">Enterprise</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-black text-black">$1490</span>
                <div className="ml-2">
                  <p className="text-sm font-bold text-black">USD</p>
                  <p className="text-sm text-black">/mes</p>
                </div>
              </div>
              
              <p className="mt-4 mb-6 text-sm text-black">
                Para grandes empresas con múltiples marcas y altos volúmenes.
              </p>
              
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">300 créditos por mes</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">20 pedidos activos a la vez</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">5 Marcas incluidas</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="mt-1 text-green-500">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-black">Archivos editables</span>
                </li>
              </ul>
              
              <button className="w-full bg-[#7fff00] hover:bg-[#90ff20] text-black px-6 py-3 text-lg font-bold rounded-full border-2 border-b-4 border-black">
                Empezar ahora
              </button>
            </div>
          </div>
          </div>
        </section>

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
                      <path d="M12 2C9.79086 2 8 3.79086 8 6C8 8.20914 9.79086 10 12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2Z" fill="black"/>
                      <path d="M12 12C7.58172 12 4 15.5817 4 20V22H20V20C20 15.5817 16.4183 12 12 12Z" fill="black"/>
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
                      <path d="M12 2C9.79086 2 8 3.79086 8 6C8 8.20914 9.79086 10 12 10C14.2091 10 16 8.20914 16 6C16 3.79086 14.2091 2 12 2Z" fill="black"/>
                      <path d="M12 12C7.58172 12 4 15.5817 4 20V22H20V20C20 15.5817 16.4183 12 12 12Z" fill="black"/>
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
                  Suscríbete a<br/>nuestro newsletter
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