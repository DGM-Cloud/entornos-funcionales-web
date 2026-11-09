import { AfterViewInit, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BeforeAfterSlider } from '../../shared/components/before-after-slider/before-after-slider';
import { cloudinarySized, cloudinarySrcset } from '../../shared/utils/cloudinary';

/** Debe coincidir con el preload de `src/index.html` para evitar doble descarga. */
const HERO_IMAGE =
  'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793318606/Entrada_moderna_con_p%C3%A9rgola_y_flores.png';
const HERO_WIDTHS = [768, 1280, 1920] as const;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BeforeAfterSlider],
  template: `
    <!-- ==========================================
1. HERO SECTION

         ========================================== -->
    <section class="relative w-full h-screen flex flex-col justify-center bg-[#101827] overflow-hidden pt-[72px]">
      <!-- FOTOGRAFÍA PRINCIPAL (LCP: sin lazy, fetchpriority high, srcset responsive) -->
      <div class="absolute inset-0 z-0">
        <img [src]="heroSrc"
             [attr.srcset]="heroSrcset"
             sizes="100vw"
             width="1920"
             height="1080"
             fetchpriority="high"
             decoding="async"
             alt="Acabados Arquitectónicos de Alta Gama"
             class="w-full h-full object-cover opacity-70 -scale-x-100" />

        <div class="absolute inset-0 bg-gradient-to-r from-[#101827] via-[#101827]/85 to-transparent"></div>
        <div class="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#101827] to-transparent"></div>
      </div>

      <div class="absolute inset-0 z-0 pointer-events-none mix-blend-overlay"
           style="background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 6rem 6rem;">
      </div>

      <!-- Contenedor del texto: Animado nativamente al cargar la página -->
      <div class="relative z-10 max-w-7xl mx-auto px-5 md:px-6 w-full flex flex-col items-start -mt-10 animate-hero-fade-in opacity-0">
        <div class="w-full max-w-4xl flex flex-col items-start">

          <div class="inline-flex items-center gap-3 mb-6 md:mb-8 px-4 py-2 border border-slate-700/50 bg-[#101827]/80 rounded-sm">
            <div class="w-1.5 h-1.5 rounded-full bg-[#5C968D]"></div>
            <span class="font-inter text-[#B8C3D2] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
              Reconstrucción & Acabados de Alta Gama
            </span>
          </div>

          <h1 class="font-inter text-[38px] sm:text-[44px] md:text-[84px] leading-[1.1] md:leading-[1.05] tracking-tighter mb-6 md:mb-8 w-full">
            <span class="block font-medium text-[#F5F6F8]">
              Espacios que funcionan.
            </span>
            <span class="block font-light text-[#B8C3D2] mt-1 md:mt-2">
              Soluciones que perduran.
            </span>
          </h1>

          <p class="text-base md:text-xl font-inter text-[#B8C3D2] mb-10 md:mb-12 max-w-xl leading-relaxed font-light">
            Implementación, remodelación y mantenimiento integral para entornos residenciales, comerciales e industriales con estándares de arquitectura contemporánea.
          </p>

          <div class="flex flex-wrap sm:flex-nowrap gap-4">
            <a routerLink="/proyectos" class="bg-[#F5F6F8] text-[#101827] px-8 py-3.5 md:py-4 rounded-sm text-[13px] font-jakarta font-bold uppercase tracking-[0.1em] hover:bg-white transition-colors text-center whitespace-nowrap">
              Explorar Portafolio
            </a>
            <a routerLink="/contacto" class="bg-transparent border border-[#5C968D]/50 text-[#F5F6F8] px-8 py-3.5 md:py-4 rounded-sm text-[13px] font-jakarta font-bold uppercase tracking-[0.1em] hover:bg-[#5C968D]/10 hover:border-[#5C968D] transition-all text-center whitespace-nowrap">
              Solicitar Evaluación
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- Contenedor unificador -->
    <div class="w-full relative z-20">

      <!-- ==========================================
           2. FRANJA DE ESTADÍSTICAS Y AUTORIDAD
           ========================================== -->
      <section class="w-full bg-white relative z-30 py-24 md:py-32">
        <div class="max-w-7xl mx-auto px-5 md:px-6">

          <div #revealElement class="flex flex-col lg:flex-row items-center gap-16 lg:gap-20 opacity-0 translate-y-12 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]">

            <!-- Micro-Introducción / Contexto -->
            <div class="w-full lg:w-1/3 flex flex-col">
              <div class="w-8 h-[2px] bg-[#5C968D] mb-6"></div>
              <h2 class="font-jakarta text-[28px] md:text-[36px] font-medium leading-[1.15] tracking-tight text-[#101827]">
                Números que respaldan nuestra <span class="italic text-[#1E3E62] font-medium">solvencia técnica.</span>
              </h2>
              <p class="font-inter text-slate-500 mt-6 leading-relaxed font-light text-base">
                Nuestra capacidad operativa está avalada por años de ejecución ininterrumpida y un estándar de cumplimiento riguroso en todo el país.
              </p>
            </div>

            <!-- Cuadrícula de Métricas -->
            <div class="w-full lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 md:gap-x-0 md:divide-x divide-slate-200">
              <div class="flex flex-col items-center lg:items-start md:px-6 text-center lg:text-left hover:-translate-y-1 transition-transform duration-300">
                <span class="font-jakarta text-5xl md:text-[56px] font-medium text-[#101827] mb-3 tracking-tighter">
                  <span class="text-[#5C968D]">+</span>20
                </span>
                <span class="text-[10px] md:text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Años de Experiencia</span>
              </div>
              <div class="flex flex-col items-center lg:items-start md:px-6 text-center lg:text-left hover:-translate-y-1 transition-transform duration-300">
                <span class="font-jakarta text-5xl md:text-[56px] font-medium text-[#101827] mb-3 tracking-tighter">
                  <span class="text-[#5C968D]">+</span>100
                </span>
                <span class="text-[10px] md:text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Proyectos Ejecutados</span>
              </div>
              <div class="flex flex-col items-center lg:items-start md:px-6 text-center lg:text-left hover:-translate-y-1 transition-transform duration-300">
                <span class="font-jakarta text-5xl md:text-[56px] font-medium text-[#101827] mb-3 tracking-tighter">
                  <span class="text-[#5C968D]">+</span>39<span class="text-3xl lg:text-4xl text-slate-300">K</span>
                </span>
                <span class="text-[10px] md:text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">m² Intervenidos</span>
              </div>
              <div class="flex flex-col items-center lg:items-start md:px-6 text-center lg:text-left hover:-translate-y-1 transition-transform duration-300">
                <span class="font-jakarta text-5xl md:text-[56px] font-medium text-[#1E3E62] mb-3 tracking-tighter">
                  100<span class="text-[#5C968D]">%</span>
                </span>
                <span class="text-[10px] md:text-xs font-mono text-slate-400 uppercase tracking-widest font-bold">Alcance Nacional</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      <!-- ==========================================
           3. LOGOS CLIENTES (Marquesina Corregida)
           ========================================== -->
      <section class="bg-[#F8FAFC] py-16 md:py-24 border-y border-slate-200 overflow-hidden relative z-10 flex flex-col items-center">

        <p #revealElement class="text-[10px] md:text-xs font-mono text-slate-400 font-bold mb-12 tracking-[0.3em] uppercase opacity-0 transition-opacity duration-1000">
          CONFIANZA RESPALDADA POR FIRMAS LÍDERES
        </p>

        <div class="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none"></div>

        <!-- Contenedor principal de la marquesina con w-full pero ocultando desbordamiento -->
        <div class="w-full overflow-hidden flex relative">
          <!-- Las dos pistas animadas forzadas a w-max para no deformarse -->
          <div class="flex w-max animate-marquee hover:[animation-play-state:paused] transition-all">

            <!-- Bloque 1 -->
            <div class="flex w-max items-center justify-around gap-16 md:gap-32 px-8 md:px-16 grayscale opacity-50">
              <span class="font-jakarta font-bold text-2xl md:text-3xl text-[#101827] tracking-tighter whitespace-nowrap hover:opacity-100 hover:grayscale-0 hover:text-[#0B192C] transition-all duration-300 cursor-default">DIMS Design</span>
              <span class="font-jakarta font-medium text-2xl md:text-3xl text-[#101827] whitespace-nowrap hover:opacity-100 hover:grayscale-0 hover:text-[#0B192C] transition-all duration-300 cursor-default">JB Toma la Mano</span>
              <span class="font-inter font-black text-2xl md:text-3xl text-[#101827] tracking-tight whitespace-nowrap hover:opacity-100 hover:grayscale-0 hover:text-[#0B192C] transition-all duration-300 cursor-default">Servicios Generales CMS</span>
              <span class="font-jakarta font-bold text-2xl md:text-3xl text-[#101827] whitespace-nowrap hover:opacity-100 hover:grayscale-0 hover:text-[#0B192C] transition-all duration-300 cursor-default">ALS</span>
              <span class="font-inter font-light text-2xl md:text-3xl text-[#101827] tracking-widest lowercase whitespace-nowrap hover:opacity-100 hover:grayscale-0 hover:text-[#0B192C] transition-all duration-300 cursor-default">ERA Soluciones</span>
            </div>

            <!-- Bloque 2 (Copia idéntica) -->
            <div class="flex w-max items-center justify-around gap-16 md:gap-32 px-8 md:px-16 grayscale opacity-50">
              <span class="font-jakarta font-bold text-2xl md:text-3xl text-[#101827] tracking-tighter whitespace-nowrap hover:opacity-100 hover:grayscale-0 hover:text-[#0B192C] transition-all duration-300 cursor-default">DIMS Design</span>
              <span class="font-jakarta font-medium text-2xl md:text-3xl text-[#101827] whitespace-nowrap hover:opacity-100 hover:grayscale-0 hover:text-[#0B192C] transition-all duration-300 cursor-default">JB Toma la Mano</span>
              <span class="font-inter font-black text-2xl md:text-3xl text-[#101827] tracking-tight whitespace-nowrap hover:opacity-100 hover:grayscale-0 hover:text-[#0B192C] transition-all duration-300 cursor-default">Servicios Generales CMS</span>
              <span class="font-jakarta font-bold text-2xl md:text-3xl text-[#101827] whitespace-nowrap hover:opacity-100 hover:grayscale-0 hover:text-[#0B192C] transition-all duration-300 cursor-default">ALS</span>
              <span class="font-inter font-light text-2xl md:text-3xl text-[#101827] tracking-widest lowercase whitespace-nowrap hover:opacity-100 hover:grayscale-0 hover:text-[#0B192C] transition-all duration-300 cursor-default">ERA Soluciones</span>
            </div>

          </div>
        </div>
      </section>

      <!-- ==========================================
           4. SLIDER ANTES Y DESPUÉS
           ========================================== -->
      <section class="py-24 md:py-32 bg-white relative overflow-hidden">
        <div class="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
             style="background-image: linear-gradient(#101827 1px, transparent 1px), linear-gradient(90deg, #101827 1px, transparent 1px); background-size: 32px 32px;"></div>

        <div #revealElement class="max-w-7xl mx-auto px-5 md:px-6 relative z-10 opacity-0 translate-y-12 transition-all duration-[1200ms] ease-[cubic-bezier(0.25,1,0.5,1)]">

          <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div class="max-w-2xl">
              <div class="inline-flex items-center gap-3 mb-8 px-4 py-2 border border-slate-200 bg-[#F8FAFC] rounded-sm">
                <div class="w-1.5 h-1.5 rounded-full bg-[#5C968D]"></div>
                <span class="font-inter text-[#101827] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Evidencia Documentada</span>
              </div>
              <h2 class="font-inter text-[36px] md:text-[56px] leading-[1.05] tracking-tighter text-[#101827]">
                <span class="block font-medium">La diferencia del</span>
                <span class="block font-light text-slate-500 mt-1 md:mt-2">rigor técnico.</span>
              </h2>
            </div>
            <div class="max-w-sm md:max-w-md border-l border-slate-200 pl-6 md:pl-8">
              <p class="text-slate-500 font-inter text-base leading-relaxed font-light">Desliza para comparar el estado inicial de la obra y el acabado final entregado a nuestro cliente. Un testimonio visual de nuestra precisión.</p>
            </div>
          </div>

          <div class="bg-white p-2 md:p-3 border border-slate-200 rounded-sm shadow-xl shadow-slate-200/50">
            <app-before-after-slider />
          </div>

        </div>
      </section>

      <!-- ==========================================
        5. RESUMEN DE SERVICIOS
        ========================================== -->
      <section class="py-24 md:py-32 bg-[#F8FAFC] border-t border-slate-200">
        <div class="max-w-7xl mx-auto px-5 md:px-6">

          <div #revealElement class="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 opacity-0 translate-y-8 transition-all duration-1000 ease-out">
            <div class="max-w-2xl">
              <div class="inline-flex items-center gap-3 mb-8 px-4 py-2 border border-slate-200 bg-white rounded-sm shadow-sm">
                <div class="w-1.5 h-1.5 rounded-full bg-[#5C968D]"></div>
                <span class="font-inter text-[#101827] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Áreas de Expertise</span>
              </div>
              <h2 class="font-inter text-[36px] md:text-[56px] leading-[1.05] tracking-tighter text-[#101827]">
                <span class="block font-medium">Especialidades</span>
                <span class="block font-light text-slate-500 mt-1 md:mt-2">Técnicas.</span>
              </h2>
            </div>
            <div class="max-w-sm md:max-w-md border-l border-slate-200 pl-6 md:pl-8 mb-2">
              <p class="text-slate-500 font-inter text-base leading-relaxed font-light mb-6">Dominio integral de las partidas arquitectónicas críticas para garantizar la entrega de obras sin observaciones.</p>

              <!-- CORRECCIÓN: py-1 y overflow-visible -->
              <a routerLink="/servicios" class="inline-flex items-center gap-2 py-1 font-jakarta font-bold text-[11px] text-[#101827] hover:text-[#5C968D] uppercase tracking-[0.15em] transition-colors group">
                Ver catálogo completo
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform overflow-visible"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>

          <div #revealElement class="grid grid-cols-1 md:grid-cols-3 border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-[#101827] shadow-xl shadow-slate-200/50 rounded-sm overflow-hidden opacity-0 translate-y-12 transition-all duration-[1200ms] delay-200 ease-out">

            <!-- SERVICIO 1: ELECTRICIDAD INDUSTRIAL -->
            <article routerLink="/servicios" class="group relative h-[450px] md:h-[600px] overflow-hidden cursor-pointer">
              <img [src]="imgElectricidad"
                   [attr.srcset]="srcsetElectricidad"
                   sizes="(min-width: 768px) 33vw, 100vw"
                   width="800"
                   height="1200"
                   loading="lazy"
                   decoding="async"
                   alt="Electricidad Industrial"
                   class="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
              <div class="absolute inset-0 bg-gradient-to-t from-[#101827] via-[#101827]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>
              <div class="absolute inset-x-0 bottom-0 p-8 md:p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 class="font-inter text-2xl text-white font-medium mb-3 tracking-tight">Electricidad Industrial</h3>
                <p class="font-inter text-slate-300 text-sm leading-relaxed font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">Diseño, montaje y certificación de tableros eléctricos, eficiencia energética y levantamiento de normativas INDECI.</p>
              </div>
            </article>

            <!-- SERVICIO 2: REDES HIDROSANITARIAS (GASFITERÍA) -->
            <article routerLink="/servicios" class="group relative h-[450px] md:h-[600px] overflow-hidden cursor-pointer">
              <img [src]="imgHidrosanitarias"
                   [attr.srcset]="srcsetHidrosanitarias"
                   sizes="(min-width: 768px) 33vw, 100vw"
                   width="800"
                   height="1200"
                   loading="lazy"
                   decoding="async"
                   alt="Redes Hidrosanitarias"
                   class="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
              <div class="absolute inset-0 bg-gradient-to-t from-[#101827] via-[#101827]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>
              <div class="absolute inset-x-0 bottom-0 p-8 md:p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 class="font-inter text-2xl text-white font-medium mb-3 tracking-tight">Redes Hidrosanitarias</h3>
                <p class="font-inter text-slate-300 text-sm leading-relaxed font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">Gasfitería industrial, canalizaciones pesadas, redes termofusionadas y montaje de aparatos institucionales.</p>
              </div>
            </article>

            <!-- SERVICIO 3: ACABADOS Y PINTURA -->
            <article routerLink="/servicios" class="group relative h-[450px] md:h-[600px] overflow-hidden cursor-pointer">
              <img [src]="imgAcabados"
                   [attr.srcset]="srcsetAcabados"
                   sizes="(min-width: 768px) 33vw, 100vw"
                   width="800"
                   height="1200"
                   loading="lazy"
                   decoding="async"
                   alt="Acabados y Pintura"
                   class="absolute inset-0 w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]">
              <div class="absolute inset-0 bg-gradient-to-t from-[#101827] via-[#101827]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>
              <div class="absolute inset-x-0 bottom-0 p-8 md:p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 class="font-inter text-2xl text-white font-medium mb-3 tracking-tight">Acabados y Pintura</h3>
                <p class="font-inter text-slate-300 text-sm leading-relaxed font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-3">Empastes milimétricos, pintura epóxica, poliuretanos, acabados arquitectónicos y revestimientos porcelánicos.</p>
              </div>
            </article>

          </div>
        </div>
      </section>

      <!-- ==========================================
           6. PROYECTOS DESTACADOS
           ========================================== -->
      <section class="py-24 md:py-32 bg-white">
        <div class="max-w-7xl mx-auto px-5 md:px-6">

          <div #revealElement class="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 opacity-0 translate-y-8 transition-all duration-1000 ease-out">
            <div class="max-w-2xl">
              <div class="inline-flex items-center gap-3 mb-8 px-4 py-2 border border-slate-200 bg-[#F8FAFC] rounded-sm shadow-sm">
                <div class="w-1.5 h-1.5 rounded-full bg-[#5C968D]"></div>
                <span class="font-inter text-[#101827] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Portafolio Selecto</span>
              </div>
              <h2 class="font-inter text-[36px] md:text-[56px] leading-[1.05] tracking-tighter text-[#101827]">
                <span class="block font-medium">Obras</span>
                <span class="block font-light text-slate-500 mt-1 md:mt-2">Ejecutadas.</span>
              </h2>
            </div>
            <div class="max-w-sm md:max-w-md border-l border-slate-200 pl-6 md:pl-8 mb-2">
              <p class="text-slate-500 font-inter text-base leading-relaxed font-light mb-6">Una muestra de nuestra capacidad operativa en proyectos de alta exigencia, cumpliendo plazos y normativas.</p>

              <!-- CORRECCIÓN: py-1 y overflow-visible -->
              <a routerLink="/proyectos" class="inline-flex items-center gap-2 py-1 font-jakarta font-bold text-[11px] text-[#101827] hover:text-[#5C968D] uppercase tracking-[0.15em] transition-colors group">
                Ver portafolio completo
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform overflow-visible"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>

          <div #revealElement class="flex flex-col gap-8 md:gap-12 opacity-0 translate-y-12 transition-all duration-[1200ms] delay-100 ease-[cubic-bezier(0.25,1,0.5,1)]">
            <article routerLink="/proyectos" class="group grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200 rounded-sm overflow-hidden hover:border-[#5C968D]/50 transition-colors duration-500 cursor-pointer shadow-sm hover:shadow-xl">
              <div class="lg:col-span-8 relative aspect-[16/10] md:aspect-auto md:h-[500px] overflow-hidden bg-slate-100">
                <img [src]="imgTheSight"
                     [attr.srcset]="srcsetTheSight"
                     sizes="(min-width: 1024px) 66vw, 100vw"
                     width="1280"
                     height="800"
                     loading="lazy"
                     decoding="async"
                     alt="Edificio Residencial The Sight en Barranco"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000">
                <div class="absolute top-6 left-6 bg-white/90 backdrop-blur-sm border border-slate-200/50 text-[#101827] text-[10px] font-bold px-4 py-1.5 uppercase tracking-[0.2em] rounded-sm font-jakarta">Proyecto Destacado</div>
              </div>
              <div class="lg:col-span-4 p-8 md:p-12 flex flex-col justify-center bg-[#F8FAFC] lg:border-l border-slate-200 group-hover:bg-white transition-colors duration-500">
                <h3 class="font-inter font-medium text-2xl text-[#101827] mb-4 tracking-tight group-hover:text-[#5C968D] transition-colors">Edificio Residencial The Sight</h3>
                <p class="font-inter text-slate-500 text-sm mb-10 leading-relaxed font-light">Construcción de casco estructural y losas postensadas.</p>
                <div class="mt-auto flex flex-col gap-4 border-t border-slate-200 pt-6">
                  <div class="grid grid-cols-2 gap-4">
                    <div><span class="block font-inter text-[9px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Ubicación</span><span class="block font-inter text-sm text-[#101827] font-medium">Barranco, Lima</span></div>
                    <div><span class="block font-inter text-[9px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Cliente</span><span class="block font-inter text-sm text-[#101827] font-medium">Edifica</span></div>
                  </div>
                </div>
              </div>
            </article>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <article routerLink="/proyectos" class="group flex flex-col bg-white border border-slate-200 rounded-sm overflow-hidden hover:border-[#5C968D]/50 transition-colors duration-500 cursor-pointer shadow-sm hover:shadow-xl">
                <div class="relative aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
                  <img [src]="imgDelParque"
                       [attr.srcset]="srcsetDelParque"
                       sizes="(min-width: 768px) 50vw, 100vw"
                       width="960"
                       height="600"
                       loading="lazy"
                       decoding="async"
                       alt="Renovación de patio moderno en Condominio Del Parque, Chiclayo"
                       class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000">
                </div>
                <div class="p-8 flex flex-col flex-grow bg-[#F8FAFC] group-hover:bg-white transition-colors duration-500">
                  <h3 class="font-inter font-medium text-xl text-[#101827] mb-3 tracking-tight group-hover:text-[#5C968D] transition-colors">Condominio Del Parque</h3>
                  <div class="mt-auto flex justify-between border-t border-slate-200 pt-5">
                    <div><span class="block font-inter text-[9px] text-slate-400 uppercase font-bold">Ubicación</span><span class="block text-sm font-medium">Chiclayo</span></div>
                    <div class="text-right"><span class="block font-inter text-[9px] text-slate-400 uppercase font-bold">Cliente</span><span class="block text-sm font-medium">Cissac</span></div>
                  </div>
                </div>
              </article>

              <article routerLink="/proyectos" class="group flex flex-col bg-white border border-slate-200 rounded-sm overflow-hidden hover:border-[#5C968D]/50 transition-colors duration-500 cursor-pointer shadow-sm hover:shadow-xl">
                <div class="relative aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
                  <img [src]="imgChabrier"
                       [attr.srcset]="srcsetChabrier"
                       sizes="(min-width: 768px) 50vw, 100vw"
                       width="960"
                       height="600"
                       loading="lazy"
                       decoding="async"
                       alt="Instalación HVAC con tuberías y manómetros en Proyecto Boutique Chabrier"
                       class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-1000">
                </div>
                <div class="p-8 flex flex-col flex-grow bg-[#F8FAFC] group-hover:bg-white transition-colors duration-500">
                  <h3 class="font-inter font-medium text-xl text-[#101827] mb-3 tracking-tight group-hover:text-[#5C968D] transition-colors">Proyecto Boutique Chabrier</h3>
                  <div class="mt-auto flex justify-between border-t border-slate-200 pt-5">
                    <div><span class="block font-inter text-[9px] text-slate-400 uppercase font-bold">Ubicación</span><span class="block text-sm font-medium">San Isidro</span></div>
                    <div class="text-right"><span class="block font-inter text-[9px] text-slate-400 uppercase font-bold">Cliente</span><span class="block text-sm font-medium">Lateral</span></div>
                  </div>
                </div>
              </article>
            </div>
          </div>

        </div>
      </section>

    </div>

    <!-- ==========================================
         7. PRE-FOOTER INMERSIVO
         ========================================== -->
    <section #revealElement class="bg-[#101827] py-24 md:py-32 relative overflow-hidden border-t border-slate-800 opacity-0 transition-opacity duration-1000 ease-in">
      <div class="absolute inset-0 z-0 pointer-events-none mix-blend-overlay"
           style="background-image: linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 6rem 6rem;"></div>

      <div class="max-w-7xl mx-auto px-5 md:px-6 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div class="lg:col-span-7">
            <h2 class="font-inter text-[40px] md:text-[64px] leading-[1.05] tracking-tighter text-[#F5F6F8]">
              <span class="block font-medium">¿Listo para elevar</span>
              <span class="block font-light text-[#B8C3D2] mt-1 md:mt-2">los estándares de su obra?</span>
            </h2>
          </div>
          <div class="lg:col-span-5 lg:border-l border-slate-700/60 lg:pl-12 flex flex-col justify-center">
            <p class="text-base md:text-lg text-[#B8C3D2] font-inter mb-8 leading-relaxed font-light">Nuestro equipo de ingeniería está preparado para evaluar sus requerimientos técnicos y estructurar una propuesta detallada.</p>
            <div class="flex flex-col sm:flex-row gap-4">
              <a routerLink="/contacto" class="bg-[#F5F6F8] text-[#101827] px-6 py-4 rounded-sm text-[13px] font-jakarta font-bold uppercase tracking-[0.1em] hover:bg-white transition-colors text-center">Iniciar Proyecto</a>
              <a href="https://wa.me/51913460898" target="_blank" class="bg-transparent border border-[#5C968D]/50 text-[#F5F6F8] px-6 py-4 rounded-sm text-[13px] font-jakarta font-bold uppercase tracking-[0.1em] hover:bg-[#5C968D]/15 hover:border-[#5C968D] transition-all text-center flex items-center justify-center gap-2">WhatsApp Técnico</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes heroFadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-hero-fade-in {
      animation: heroFadeInUp 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
      animation-delay: 150ms;
    }

    /* Animación fluida de Marquesina corregida a -50% */
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-marquee {
      animation: marquee 30s linear infinite;
    }
  `]
})
export class Home implements AfterViewInit {
  @ViewChildren('revealElement') revealElements!: QueryList<ElementRef>;

