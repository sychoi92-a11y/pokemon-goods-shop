export interface Category {
  id: string
  name: string
  icon: string
  display_order: number
}

export interface Product {
  id: string
  name: string
  name_en?: string
  category_id: string
  pokemon_name: string
  pokemon_type: string
  price: number
  original_price?: number
  image_url: string
  description: string
  stock: number
  rating: number
  review_count: number
  badge?: string
  is_featured: boolean
  created_at?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image_url: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_address: string
  note?: string
  total_amount: number
  status: '결제완료' | '배송준비중' | '배송중' | '배송완료' | '주문취소'
  items: OrderItem[]
  created_at: string
}

export type SortOption = 'featured' | 'popular' | 'latest' | 'price-asc' | 'price-desc' | 'rating'
