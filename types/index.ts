export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  postalCode: string
  prefecture: string
  phone: string
}

export interface ProductWithCategory {
  id: string
  name: string
  slug: string
  description: string
  price: number
  stock: number
  imageUrl?: string
  images?: string[]
  categoryId: string
  category: {
    id: string
    name: string
    slug: string
  }
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
