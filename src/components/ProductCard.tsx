import React from 'react'
import type { Product } from '../types'
import { formatPrice, calculateDiscount, TYPE_COLORS } from '../utils/pokemon'
import { Star, ShoppingBag, Eye } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
  onAddToCart: (product: Product, e: React.MouseEvent) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
}) => {
  const discount = calculateDiscount(product.original_price, product.price)
  const typeStyle = TYPE_COLORS[product.pokemon_type] || {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
  }

  const isLowStock = product.stock > 0 && product.stock <= 5
  const isOutOfStock = product.stock <= 0

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer poke-card-glow relative"
    >
      {/* Image Thumbnail Container */}
      <div className="relative aspect-square w-full bg-radial from-slate-50 to-slate-100/70 p-6 flex items-center justify-center overflow-hidden">
        {/* Badges Top Row */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.badge && (
            <span
              className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase shadow-xs ${
                product.badge === 'BEST'
                  ? 'bg-amber-500 text-slate-950'
                  : product.badge === 'NEW'
                  ? 'bg-blue-600 text-white'
                  : product.badge === 'HOT'
                  ? 'bg-red-600 text-white'
                  : 'bg-purple-600 text-white'
              }`}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-500 text-white shadow-xs">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Pokemon Type Badge Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
          >
            {product.pokemon_type}
          </span>
        </div>

        {/* Product Image */}
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-md"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget
            target.onerror = null
            target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
          }}
        />

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="bg-white/95 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> 상세보기
          </span>
        </div>

        {/* Stock status overlay if out of stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-red-600 text-white font-extrabold text-sm px-4 py-1.5 rounded-full shadow-lg">
              일시 품절
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Pokemon name tag */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span>{product.pokemon_name}</span>
            {isLowStock && (
              <span className="text-rose-500 font-bold text-[10px] animate-pulse">
                마감임박 {product.stock}개 남음!
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100">
          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold ml-0.5 text-slate-800">{product.rating}</span>
            </div>
            <span>({product.review_count})</span>
          </div>

          {/* Price & Cart Button */}
          <div className="flex items-center justify-between">
            <div>
              {product.original_price && product.original_price > product.price && (
                <div className="text-[11px] text-slate-400 line-through">
                  {formatPrice(product.original_price)}
                </div>
              )}
              <div className="text-base font-extrabold text-slate-900">
                {formatPrice(product.price)}
              </div>
            </div>

            <button
              disabled={isOutOfStock}
              onClick={(e) => onAddToCart(product, e)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-600 hover:text-white text-slate-700 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              title="장바구니 담기"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
