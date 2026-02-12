import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, forkJoin, of } from 'rxjs';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';
import { ArticleService } from '../../../core/services/article-service';
import { ReviewService } from '../../../core/services/review-service';
import { AuthService } from '../../../core/services/auth-service';
import { CategoryService } from '../../../core/services/category-service';
import { CartService } from '../../../core/services/cart-service';
import { IArticle } from '../../../core/models/i-article';
import { ICategory } from '../../../core/models/i-category';
import { CProductReview } from '../c-product-review/c-product-review';
import { ToastComponent } from '../../ui/toast/toast.component';

@Component({
  selector: 'app-c-product-info',
  templateUrl: './c-product-info.html',
  styleUrls: ['./c-product-info.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, CProductReview, ToastComponent],
})
export class CProductInfoComponent implements OnInit {
  product: IArticle | null = null;
  ratingStars: ('full' | 'half' | 'empty')[] = [];
  category: ICategory | null = null;
  showToast: boolean = false;
  toastMessage: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private reviewService: ReviewService,
    private authService: AuthService,
    private categoryService: CategoryService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          return this.articleService.getById(id);
        }),
      )
      .subscribe((product) => {
        this.product = product;
        this.ratingStars = this.buildStars(product.averageRating ?? 0);
        if (product?.categoryId) {
          this.categoryService.getById(product.categoryId).subscribe({
            next: (cat) => (this.category = cat),
            error: () => (this.category = null),
          });
        } else {
          this.category = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildStars(rating: number): ('full' | 'half' | 'empty')[] {
    const stars: ('full' | 'half' | 'empty')[] = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push('full');
      else if (rating >= i - 0.5) stars.push('half');
      else stars.push('empty');
    }

    return stars;
  }

  private showMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
  }

  addToCart() {
    if (!this.product) return;

    if (!this.authService.getUser()) {
      this.showMessage('Debes iniciar sesión para añadir productos al carrito');
      return;
    }

    this.cartService.addProduct(this.product.productId, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => this.showMessage('Error al añadir el producto al carrito'),
      });
  }
}
