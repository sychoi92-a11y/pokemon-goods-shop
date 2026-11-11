import React, { useState, useEffect, useMemo, useCallback } from 'react'
import type { Product, Category, CartItem, SortOption } from './types'
import { getCategories, getProducts } from './lib/supabase'
import { Navbar } from './components/Navbar'
import { HeroBanner } from './components/HeroBanner'
import { CategoryFilter } from './components/CategoryFilter'
import { ProductCard } from './components/ProductCard'
import { ProductDetailModal } from './components/ProductDetailModal'
import { CartDrawer } from './components/CartDrawer'
import { CheckoutModal } from './components/CheckoutModal'
import { OrderLookupModal } from './components/OrderLookupModal'
import { AdminModal } from './components/AdminModal'
import { Footer } from './components/Footer'
import { Loader2, PackageOpen, Sparkles } from 'lucide-react'

export const App: React.FC = () => {
  // Data State
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortBy, setSortBy] = useState<SortOption>('featured')

  // Cart State (Persisted in localStorage)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('poke_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false)
  const [isOrderLookupOpen, setIsOrderLookupOpen] = useState<boolean>(false)
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false)

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('poke_cart', JSON.stringify(cart))
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e)
    }
  }, [cart])

  // Initial Load: Categories
  useEffect(() => {
    async function initCategories() {
      const cats = await getCategories()
      setCategories(cats)
    }
    initCategories()
  }, [])

  // Load Products whenever filters change
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getProducts({
        categoryId: selectedCategory,
        pokemonType: selectedType,
        searchQuery: searchQuery,
        sortBy: sortBy,
      })
      setProducts(data)
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, selectedType, searchQuery, sortBy])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Cart Handlers
  const handleAddToCart = (product: Product, quantityOrEvent?: number | React.MouseEvent) => {
    const qty = typeof quantityOrEvent === 'number' ? quantityOrEvent : 1

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id)
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + qty) }
            : item
        )
      } else {
        return [...prevCart, { product, quantity: qty }]
      }
    })
  }

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    })
  }

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const handleDirectBuy = (product: Product, quantity: number) => {
    handleAddToCart(product, quantity)
    setIsCheckoutOpen(true)
  }

  const handleCheckoutSuccess = () => {
    setCart([])
    fetchProducts() // Refresh inventory
  }

  const totalCartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        cartCount={totalCartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrderLookup={() => setIsOrderLookupOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanner />

        {/* Category & Type Filter Bar */}
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedType={selectedType}
          onSelectType={setSelectedType}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          totalCount={products.length}
        />

        {/* Product Grid Area */}
        <section className="container mx-auto px-4">
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-3" />
              <p className="text-sm font-bold text-slate-700">Supabase에서 포켓몬 굿즈를 불러오는 중...</p>
              <p className="text-xs text-slate-400 mt-1">포켓몬 센터 데이터베이스 실시간 연동</p>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs max-w-lg mx-auto my-8">
              <PackageOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">조건에 맞는 포켓몬 굿즈가 없습니다</h3>
              <p className="text-xs text-slate-500 mb-4">
                검색어를 바꾸거나 다른 속성/카테고리를 선택해보세요.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedType('all')
                  setSearchQuery('')
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                필터 전체 초기화
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </section>

        {/* Bottom Feature Promotion Strip */}
        <section className="container mx-auto px-4 mt-16">
          <div className="bg-radial from-red-600 to-rose-700 text-white rounded-3xl p-6 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                POKÉMON CENTER OFFICIAL
              </div>
              <h3 className="text-2xl sm:text-3xl font-black">
                모든 굿즈 100% 공식 정품 인증 보증
              </h3>
              <p className="text-xs sm:text-sm text-red-100 max-w-xl">
                The Pokémon Company 공식 정품 홀로그램 씰이 부착되어 있으며, 파손 방지 특수 완충 포장으로 안전하게 발송됩니다.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('limited')
                window.scrollTo({ top: 400, behavior: 'smooth' })
              }}
              className="px-6 py-3 rounded-full bg-white text-red-600 font-extrabold text-xs shadow-lg hover:bg-yellow-400 hover:text-slate-900 transition-all shrink-0"
            >
              한정판 컬렉션 보기 ✨
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Slide-overs */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectBuy={handleDirectBuy}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        onSuccess={handleCheckoutSuccess}
      />

      <OrderLookupModal
        isOpen={isOrderLookupOpen}
        onClose={() => setIsOrderLookupOpen(false)}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        categories={categories}
        onProductAdded={fetchProducts}
      />
    </div>
  )
}

export default App
