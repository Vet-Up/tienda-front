export interface IArticle {
  productId: number;
  name: string;
  productDescription: string;
  basePrice: number; 
  discount: number; 
  price: number; 
  pictureProduct: string;
  brand: string;
  categoryId: number;
  badge: string;
  rating: number;
  opinions: number;
  freeShipping: boolean;
  stock: number;
  averageRating: number;
  reviewsCount: number;
}
