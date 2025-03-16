import { OrderSummary } from '../types/order'
import { Product } from '../types/product'
import { apiClient } from './apiClient'

interface ApiResponse<T> {
  data: T
  message?: string
}

export const dashboardApi = {
  async getRecentOrders(businessId: number): Promise<OrderSummary[]> {
    const response = await apiClient.get<ApiResponse<OrderSummary[]>>(`/orders?business_id=${businessId}&limit=5`)
    return response.data
  },

  async getRecentProducts(businessId: number): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products?business_id=${businessId}&limit=5`)
    return response.data
  },

  async getLowStockProducts(businessId: number): Promise<Product[]> {
    const response = await apiClient.get<ApiResponse<Product[]>>(`/products?business_id=${businessId}&stock_quantity_min=10&limit=5`)
    return response.data
  }
} 