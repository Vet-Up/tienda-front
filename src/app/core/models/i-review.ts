export interface IReview {
    reviewId: number;
    productId: number;
    userId: number;
    userName?: string;
    rating: number;
    comment: string;
    createdAt: Date;
}

export type CreateReviewDto = Omit<IReview, 'reviewId' | 'createdAt'>;