  readonly heroSrc = cloudinarySized(HERO_IMAGE, 1280);
  readonly heroSrcset = cloudinarySrcset(HERO_IMAGE, HERO_WIDTHS);

  private readonly cardWidths = [480, 800, 1200] as const;
  private readonly projectWidths = [640, 960, 1440] as const;

  readonly imgElectricidad = cloudinarySized(
    'https://res.cloudinary.com/w775d4fq/image/upload/v1793328787/IMG-20240918-WA0001.jpg',
    800,
  );
  readonly srcsetElectricidad = cloudinarySrcset(
    'https://res.cloudinary.com/w775d4fq/image/upload/v1793328787/IMG-20240918-WA0001.jpg',
    this.cardWidths,
  );
  readonly imgHidrosanitarias = cloudinarySized(
    'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793329130/Sistema_de_rociadores_sobre_escalera_amarilla.png',
    800,
  );
  readonly srcsetHidrosanitarias = cloudinarySrcset(
    'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793329130/Sistema_de_rociadores_sobre_escalera_amarilla.png',
    this.cardWidths,
  );
  readonly imgAcabados = cloudinarySized(
    'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793329414/Mantenimiento_en_fachada_azul.png',
    800,
  );
  readonly srcsetAcabados = cloudinarySrcset(
    'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793329414/Mantenimiento_en_fachada_azul.png',
    this.cardWidths,
  );
  readonly imgTheSight = cloudinarySized(
    'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793332153/Trabajadores_en_el_tejado_urbano.png',
    1280,
  );
  readonly srcsetTheSight = cloudinarySrcset(
    'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793332153/Trabajadores_en_el_tejado_urbano.png',
    this.projectWidths,
  );
  readonly imgDelParque = cloudinarySized(
    'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793332711/Renovaci%C3%B3n_de_patio_moderno_en_construcci%C3%B3n.png',
    960,
  );
  readonly srcsetDelParque = cloudinarySrcset(
    'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793332711/Renovaci%C3%B3n_de_patio_moderno_en_construcci%C3%B3n.png',
    this.projectWidths,
  );
  readonly imgChabrier = cloudinarySized(
    'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793333041/Instalaci%C3%B3n_HVAC_con_Tuber%C3%ADas_y_Man%C3%B3metros.png',
    960,
  );
  readonly srcsetChabrier = cloudinarySrcset(
    'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793333041/Instalaci%C3%B3n_HVAC_con_Tuber%C3%ADas_y_Man%C3%B3metros.png',
    this.projectWidths,
  );

  ngAfterViewInit() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-12');
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.revealElements.forEach(el => observer.observe(el.nativeElement));
  }
}
