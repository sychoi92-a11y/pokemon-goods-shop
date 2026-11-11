import React from 'react'
import { ShoppingBag, Search, PackageCheck, Database, Sparkles } from 'lucide-react'

interface NavbarProps {
  cartCount: number
  searchQuery: string
  onSearchChange: (q: string) => void
  onOpenCart: () => void
  onOpenOrderLookup: () => void
  onOpenAdmin: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenOrderLookup,
  onOpenAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse shrink-0" />
            <span className="truncate">
              ⚡ <strong>POKÉMON STORE x SUPABASE</strong> | 50,000원 이상 결제 시 무료배송 & 홀로그램 씰 증정!
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] opacity-90">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Supabase MCP 실시간 연동 중
            </span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-b from-red-500 via-red-500 to-white border-2 border-slate-800 flex items-center justify-center relative shadow-md group-hover:rotate-180 transition-transform duration-500">
              <div className="w-full h-1 bg-slate-800 absolute top-1/2 -translate-y-1/2"></div>
              <div className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-800 relative z-10 flex items-center justify-center shadow-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
              </div>
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1">
                <span className="text-red-600">POKÉMON</span> GOODS
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">
                Official Merch Store
              </p>
            </div>
          </a>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="포켓몬 이름, 굿즈 검색 (예: 피카츄, 잠만보, 피규어)..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-red-400 rounded-full transition-all outline-hidden text-slate-800 placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Order Lookup Button */}
            <button
              onClick={onOpenOrderLookup}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="주문 내역 조회"
            >
              <PackageCheck className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">주문 조회</span>
            </button>

            {/* Supabase Admin Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-lg transition-colors"
              title="Supabase 실시간 데이터베이스 관리"
            >
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">DB 관리</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-full shadow-md shadow-red-500/20 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold hidden xs:inline">장바구니</span>
              {cartCount > 0 && (
                <span className="bg-yellow-400 text-slate-900 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center -mr-1 shadow-xs animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-2.5 md:hidden relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="포켓몬 이름, 굿즈 검색..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-transparent focus:border-red-400 rounded-full outline-hidden"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>
    </header>
  )
}
