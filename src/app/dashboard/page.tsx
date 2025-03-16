'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/store'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { dashboardApi } from '@/lib/api/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const {
    recentOrders,
    recentProducts,
    lowStockProducts,
    totalSales,
    orderCount,
    isLoading,
    error,
    setRecentOrders,
    setRecentProducts,
    setLowStockProducts,
    setTotalSales,
    setOrderCount,
    setLoading,
    setError,
  } = useDashboardStore()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.business?.id) return
      
      setLoading(true)
      setError(null)
      
      try {
        const [recentOrders, products, lowStock, allOrders] = await Promise.all([
          dashboardApi.getRecentOrders(user.business.id),
          dashboardApi.getRecentProducts(user.business.id),
          dashboardApi.getLowStockProducts(user.business.id),
          dashboardApi.getAllOrders(user.business.id),
        ])

        // Calculate stats from all orders
        const total = allOrders.reduce((sum, order) => sum + Number(order.total_amount), 0)
        const count = allOrders.length

        setRecentOrders(recentOrders)
        setRecentProducts(products)
        setLowStockProducts(lowStock)
        setTotalSales(total)
        setOrderCount(count)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user?.business?.id, setRecentOrders, setRecentProducts, setLowStockProducts, setTotalSales, setOrderCount, setLoading, setError])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Welcome Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl">Hoş geldin, {user?.name} {user?.surname}!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Kullanıcı Bilgileri</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Email: {user?.email}</p>
                {user?.phone && <p>Telefon: {user?.phone}</p>}
                <p>Rol: {user?.role}</p>
              </div>
            </div>
            {user?.business && (
              <div>
                <h3 className="font-medium mb-2">İşletme Bilgileri</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>İşletme Adı: {user.business.name}</p>
                  <p>Instagram: {user.business.instagram_username}</p>
                  <p>Adres: {user.business.address}</p>
                  <p>Vergi No: {user.business.tax_number}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Toplam Satış</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalSales)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-24" /> : orderCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Son Siparişler</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Sipariş #{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.order_date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                    <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Son Eklenen Ürünler</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(product.price)}</p>
                      <p className="text-sm text-muted-foreground">Stok: {product.stock_quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <CardTitle>Düşük Stoklu Ürünler</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-red-500">Stok: {product.stock_quantity}</p>
                      <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 