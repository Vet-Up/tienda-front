import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoryService } from '../../../core/services/category-service';
import { ICategory } from '../../../core/models/i-category';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-c-filters-sidebar',
  imports: [CommonModule, AsyncPipe, FormsModule],
  templateUrl: './c-filters-sidebar.html',
  styleUrl: './c-filters-sidebar.scss',
})
export class CFiltersSidebar implements OnChanges {
  @Output() closeSidebar = new EventEmitter<void>();
  @Input() open = false;
  categoriesOpen = true;
  categories$: Observable<ICategory[]>;
  @Output() categoriesSelected = new EventEmitter<number[]>();
  @Input() selectedCategories: number[] = [];
  @Output() priceRangeSelected = new EventEmitter<{ min: number, max: number }>();
  @Input() priceRange: { min: number, max: number } = { min: 0, max: 60 };

  // Internos para ngModel
  internalSelectedCategories: number[] = [];
  internalPriceRange = { min: 0, max: 60 };

  constructor(private categoryService: CategoryService) {
    this.categories$ = this.categoryService.getAllCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedCategories']) {
      this.internalSelectedCategories = [...(this.selectedCategories || [])];
    }
    if (changes['priceRange']) {
      this.internalPriceRange = { ...this.priceRange };
    }
  }

  toggleCategories() {
    this.categoriesOpen = !this.categoriesOpen;
  }

  onCategoryChange(categoryId: number, checked: boolean) {
    if (checked) {
      if (!this.internalSelectedCategories.includes(categoryId)) {
        this.internalSelectedCategories.push(categoryId);
      }
    } else {
      this.internalSelectedCategories = this.internalSelectedCategories.filter(id => id !== categoryId);
    }
    this.categoriesSelected.emit([...this.internalSelectedCategories]);
  }

  onMinPriceChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    if (value > this.internalPriceRange.max) {
      this.internalPriceRange.min = this.internalPriceRange.max;
    } else {
      this.internalPriceRange.min = value;
    }
    this.priceRangeSelected.emit({ ...this.internalPriceRange });
  }

  onMaxPriceChange(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    if (value < this.internalPriceRange.min) {
      this.internalPriceRange.max = this.internalPriceRange.min;
    } else {
      this.internalPriceRange.max = value;
    }
    this.priceRangeSelected.emit({ ...this.internalPriceRange });
  }

  trackByCategoryId(index: number, cat: ICategory) {
    return cat.categoryId;
  }

  close() {
    this.closeSidebar.emit();
  }
}
