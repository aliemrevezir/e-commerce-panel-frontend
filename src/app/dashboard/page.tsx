'use client'

import { useAuthStore } from '@/lib/store/store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
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
    </div>
  )
} 