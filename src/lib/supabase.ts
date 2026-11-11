import { createClient } from '@supabase/supabase-js'
import type { Category, Product, Order } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zfhziuefybjyiqqbmmva.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaHppdWVmeWJqeWlxcWJtbXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQzNzU2OTEsImV4cCI6MjEwOTk1MTY5MX0._4TGzELGyPoz8TIKOvjwzTDzc1NObfZnQidCpbG-vGg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Category Helper API
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories from Supabase:', error)
    return []
  }
  return data || []
}

// Product Helper API
export async function getProducts(options?: {
  categoryId?: string | null
  pokemonType?: string | null
  searchQuery?: string | null
  sortBy?: string
}): Promise<Product[]> {
  let query = supabase.from('products').select('*')

  if (options?.categoryId && options.categoryId !== 'all') {
    query = query.eq('category_id', options.categoryId)
  }

  if (options?.pokemonType && options.pokemonType !== 'all') {
    query = query.eq('pokemon_type', options.pokemonType)
  }

  if (options?.searchQuery && options.searchQuery.trim() !== '') {
    const q = options.searchQuery.trim()
    query = query.or(`name.ilike.%${q}%,pokemon_name.ilike.%${q}%,name_en.ilike.%${q}%`)
  }

  // Sorting
  switch (options?.sortBy) {
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'rating':
      query = query.order('rating', { ascending: false })
      break
    case 'popular':
      query = query.order('review_count', { ascending: false })
      break
    case 'latest':
      query = query.order('created_at', { ascending: false })
      break
    case 'featured':
    default:
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false })
      break
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products from Supabase:', error)
    return []
  }
  return data || []
}

// Create Order API
export async function createOrder(orderData: Omit<Order, 'id' | 'created_at'>): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .insert([orderData])
    .select()
    .single()

  if (error) {
    console.error('Error creating order in Supabase:', error)
    throw error
  }
  return data
}

// Query Order API (by phone or order_number)
export async function lookupOrders(query: string): Promise<Order[]> {
  const cleanQuery = query.trim()
  if (!cleanQuery) return []

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .or(`order_number.ilike.%${cleanQuery}%,customer_phone.ilike.%${cleanQuery}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error looking up order in Supabase:', error)
    return []
  }
  return data || []
}

// Admin: Update order status
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order status in Supabase:', error)
    return false
  }
  return true
}

// Admin: Add new product
export async function addProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single()

  if (error) {
    console.error('Error adding product in Supabase:', error)
    throw error
  }
  return data
}

// Admin: Delete product
export async function deleteProduct(productId: string): Promise<boolean> {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)

  if (error) {
    console.error('Error deleting product in Supabase:', error)
    return false
  }
  return true
}
