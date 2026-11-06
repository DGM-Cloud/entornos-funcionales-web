import { Component, signal, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  template: `
    <!-- HEADER NAVBAR (Smart Header con Auto-hide y Cambio de Color) -->
    <header class="fixed top-0 left-0 w-full z-50 h-[64px] md:h-[72px] flex items-center transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            [ngClass]="{
              'bg-transparent': isMobileMenuOpen(),
              'bg-white/95 backdrop-blur-md border-b border-slate-200': !isMobileMenuOpen() && !isScrolled(),
              'bg-[#0B192C]/95 backdrop-blur-md border-b border-[#1E3E62] shadow-lg': !isMobileMenuOpen() && isScrolled(),
              '-translate-y-full': isHeaderHidden(),
              'translate-y-0': !isHeaderHidden()
            }">
      <div class="max-w-7xl mx-auto px-5 md:px-6 w-full flex justify-between items-center">

        <!-- LOGO OFICIAL -->
        <a routerLink="/" (click)="closeMenu()" class="flex items-center cursor-pointer relative z-50">
          <img src="assets/logo.webp"
               alt="Entornos Funcionales"
               width="180"
               height="52"
               decoding="async"
               class="h-10 md:h-[52px] w-auto object-contain transition-all duration-500 origin-left"
               [class.brightness-0]="isMobileMenuOpen() || isScrolled()"
               [class.invert]="isMobileMenuOpen() || isScrolled()"
               [class.opacity-90]="isMobileMenuOpen() || isScrolled()"
               [class.hover:scale-105]="!isMobileMenuOpen()" />
        </a>

        <!-- NAVEGACIÓN DESKTOP -->
        <nav class="hidden md:flex gap-10 items-center font-inter text-[13px] font-medium relative z-50 transition-colors duration-500">
          <a routerLink="/" routerLinkActive="font-bold" [routerLinkActiveOptions]="{exact: true}"
             class="transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#005691] hover:after:w-full after:transition-all after:duration-300"
             [ngClass]="isScrolled() ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-[#0B192C]'">Inicio</a>

          <a routerLink="/nosotros" routerLinkActive="font-bold"
             class="transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#005691] hover:after:w-full after:transition-all after:duration-300"
             [ngClass]="isScrolled() ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-[#0B192C]'">Nosotros</a>

          <a routerLink="/servicios" routerLinkActive="font-bold"
             class="transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#005691] hover:after:w-full after:transition-all after:duration-300"
             [ngClass]="isScrolled() ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-[#0B192C]'">Servicios</a>

          <a routerLink="/proyectos" routerLinkActive="font-bold"
             class="transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#005691] hover:after:w-full after:transition-all after:duration-300"
             [ngClass]="isScrolled() ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-[#0B192C]'">Proyectos</a>

          <a routerLink="/contacto" routerLinkActive="font-bold"
             class="transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-[#005691] hover:after:w-full after:transition-all after:duration-300"
             [ngClass]="isScrolled() ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-[#0B192C]'">Contacto</a>
        </nav>

        <!-- CTA HEADER DESKTOP -->
        <div class="hidden md:flex items-center gap-6 relative z-50">
          <div class="h-4 w-[1px] transition-colors duration-500" [ngClass]="isScrolled() ? 'bg-slate-700' : 'bg-slate-200'"></div>
          <a routerLink="/contacto" class="group flex items-center gap-2 cursor-pointer focus:outline-none p-1">
            <span class="font-inter text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-500"
                  [ngClass]="isScrolled() ? 'text-white group-hover:text-[#5C968D]' : 'text-[#0B192C] group-hover:text-[#005691]'">
              Solicitar Cotización
            </span>
            <div class="w-6 h-6 border rounded-full flex items-center justify-center transition-colors duration-500"
                 [ngClass]="isScrolled() ? 'border-slate-600 group-hover:border-[#5C968D] group-hover:bg-[#5C968D]' : 'border-slate-200 group-hover:border-[#005691] group-hover:bg-[#005691]'">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                   [ngClass]="isScrolled() ? 'text-white' : 'text-[#0B192C] group-hover:text-white'"><path d="M7 17L17 7"/><path d="M7 7h10v10"/></svg>
            </div>
          </a>
        </div>

        <!-- BOTÓN HAMBURGUESA ANIMADO -->
        <button class="md:hidden relative w-10 h-10 flex items-center justify-center focus:outline-none group -mr-2 z-50"
                (click)="toggleMenu()"
                aria-label="Alternar menú">
          <div class="relative w-6 h-3.5">
            <span class="absolute left-0 w-full h-[1.5px] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  [class]="isMobileMenuOpen() || isScrolled() ? 'bg-white' : 'bg-[#0B192C]'"
                  [class.top-[50%]]="isMobileMenuOpen()" [class.-translate-y-[50%]]="isMobileMenuOpen()" [class.rotate-45]="isMobileMenuOpen()"
                  [class.top-0]="!isMobileMenuOpen()"></span>

            <span class="absolute left-0 top-[50%] -translate-y-[50%] w-full h-[1.5px] transition-all duration-200 ease-in-out"
                  [class]="isMobileMenuOpen() ? 'opacity-0' : 'opacity-100'"
                  [class.bg-white]="isScrolled()" [class.bg-[#0B192C]]="!isScrolled()"></span>

            <span class="absolute left-0 w-full h-[1.5px] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  [class]="isMobileMenuOpen() || isScrolled() ? 'bg-white' : 'bg-[#0B192C]'"
                  [class.top-[50%]]="isMobileMenuOpen()" [class.-translate-y-[50%]]="isMobileMenuOpen()" [class.-rotate-45]="isMobileMenuOpen()"
                  [class.bottom-0]="!isMobileMenuOpen()"></span>
          </div>
        </button>
      </div>

      <!-- PANEL DE NAVEGACIÓN MÓVIL -->
      <div class="md:hidden fixed inset-0 h-[100dvh] w-full bg-[#0B192C] z-40 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] overflow-hidden"
           [class.clip-closed]="!isMobileMenuOpen()"
           [class.clip-open]="isMobileMenuOpen()">

        <div class="absolute inset-0 z-0 pointer-events-none opacity-5 mix-blend-overlay"
             style="background-image: linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px); background-size: 4rem 4rem;"></div>

        <!-- CORRECCIÓN: pt-20 pb-8 para dar más espacio de respiración en móviles pequeños -->
        <nav class="flex flex-col px-6 pt-20 pb-8 overflow-y-auto h-full relative z-10 custom-scrollbar">

          <!-- CORRECCIÓN: flex-grow y justify-center para que se centren dinámicamente. gap-4 min-[390px]:gap-6 -->
          <div class="flex flex-col justify-center flex-grow gap-4 min-[390px]:gap-6 mt-4">

            <a routerLink="/" routerLinkActive="active-nav-mobile" [routerLinkActiveOptions]="{exact: true}" (click)="closeMenu()"
               class="group flex items-end gap-5 transition-all duration-700 ease-out nav-item"
               [style.transition-delay]="isMobileMenuOpen() ? '100ms' : '0ms'"
               [class.translate-y-8]="!isMobileMenuOpen()" [class.opacity-0]="!isMobileMenuOpen()"
               [class.translate-y-0]="isMobileMenuOpen()" [class.opacity-100]="isMobileMenuOpen()">
              <span class="font-mono text-[10px] sm:text-xs text-[#5C968D] font-bold mb-1.5 sm:mb-2 md:mb-3">01</span>
              <!-- CORRECCIÓN: text-[38px] para celulares súper pequeños, escala hacia text-[44px] -->
              <span class="font-jakarta font-medium text-[38px] min-[390px]:text-[44px] sm:text-5xl text-white tracking-tighter leading-none group-hover:text-[#5C968D] transition-colors nav-text">Inicio</span>
            </a>

            <div class="w-full h-[1px] bg-slate-800 transition-all duration-700 delay-[150ms]" [class.w-0]="!isMobileMenuOpen()"></div>

            <a routerLink="/nosotros" routerLinkActive="active-nav-mobile" (click)="closeMenu()"
               class="group flex items-end gap-5 transition-all duration-700 ease-out nav-item"
               [style.transition-delay]="isMobileMenuOpen() ? '200ms' : '0ms'"
               [class.translate-y-8]="!isMobileMenuOpen()" [class.opacity-0]="!isMobileMenuOpen()"
               [class.translate-y-0]="isMobileMenuOpen()" [class.opacity-100]="isMobileMenuOpen()">
              <span class="font-mono text-[10px] sm:text-xs text-[#5C968D] font-bold mb-1.5 sm:mb-2 md:mb-3">02</span>
              <span class="font-jakarta font-medium text-[38px] min-[390px]:text-[44px] sm:text-5xl text-white tracking-tighter leading-none group-hover:text-[#5C968D] transition-colors nav-text">Nosotros</span>
            </a>

            <div class="w-full h-[1px] bg-slate-800 transition-all duration-700 delay-[250ms]" [class.w-0]="!isMobileMenuOpen()"></div>

            <a routerLink="/servicios" routerLinkActive="active-nav-mobile" (click)="closeMenu()"
               class="group flex items-end gap-5 transition-all duration-700 ease-out nav-item"
               [style.transition-delay]="isMobileMenuOpen() ? '300ms' : '0ms'"
               [class.translate-y-8]="!isMobileMenuOpen()" [class.opacity-0]="!isMobileMenuOpen()"
               [class.translate-y-0]="isMobileMenuOpen()" [class.opacity-100]="isMobileMenuOpen()">
              <span class="font-mono text-[10px] sm:text-xs text-[#5C968D] font-bold mb-1.5 sm:mb-2 md:mb-3">03</span>
              <span class="font-jakarta font-medium text-[38px] min-[390px]:text-[44px] sm:text-5xl text-white tracking-tighter leading-none group-hover:text-[#5C968D] transition-colors nav-text">Servicios</span>
            </a>

            <div class="w-full h-[1px] bg-slate-800 transition-all duration-700 delay-[350ms]" [class.w-0]="!isMobileMenuOpen()"></div>

            <a routerLink="/proyectos" routerLinkActive="active-nav-mobile" (click)="closeMenu()"
               class="group flex items-end gap-5 transition-all duration-700 ease-out nav-item"
               [style.transition-delay]="isMobileMenuOpen() ? '400ms' : '0ms'"
               [class.translate-y-8]="!isMobileMenuOpen()" [class.opacity-0]="!isMobileMenuOpen()"
               [class.translate-y-0]="isMobileMenuOpen()" [class.opacity-100]="isMobileMenuOpen()">
              <span class="font-mono text-[10px] sm:text-xs text-[#5C968D] font-bold mb-1.5 sm:mb-2 md:mb-3">04</span>
              <span class="font-jakarta font-medium text-[38px] min-[390px]:text-[44px] sm:text-5xl text-white tracking-tighter leading-none group-hover:text-[#5C968D] transition-colors nav-text">Proyectos</span>
            </a>

            <div class="w-full h-[1px] bg-slate-800 transition-all duration-700 delay-[450ms]" [class.w-0]="!isMobileMenuOpen()"></div>

            <a routerLink="/contacto" routerLinkActive="active-nav-mobile" (click)="closeMenu()"
               class="group flex items-end gap-5 transition-all duration-700 ease-out nav-item"
               [style.transition-delay]="isMobileMenuOpen() ? '500ms' : '0ms'"
               [class.translate-y-8]="!isMobileMenuOpen()" [class.opacity-0]="!isMobileMenuOpen()"
               [class.translate-y-0]="isMobileMenuOpen()" [class.opacity-100]="isMobileMenuOpen()">
              <span class="font-mono text-[10px] sm:text-xs text-[#5C968D] font-bold mb-1.5 sm:mb-2 md:mb-3">05</span>
              <span class="font-jakarta font-medium text-[38px] min-[390px]:text-[44px] sm:text-5xl text-white tracking-tighter leading-none group-hover:text-[#5C968D] transition-colors nav-text">Contacto</span>
            </a>
          </div>

          <!-- FICHA TÉCNICA DE CONTACTO -->
          <!-- CORRECCIÓN: pt-6 para móviles pequeños, pt-12 para estándar -->
          <div class="mt-auto pt-6 min-[390px]:pt-8 md:pt-12 transition-all duration-1000 ease-out"
               [style.transition-delay]="isMobileMenuOpen() ? '700ms' : '0ms'"
               [class.translate-y-12]="!isMobileMenuOpen()" [class.opacity-0]="!isMobileMenuOpen()"
               [class.translate-y-0]="isMobileMenuOpen()" [class.opacity-100]="isMobileMenuOpen()">

            <div class="bg-[#1E3E62]/20 border border-[#1E3E62] p-4 md:p-5 rounded-sm backdrop-blur-md flex flex-col gap-3 md:gap-4">
              <div class="flex items-center gap-3">
                <div class="w-1.5 h-1.5 bg-[#5C968D] rounded-full animate-pulse"></div>
                <span class="font-mono text-[10px] text-slate-400 uppercase tracking-widest">Coordinación Técnica</span>
              </div>

              <div class="flex flex-col gap-0.5 md:gap-1">
                <a href="mailto:cotizaciones@entornosfuncionales.com" class="font-inter text-[12px] md:text-[13px] text-slate-300 font-light hover:text-white transition-colors truncate">cotizaciones&#64;entornosfuncionales.com</a>
                <a href="tel:+51913460898" class="font-mono text-base md:text-lg text-white font-medium hover:text-[#5C968D] transition-colors mt-1">+51 913 460 898</a>
              </div>

              <a routerLink="/contacto" (click)="closeMenu()" class="mt-2 flex items-center justify-center gap-2 w-full py-2.5 md:py-3 bg-[#5C968D] hover:bg-[#4a7d75] transition-colors text-white text-[11px] md:text-xs font-jakarta font-bold uppercase tracking-widest rounded-sm">
                Iniciar Proyecto
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
          </div>

        </nav>
      </div>
    </header>
  `,
  styles: [`
    .clip-closed {
      clip-path: circle(0px at 100% 0px);
    }
    .clip-open {
      clip-path: circle(150% at 100% 0px);
    }
    .active-nav-mobile .nav-text {
      color: transparent;
      -webkit-text-stroke: 1px #5C968D;
    }
    .custom-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .custom-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `]
})
export class Header {
  isMobileMenuOpen = signal(false);

  isHeaderHidden = signal(false);
  isScrolled = signal(false);
  lastScrollTop = 0;

  @HostListener('window:scroll')
  onWindowScroll() {
    if (this.isMobileMenuOpen()) return;

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    // CORRECCIÓN: Operación matemática corregida en una sola línea
    const threshold = window.innerHeight - 72;

    if (currentScroll > threshold) {
      this.isScrolled.set(true);
    } else {
      this.isScrolled.set(false);
    }

    if (currentScroll > this.lastScrollTop && currentScroll > 80) {
      this.isHeaderHidden.set(true);
    } else {
      this.isHeaderHidden.set(false);
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  toggleMenu() {
    this.isMobileMenuOpen.update(val => !val);
    this.manageBodyScroll();
  }

  closeMenu() {
    this.isMobileMenuOpen.set(false);
    this.manageBodyScroll();
  }

  private manageBodyScroll() {
    if (this.isMobileMenuOpen()) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}
