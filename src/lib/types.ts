export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categoryId: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Cart {
  _id?: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  updatedAt: Date;
}

export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: ShippingAddress;
  awb_code?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  author?: string;
  image?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
