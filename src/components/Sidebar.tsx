'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  Tags,
  Truck,
  RotateCcw,
  Gift,
  ChevronDown,
  LogOut,
  Menu,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useAuthStore } from "@/lib/store/store"
import { toast } from 'sonner'
import { useState } from "react"

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Kullanıcılar",
    href: "/users",
    icon: Users,
  },
  {
    title: "İşletmeler",
    href: "/businesses",
    icon: Store,
  },
]

const productNavItems = [
  {
    title: "Ürünler",
    href: "/products",
    icon: Package,
  },
  {
    title: "Kategoriler",
    href: "/categories",
    icon: Tags,
  },
]

const orderNavItems = [
  {
    title: "Siparişler",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Kargolar",
    href: "/cargos",
    icon: Truck,
  },
  {
    title: "İadeler",
    href: "/returns",
    icon: RotateCcw,
  },
  {
    title: "Promosyonlar",
    href: "/promotions",
    icon: Gift,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [isProductOpen, setIsProductOpen] = useState(false)
  const [isOrderOpen, setIsOrderOpen] = useState(false)

  const handleLogout = () => {
    logout()
    document.cookie = 'auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    toast.success('Başarıyla çıkış yapıldı')
    router.push('/auth/login')
    router.refresh()
  }

  if (!user) return null

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Admin Panel</h2>
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    pathname === item.href ? "bg-accent" : "transparent"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="px-3 py-2">
        <Collapsible
          open={isProductOpen}
          onOpenChange={setIsProductOpen}
          className="space-y-2"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            <div className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              <span>Ürün Yönetimi</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isProductOpen ? "rotate-180" : ""
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {productNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-accent" : "transparent"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </span>
                </Link>
              )
            })}
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={isOrderOpen}
          onOpenChange={setIsOrderOpen}
          className="space-y-2"
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            <div className="flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Sipariş Yönetimi</span>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOrderOpen ? "rotate-180" : ""
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1">
            {orderNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href ? "bg-accent" : "transparent"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </span>
                </Link>
              )
            })}
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="mt-auto px-3 py-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Çıkış Yap</span>
        </Button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden border-r bg-background lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="lg:hidden fixed left-4 top-4 z-40"
            size="icon"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
} 