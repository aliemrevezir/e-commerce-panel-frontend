import { create } from 'zustand'
import { Order, OrderSummary } from '../types/order'
import { Product } from '../types/product'

interface DashboardStore {
  recentOrders: OrderSummary[]
  recentProducts: Product[]
  lowStockProducts: Product[]
  totalSales: number
  orderCount: number
  isLoading: boolean
  error: string | null
  
  // Actions
  setRecentOrders: (orders: OrderSummary[]) => void
  setRecentProducts: (products: Product[]) => void
  setLowStockProducts: (products: Product[]) => void
  setTotalSales: (amount: number) => void
  setOrderCount: (count: number) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  recentOrders: [],
  recentProducts: [],
  lowStockProducts: [],
  totalSales: 0,
  orderCount: 0,
  isLoading: false,
  error: null,

  // Actions
  setRecentOrders: (orders) => set({ recentOrders: orders }),
  setRecentProducts: (products) => set({ recentProducts: products }),
  setLowStockProducts: (products) => set({ lowStockProducts: products }),
  setTotalSales: (amount) => set({ totalSales: amount }),
  setOrderCount: (count) => set({ orderCount: count }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
})) 