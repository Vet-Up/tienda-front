
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-c-paginator',
  imports: [CommonModule],
  templateUrl: './c-paginator.html',
  styleUrl: './c-paginator.scss',
})
export class CPaginator {
  @Input() page: number = 1;
  @Input() pageSize: number = 20;
  @Input() totalElements: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.page) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.pageChange.emit(page);
    }
  }

  // Para trackBy en @for
  trackByPage(index: number, item: number | string) {
    return typeof item === 'number' ? `page-${item}` : `dots-${index}`;
  }

  /**
   * Devuelve un array con los números de página y '...' para mostrar en la paginación
   */
  get pages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.page;
    const delta = 1; // cuántos a la izquierda/derecha del actual
    const pages: (number | string)[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Siempre mostrar la primera página
    pages.push(1);

    // Mostrar puntos suspensivos si hay salto entre la primera y el bloque de la izquierda
    if (current - delta > 2) {
      pages.push('...');
    }

    // Mostrar el bloque central
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      pages.push(i);
    }

    // Mostrar puntos suspensivos si hay salto entre el bloque de la derecha y la última
    if (current + delta < total - 1) {
      pages.push('...');
    }

    // Siempre mostrar la última página
    pages.push(total);

    return pages;
  }
}
