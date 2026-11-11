import { Component, Input, signal, ElementRef, ViewChild, HostListener } from '@angular/core';
import { cloudinarySized, cloudinarySrcset } from '../../utils/cloudinary';

const FALLBACK_DESPUES =
  'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793318606/Entrada_moderna_con_p%C3%A9rgola_y_flores.png';
const FALLBACK_ANTES =
  'https://res.cloudinary.com/w775d4fq/image/upload/f_auto,q_auto/v1793320487/Pabell%C3%B3n_moderno_en_construcci%C3%B3n.png';
const SLIDER_WIDTHS = [640, 960, 1280] as const;

@Component({
  selector: 'app-before-after-slider',
  standalone: true,
  template: `
    <!-- Contenedor dinámico que acepta una proporción flexible mediante [aspectRatio] -->
    <div
      [class]="
        'relative w-full max-w-5xl mx-auto bg-slate-100 rounded-lg overflow-hidden shadow-2xl cursor-ew-resize ' +
        aspectRatio
      "
      #sliderContainer
      (mousedown)="startSliding($event)"
      (touchstart)="startSliding($event)"
    >
      <!-- Imagen 'Después' -->
      <img
        [src]="imgDespuesSrc"
        [attr.srcset]="imgDespuesSrcset"
        sizes="(min-width: 768px) 90vw, 100vw"
        width="1280"
        height="800"
        loading="lazy"
        decoding="async"
        alt="Acabado Final"
        [class]="
          'absolute inset-0 w-full h-full object-cover select-none pointer-events-none ' +
          imagePosition
        "
      />

      <!-- Badge 'Acabado Final' -->
      <div
        class="absolute top-6 right-6 bg-[#0B192C] text-white text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-sm font-jakarta z-0 shadow-md"
      >
        Acabado Final
      </div>

      <!-- Imagen 'Antes' -->
      <div
        class="absolute inset-0 z-10 select-none pointer-events-none"
        [style.clip-path]="'inset(0 ' + (100 - sliderPosition()) + '% 0 0)'"
      >
        <img
          [src]="imgAntesSrc"
          [attr.srcset]="imgAntesSrcset"
          sizes="(min-width: 768px) 90vw, 100vw"
          width="1280"
          height="800"
          loading="lazy"
          decoding="async"
          alt="Estado Inicial"
          [class]="
            'absolute inset-0 w-full h-full object-cover grayscale brightness-90 ' + imagePosition
          "
        />

        <!-- Badge 'Estado Inicial' -->
        <div
          class="absolute top-6 left-6 bg-white text-[#0B192C] text-xs font-bold px-4 py-2 uppercase tracking-wider rounded-sm font-jakarta shadow-md"
        >
          Estado Inicial
        </div>
      </div>

      <!-- Línea Separadora y Botón Deslizador -->
      <div
        class="absolute top-0 bottom-0 z-25 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.3)]"
        [style.left.%]="sliderPosition()"
      >
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-200 text-[#005691]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m15 18 6-6-6-6" />
            <path d="M9 18 3 12l6-6" />
          </svg>
        </div>
      </div>
    </div>
  `,
})
export class BeforeAfterSlider {
  sliderPosition = signal(50);
  isSliding = false;

  @Input() beforeImage: string | undefined = '';
  @Input() afterImage: string | undefined = '';
  @Input() imagePosition: string = 'object-bottom';

  // Nuevo Input para definir la proporción de altura (por defecto apaisado, pero adaptable)
  @Input() aspectRatio: string = 'aspect-[16/9] md:aspect-[16/10]';

  @ViewChild('sliderContainer') container!: ElementRef<HTMLDivElement>;

  get imgDespuesSrc(): string {
    const url = this.afterImage || FALLBACK_DESPUES;
    return cloudinarySized(url, 960);
  }

  get imgDespuesSrcset(): string {
    const url = this.afterImage || FALLBACK_DESPUES;
    return cloudinarySrcset(url, SLIDER_WIDTHS);
  }

  get imgAntesSrc(): string {
    const url = this.beforeImage || FALLBACK_ANTES;
    return cloudinarySized(url, 960);
  }

  get imgAntesSrcset(): string {
    const url = this.beforeImage || FALLBACK_ANTES;
    return cloudinarySrcset(url, SLIDER_WIDTHS);
  }

  startSliding(event: MouseEvent | TouchEvent) {
    this.isSliding = true;
    this.updatePosition(event);
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  stopSliding() {
    this.isSliding = false;
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onMove(event: MouseEvent | TouchEvent) {
    if (!this.isSliding) return;
    this.updatePosition(event);
  }

  private updatePosition(event: MouseEvent | TouchEvent) {
    if (!this.container) return;

    const rect = this.container.nativeElement.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;

    let position = ((clientX - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(100, position));
    this.sliderPosition.set(position);
  }
}
