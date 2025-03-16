export interface Product {
  id: number
  business_id: number
  category_id: number
  name: string
  description?: string
  price: number
  sku?: string
  stock_quantity: number
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  sku?: string
  price: number
  stock_quantity: number
  attributes?: Record<string, string>
} 