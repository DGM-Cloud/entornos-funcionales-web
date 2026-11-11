import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../interfaces/proyecto.interface';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  @Input({ required: true }) proyecto!: Proyecto;
  @Output() cardClick = new EventEmitter<Proyecto>();

  onClick() {
    this.cardClick.emit(this.proyecto);
  }
}
