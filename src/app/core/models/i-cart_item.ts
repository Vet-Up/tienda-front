export interface IProduct {
    productId: number;
    name: string;
    productDescription: string;
    basePrice: number;
    discountedPrice: number;
    price: number | null;
    pictureProduct: string;
    brand: string;
    categoryId: number;
    discount?: number;
    stock?: number;
}

export interface ICartItem {
    id: number;
    quantity: number;
    product: IProduct;
    // internal UI state
    _pending?: boolean;
}