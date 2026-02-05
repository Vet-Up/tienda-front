import { Component, Input, SimpleChanges, OnInit } from '@angular/core';
import { CreateReviewDto, IReview } from '../../../core/models/i-review';
import { ReviewService } from '../../../core/services/review-service';
import { AuthService } from '../../../core/services/auth-service';
import { OrderService } from '../../../core/services/order-service';
import { IPage } from '../../../core/models/i-page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-c-product-review',
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './c-product-review.html',
  styleUrls: ['./c-product-review.scss'],
})
export class CProductReview implements OnInit {
  @Input() productId!: number;

  reviews: IReview[] = [];
  reviewsPage = 1;
  reviewsPageSize = 4;
  reviewsTotalElements = 0;
  reviewsTotalPages = 0;

  userReview: IReview | null = null;
  userId: number | null = null;
  hasPurchased = false;

  newComment = '';
  newRating = 1;

  isModalOpen = false;

  constructor(
    private reviewService: ReviewService,
    private authService: AuthService,
    private orderService: OrderService,
  ) {
    this.userId = this.authService.getUser()?.id ?? null;
  }

  ngOnInit(): void {
    if (this.productId) {
      this.checkIfUserHasPurchased();
      this.loadReviews();
      this.loadUserReview();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && this.productId) {
      this.checkIfUserHasPurchased();
      this.loadReviews();
      this.loadUserReview();
    }
  }


  private loadReviews() {
    this.reviewService
      .getReviewsByProductId(this.productId, this.reviewsPage, this.reviewsPageSize)
      .subscribe((page: IPage<IReview>) => {
        this.reviews = page.data;
        this.reviewsTotalPages = page.totalPages;
        this.reviewsTotalElements = page.totalElements;
      });
  }

  nextReviewsPage() {
    if (this.reviewsPage < this.reviewsTotalPages) {
      this.reviewsPage++;
      this.loadReviews();
    }
  }

  prevReviewsPage() {
    if (this.reviewsPage > 1) {
      this.reviewsPage--;
      this.loadReviews();
    }
  }

  private loadUserReview() {
    if (!this.userId) return;

    this.reviewService.getReviewsByUserIdAndProductId(this.userId, this.productId).subscribe({
      next: (review) => {
        if (review) {
          this.userReview = review;
          this.newComment = review.comment;
          this.newRating = review.rating;
        } else {
          this.userReview = null;
          this.newComment = '';
          this.newRating = 1;
        }
      },
      error: () => {
        this.userReview = null;
        this.newComment = '';
        this.newRating = 1;
      },
    });
  }

  openModal() {
  if (!this.userReview) {
    this.newRating = 1;     
    this.newComment = '';
  }
  this.isModalOpen = true;
}

  closeModal() {
    this.isModalOpen = false;
  }

  saveReview() {
    if (!this.userId) return;

    if (this.userReview) {
      const updatedReview: IReview = {
        ...this.userReview,
        comment: this.newComment,
        rating: this.newRating,
      };

      this.reviewService.updateReview(this.userReview.reviewId, updatedReview).subscribe(() => {
        this.loadReviews();
        this.loadUserReview();
        this.closeModal();
      });

      return;
    }

    const review: CreateReviewDto = {
      productId: this.productId,
      userId: this.userId,
      comment: this.newComment,
      rating: this.newRating,
    };

    this.reviewService.createReview(review).subscribe({
      next: () => {
        this.loadReviews();
        this.loadUserReview();
        this.closeModal();
      },
      error: (err) => {
        alert(err.error?.error || 'No se pudo crear la reseña.');
      },
    });
  }

  deleteReview() {
    if (!this.userReview) return;

    this.reviewService.deleteReview(this.userReview.reviewId).subscribe(() => {
      this.userReview = null;
      this.newComment = '';
      this.newRating = 5;
      this.loadReviews();
      this.closeModal();
    });
  }

  private checkIfUserHasPurchased() {
    if (!this.userId) {
      this.hasPurchased = false;
      return;
    }

    this.orderService.hasUserPurchasedProduct(this.userId, this.productId).subscribe({
      next: (purchased) => {
        this.hasPurchased = purchased;
      },
      error: () => {
        this.hasPurchased = false;
      },
    });
  }
}
