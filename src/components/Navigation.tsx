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
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/lib/store/store"
import { toast } from 'sonner'

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

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    // Clear the cookie manually as well
    document.cookie = 'auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    toast.success('Başarıyla çıkış yapıldı')
    router.push('/auth/login')
    router.refresh()
  }

  if (!user) return null
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center space-x-4 lg:space-x-6 flex-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon size={16} />
                <span>{item.title}</span>
              </Link>
            )
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith("/product") || pathname.startsWith("/categor")
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Package size={16} />
                <span>Ürün Yönetimi</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {productNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2"
                    >
                      <Icon size={16} />
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith("/order") ||
                  pathname.startsWith("/cargo") ||
                  pathname.startsWith("/return") ||
                  pathname.startsWith("/promotion")
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <ShoppingCart size={16} />
                <span>Sipariş Yönetimi</span>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {orderNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-2"
                    >
                      <Icon size={16} />
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex-1" />
          
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
          >
            <LogOut size={16} />
            <span>Çıkış Yap</span>
          </Button>
        </div>
      </div>
    </nav>
  )
} 