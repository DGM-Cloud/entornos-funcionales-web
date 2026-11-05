import { Component, ElementRef, QueryList, ViewChildren, AfterViewInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="relative w-full min-h-screen bg-[#0B192C] overflow-hidden pt-[104px] pb-24 md:pb-32">
      <!-- Fondo arquitectónico inmersivo con el azul corporativo -->
      <div class="absolute inset-0 z-0 flex justify-end opacity-100 mix-blend-luminosity">

        <!-- CORRECCIÓN: object-center en móvil, md:object-right en escritorio -->
        <img src="https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793336167/Sistema_de_v%C3%A1lvulas_contra_incendios_industriales.png"
             alt="Fondo Técnico"
             class="w-full md:w-3/4 h-full object-cover object-center md:object-right" />

        <!-- CORRECCIÓN: Gradiente vertical (to-b) en móvil, horizontal (to-r) en escritorio -->
        <div class="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-[#0B192C] via-[#0B192C]/90 to-[#0B192C]/30 md:to-transparent"></div>

        <div class="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#0B192C] to-transparent"></div>
      </div>

      <!-- Retícula técnica (Blueprint grid) -->
      <div class="absolute inset-0 z-0 pointer-events-none mix-blend-overlay"
           style="background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 4rem 4rem;"></div>

      <div class="max-w-7xl mx-auto px-5 md:px-6 relative z-10">

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          <!-- ==========================================
               COLUMNA IZQUIERDA: Información (Dark Mode)
               ========================================== -->
          <div #revealElement class="lg:col-span-5 flex flex-col opacity-0 translate-y-8 transition-all duration-1000 ease-out">
            <div class="inline-flex items-center gap-3 mb-8 px-4 py-2 border border-[#1E3E62] bg-[#1E3E62]/30 backdrop-blur-sm rounded-sm shadow-sm w-fit">
              <div class="w-1.5 h-1.5 rounded-full bg-[#005691] animate-pulse"></div>
              <span class="font-inter text-slate-200 text-[10px] font-bold tracking-[0.2em] uppercase">Oficina Técnica</span>
            </div>

            <h1 class="font-inter text-[44px] md:text-[64px] leading-[1.05] tracking-tighter text-white mb-8">
              <span class="block font-medium">Validación técnica</span>
              <span class="block font-light text-[#94A3B8] mt-1">y cotización.</span>
            </h1>

            <p class="text-base md:text-lg font-inter text-slate-400 mb-12 leading-relaxed font-light">
              Ingrese los detalles de su proyecto. Nuestro equipo de ingenieros analizará sus requerimientos para estructurar una propuesta económica y un cronograma de ejecución preciso.
            </p>

            <!-- Canales Directos -->
            <div class="flex flex-col gap-8 mt-auto border-t border-[#1E3E62] pt-10">

              <!-- WhatsApp -->
              <div class="flex flex-col gap-2">
                <span class="font-inter text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Atención Inmediata</span>
                <a href="https://wa.me/51913460898" target="_blank" class="group flex items-center gap-3 w-fit focus:outline-none focus:ring-2 focus:ring-[#005691] rounded-sm">
                  <span class="font-jakarta text-2xl md:text-3xl text-white font-medium tracking-tight group-hover:text-[#005691] transition-colors">+51 913 460 898</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#1E3E62] group-hover:text-[#005691] group-hover:translate-x-1 transition-all"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>

              <!-- Correo -->
              <div class="flex flex-col gap-2">
                <span class="font-inter text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Envío de Planos y TDR</span>
                <a href="mailto:cotizaciones@entornosfuncionales.com" class="font-inter text-base text-slate-300 hover:text-[#005691] transition-colors w-fit focus:outline-none focus:ring-2 focus:ring-[#005691] rounded-sm">
                  cotizaciones&#64;entornosfuncionales.com
                </a>
              </div>

            </div>
          </div>

          <!-- ==========================================
               COLUMNA DERECHA: Formulario B2B (Tarjeta Blanca)
               ========================================== -->
          <div #revealElement class="lg:col-span-7 opacity-0 translate-y-12 transition-all duration-[1200ms] delay-200 ease-[cubic-bezier(0.25,1,0.5,1)]">

            <form class="bg-white rounded-sm shadow-2xl shadow-[#0B192C]/50 p-8 md:p-12 lg:p-14 border-t-4 border-t-[#005691]">

              <div class="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                <h3 class="font-inter text-xl text-[#0B192C] font-bold tracking-tight">
                  Datos del Requerimiento
                </h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-[#005691] opacity-50"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
              </div>

              <!-- Fila 1: Nombre y Empresa -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="flex flex-col relative group">
                  <label class="font-inter text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-[#005691]">Nombre del Contacto *</label>
                  <input type="text" class="w-full bg-transparent border-b border-slate-300 py-2.5 text-[#0B192C] font-inter text-base focus:outline-none focus:border-[#005691] transition-colors placeholder:text-slate-300" placeholder="Ingeniero / Arquitecto" required>
                </div>
                <div class="flex flex-col relative group">
                  <label class="font-inter text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-[#005691]">Empresa / Constructora *</label>
                  <input type="text" class="w-full bg-transparent border-b border-slate-300 py-2.5 text-[#0B192C] font-inter text-base focus:outline-none focus:border-[#005691] transition-colors placeholder:text-slate-300" placeholder="Razón Social" required>
                </div>
              </div>

              <!-- Fila 2: Correo y Teléfono -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="flex flex-col relative group">
                  <label class="font-inter text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-[#005691]">Correo Corporativo *</label>
                  <input type="email" class="w-full bg-transparent border-b border-slate-300 py-2.5 text-[#0B192C] font-inter text-base focus:outline-none focus:border-[#005691] transition-colors placeholder:text-slate-300" placeholder="correo@empresa.com" required>
                </div>
                <div class="flex flex-col relative group">
                  <label class="font-inter text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-[#005691]">Teléfono Móvil</label>
                  <input type="tel" class="w-full bg-transparent border-b border-slate-300 py-2.5 text-[#0B192C] font-inter text-base focus:outline-none focus:border-[#005691] transition-colors placeholder:text-slate-300" placeholder="+51 900 000 000">
                </div>
              </div>

              <!-- Fila 3: Custom Select y Ubicación -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="flex flex-col relative">
                  <label class="font-inter text-[11px] font-bold uppercase tracking-widest mb-2 transition-colors"
                         [class.text-[#005691]]="isDropdownOpen()"
                         [class.text-slate-500]="!isDropdownOpen()">
                    Partida a Cotizar *
                  </label>

                  <div class="relative w-full">
                    <div class="w-full bg-transparent border-b py-2.5 font-inter text-base cursor-pointer flex justify-between items-center transition-colors"
                         (click)="toggleDropdown()"
                         [class.border-[#005691]]="isDropdownOpen()"
                         [class.border-slate-300]="!isDropdownOpen()">

                      <span [class.text-[#0B192C]]="selectedService()" [class.text-slate-300]="!selectedService()">
                        {{ getSelectedServiceName() || 'Seleccionar especialidad...' }}
                      </span>

                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                           class="transition-transform duration-300 pointer-events-none"
                           [class.rotate-180]="isDropdownOpen()"
                           [class.text-[#005691]]="isDropdownOpen()"
                           [class.text-slate-400]="!isDropdownOpen()">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </div>

                    @if (isDropdownOpen()) {
                    <div class="fixed inset-0 z-40" (click)="closeDropdown()"></div>
                    <div class="absolute top-[100%] left-0 w-full mt-2 bg-white border border-slate-200 rounded-sm shadow-xl shadow-slate-200/50 z-50 py-2 origin-top animate-fade-in-down">
                      @for (service of services; track service.id) {
                    <div class="px-5 py-3 font-inter text-[14px] text-slate-600 hover:bg-[#F8FAFC] hover:text-[#005691] cursor-pointer transition-colors"
                         [class.font-bold]="selectedService() === service.id"
                         [class.text-[#005691]]="selectedService() === service.id"
                         [class.bg-[#F8FAFC]]="selectedService() === service.id"
                         (click)="selectService(service.id)">
                      {{ service.name }}
                    </div>
                    }
                    </div>
                    }
                  </div>
                </div>

                <div class="flex flex-col relative group">
                  <label class="font-inter text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-[#005691]">Ubicación de la Obra</label>
                  <input type="text" class="w-full bg-transparent border-b border-slate-300 py-2.5 text-[#0B192C] font-inter text-base focus:outline-none focus:border-[#005691] transition-colors placeholder:text-slate-300" placeholder="Distrito, Ciudad">
                </div>
              </div>

              <!-- Fila 4: Descripción -->
              <div class="flex flex-col relative group mb-8">
                <label class="font-inter text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-[#005691]">Descripción Técnica del Requerimiento *</label>
                <textarea rows="3" class="w-full bg-transparent border-b border-slate-300 py-2.5 text-[#0B192C] font-inter text-base focus:outline-none focus:border-[#005691] transition-colors resize-none placeholder:text-slate-300" placeholder="Detalle metrajes, especificaciones particulares o plazos esperados..." required></textarea>
              </div>

              <!-- ==========================================
                   CHECKBOX LEGAL DE PRIVACIDAD
                   ========================================== -->
              <div class="mb-10">
                <label class="flex items-start gap-3 cursor-pointer group">
                  <div class="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" class="peer appearance-none w-4 h-4 border border-slate-300 rounded-sm bg-transparent checked:bg-[#005691] checked:border-[#005691] focus:outline-none focus:ring-2 focus:ring-[#005691] focus:ring-offset-1 transition-all cursor-pointer required">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                  </div>
                  <span class="font-inter text-[11px] text-slate-500 leading-relaxed font-light">
                    He leído y acepto la
                    <a routerLink="/privacidad" target="_blank" class="text-[#005691] font-medium hover:underline underline-offset-2">Política de Privacidad</a>
                    y los
                    <a routerLink="/terminos" target="_blank" class="text-[#005691] font-medium hover:underline underline-offset-2">Términos y Condiciones</a>
                    para el tratamiento de mis datos de contacto. *
                  </span>
                </label>
              </div>

              <!-- Botón Submit -->
              <div class="flex items-center justify-between border-t border-slate-100 pt-8 mt-4">
                <span class="hidden md:flex items-center gap-2 font-inter text-xs text-slate-400 font-light">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Conexión segura
                </span>
                <button type="submit" class="w-full md:w-auto bg-[#005691] text-white px-10 py-4 rounded-sm text-[13px] font-jakarta font-bold uppercase tracking-[0.1em] hover:bg-[#1E3E62] transition-colors flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#005691] focus:ring-offset-2">
                  Enviar Requerimiento
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @keyframes fadeInDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-down {
      animation: fadeInDown 0.2s ease-out forwards;
    }
  `]
})
export class Contact implements AfterViewInit {
  @ViewChildren('revealElement') revealElements!: QueryList<ElementRef>;

  isDropdownOpen = signal(false);
  selectedService = signal<string>('');

  services = [
    { id: 'drywall', name: 'Drywall y Aislamiento' },
    { id: 'acabados', name: 'Acabados y Pintura Premium' },
    { id: 'hidrosanitarias', name: 'Redes Hidrosanitarias' },
    { id: 'electricas', name: 'Instalaciones Eléctricas' },
    { id: 'remodelacion', name: 'Remodelación Integral' },
    { id: 'otro', name: 'Múltiples / Proyecto Completo' }
  ];

  toggleDropdown() {
    this.isDropdownOpen.update(val => !val);
  }

  closeDropdown() {
    this.isDropdownOpen.set(false);
  }

  selectService(id: string) {
    this.selectedService.set(id);
    this.closeDropdown();
  }

  getSelectedServiceName() {
    return this.services.find(s => s.id === this.selectedService())?.name || '';
  }

  ngAfterViewInit() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('opacity-0', 'translate-y-8', 'translate-y-12');
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    setTimeout(() => {
      this.revealElements.forEach(el => observer.observe(el.nativeElement));
    }, 50);
  }
}
