import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-[#0B121D] pt-20 pb-8 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-5 md:px-6">

        <!-- Grid Superior del Footer -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16 text-center md:text-left">
          <div class="md:col-span-12 lg:col-span-4 flex flex-col items-center md:items-start">
            <a routerLink="/" class="flex items-center justify-center md:justify-start cursor-pointer mb-8">
              <img src="assets/logo.webp"
                   alt="Entornos Funcionales"
                   width="200"
                   height="64"
                   decoding="async"
                   class="h-14 md:h-16 w-auto object-contain brightness-0 invert opacity-90 transition-opacity hover:opacity-100 duration-300" />
            </a>
            <p class="font-inter text-sm text-[#B8C3D2] font-light leading-relaxed max-w-sm mb-6 mx-auto md:mx-0">
              Firma especializada en ejecución de partidas arquitectónicas e instalaciones técnicas de alta complejidad para el sector corporativo e industrial.
            </p>
            <div class="inline-flex items-center justify-center gap-2 border border-slate-700/50 bg-[#101827] px-3 py-1.5 rounded-sm">
              <div class="w-1.5 h-1.5 rounded-full bg-[#5C968D]" aria-hidden="true"></div>
              <span class="font-inter text-[9px] text-slate-400 font-bold tracking-widest uppercase">Operaciones Activas</span>
            </div>
          </div>

          <div class="md:col-span-4 lg:col-span-2 lg:col-start-6 flex flex-col items-center md:items-start">
            <p class="font-inter text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Empresa</p>
            <nav class="flex flex-col items-center md:items-start gap-4" aria-label="Enlaces de empresa">
              <a routerLink="/" class="font-inter text-[13px] text-[#B8C3D2] hover:text-[#F5F6F8] transition-colors">Inicio</a>
              <a routerLink="/nosotros" class="font-inter text-[13px] text-[#B8C3D2] hover:text-[#F5F6F8] transition-colors">Nuestra Capacidad</a>
              <a routerLink="/proyectos" class="font-inter text-[13px] text-[#B8C3D2] hover:text-[#F5F6F8] transition-colors">Portafolio Técnico</a>
              <a routerLink="/contacto" class="font-inter text-[13px] text-[#B8C3D2] hover:text-[#F5F6F8] transition-colors">Validación y Contacto</a>
            </nav>
          </div>

          <div class="md:col-span-4 lg:col-span-2 flex flex-col items-center md:items-start">
            <p class="font-inter text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Especialidades</p>
            <nav class="flex flex-col items-center md:items-start gap-4" aria-label="Enlaces de especialidades">
              <a routerLink="/servicios" fragment="electricidad" class="font-inter text-[13px] text-[#B8C3D2] hover:text-[#F5F6F8] transition-colors">Electricidad Industrial</a>
              <a routerLink="/servicios" fragment="hidrosanitarias" class="font-inter text-[13px] text-[#B8C3D2] hover:text-[#F5F6F8] transition-colors">Redes Hidrosanitarias</a>
              <a routerLink="/servicios" fragment="acabados" class="font-inter text-[13px] text-[#B8C3D2] hover:text-[#F5F6F8] transition-colors">Acabados y Pintura</a>
              <a routerLink="/servicios" class="font-inter text-[13px] text-[#5C968D] hover:text-[#F5F6F8] transition-colors font-medium mt-2 inline-flex items-center justify-center md:justify-start gap-1 group">
                Ver todos los servicios
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="group-hover:translate-x-1 transition-transform" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </nav>
          </div>

          <div class="md:col-span-4 lg:col-span-3 flex flex-col items-center md:items-start">
            <p class="font-inter text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Oficina Técnica</p>
            <div class="flex flex-col items-center md:items-start gap-4 font-inter text-[13px] text-[#B8C3D2]">
              <p class="font-light leading-relaxed">Lima<br>Perú</p>
              <a href="mailto:cotizaciones@entornosfuncionales.com" class="hover:text-[#F5F6F8] transition-colors break-all">cotizaciones&#64;entornosfuncionales.com</a>
              <a href="tel:+51913460898" class="hover:text-[#F5F6F8] transition-colors">+51 913 460 898</a>
            </div>
          </div>
        </div>

        <!-- Copyright / Legal -->
        <div class="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4 text-center md:text-left">
          <p class="font-inter text-[11px] text-slate-400 font-light">
            &copy; {{ currentYear }} Entornos Funcionales. Todos los derechos reservados.
          </p>

          <div class="flex flex-col sm:flex-row flex-wrap justify-center md:justify-end items-center gap-5 sm:gap-6">
            <a routerLink="/libro-reclamaciones" class="flex flex-col items-center justify-center group">
              <img src="assets/libro-reclamaciones.png"
                   alt="Libro de Reclamaciones Oficial"
                   width="120"
                   height="44"
                   loading="lazy"
                   decoding="async"
                   class="h-10 md:h-11 w-auto object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-sm" />
            </a>
            <span class="text-slate-700 hidden md:inline" aria-hidden="true">|</span>
            <a routerLink="/terminos" class="font-inter text-[9px] uppercase tracking-widest text-slate-400 hover:text-[#F5F6F8] transition-colors font-bold">Términos y Condiciones</a>
            <a routerLink="/privacidad" class="font-inter text-[9px] uppercase tracking-widest text-slate-400 hover:text-[#F5F6F8] transition-colors font-bold">Privacidad</a>
          </div>
        </div>

      </div>
    </footer>
  `
})
export class Footer {
  currentYear = new Date().getFullYear();
}
