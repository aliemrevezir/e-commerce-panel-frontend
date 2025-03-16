export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'cash'
export type PaymentStatus = 'pending' | 'completed' | 'failed'

export interface OrderItem {
  product_variant_id: number
  quantity: number
  unit_price: number
}

export interface Order {
  id: number
  client_id: number
  business_id: number
  status: OrderStatus
  total_amount: number
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  order_date: string
  items: OrderItem[]
}

export interface OrderSummary {
  id: number
  client_id: number
  business_id: number
  status: OrderStatus
  total_amount: number
  order_date: string
} 