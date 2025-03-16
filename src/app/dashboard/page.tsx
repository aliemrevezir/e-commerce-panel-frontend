'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/store'
import { useDashboardStore } from '@/lib/store/dashboardStore'
import { dashboardApi } from '@/lib/api/dashboard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/lib/utils'
import { ArrowUpRight, Package2, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

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
    <div className="space-y-8">
      {/* Welcome Section */}
      <Card className="border-none shadow-none bg-gradient-to-r from-muted/50 to-muted/10">
        <CardHeader>
          <CardTitle className="text-3xl">Hoş geldin, {user?.name} {user?.surname}!</CardTitle>
          <CardDescription className="text-lg">İşletmenizin güncel durumuna göz atın</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="font-medium text-lg">Kullanıcı Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-muted-foreground">Telefon:</span>
                    <span className="font-medium">{user?.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-muted-foreground">Rol:</span>
                  <span className="font-medium capitalize">{user?.role}</span>
                </div>
              </div>
            </div>
            {user?.business && (
              <div className="space-y-4">
                <h3 className="font-medium text-lg">İşletme Bilgileri</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-muted-foreground">İşletme Adı:</span>
                    <span className="font-medium">{user.business.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-muted-foreground">Instagram:</span>
                    <span className="font-medium">{user.business.instagram_username}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-muted-foreground">Adres:</span>
                    <span className="font-medium">{user.business.address}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-muted-foreground">Vergi No:</span>
                    <span className="font-medium">{user.business.tax_number}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Satış
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-24" /> : formatCurrency(totalSales)}
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="relative overflow-hidden">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Toplam Sipariş
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {isLoading ? <Skeleton className="h-8 w-24" /> : orderCount}
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Son Siparişler</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
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
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">Sipariş #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.order_date).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                      <span className={cn(
                        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                        {
                          "bg-green-50 text-green-700": order.status === "delivered",
                          "bg-yellow-50 text-yellow-700": order.status === "pending",
                          "bg-blue-50 text-blue-700": order.status === "processing"
                        }
                      )}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-medium">Düşük Stoklu Ürünler</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
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
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {product.sku || 'N/A'}</p>
                    </div>
                    <div className="text-right space-y-1">
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