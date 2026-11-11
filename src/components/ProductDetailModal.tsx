import React, { useState } from 'react'
import type { Product } from '../types'
import { formatPrice, calculateDiscount, TYPE_COLORS } from '../utils/pokemon'
import { X, Star, ShoppingBag, ShieldCheck, Truck, RefreshCw, Zap, Minus, Plus } from 'lucide-react'

interface ProductDetailModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product, quantity: number) => void
  onDirectBuy: (product: Product, quantity: number) => void
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectBuy,
}) => {
  const [quantity, setQuantity] = useState<number>(1)

  if (!product) return null

  const discount = calculateDiscount(product.original_price, product.price)
  const typeStyle = TYPE_COLORS[product.pokemon_type] || {
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
  }

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const handleIncrease = () => {
    if (quantity < product.stock) setQuantity(quantity + 1)
  }

  const isOutOfStock = product.stock <= 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Product Image */}
          <div className="flex flex-col items-center justify-center bg-radial from-slate-50 to-slate-100 rounded-2xl p-6 relative border border-slate-100">
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-md">
                {product.badge}
              </span>
            )}
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full max-h-72 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.currentTarget
                target.onerror = null
                target.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'
              }}
            />
            <div className="mt-4 flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
              >
                {product.pokemon_type} 속성
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {product.pokemon_name} Official
              </span>
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                  포켓몬 오피셜 굿즈
                </span>
                {product.name_en && (
                  <span className="text-xs text-slate-400 font-mono">
                    {product.name_en}
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                {product.name}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold ml-1 text-slate-800 text-sm">
                    {product.rating}
                  </span>
                </div>
                <span>•</span>
                <span>리뷰 {product.review_count}개</span>
                <span>•</span>
                <span className={product.stock > 0 ? 'text-emerald-600 font-semibold' : 'text-red-500 font-semibold'}>
                  {product.stock > 0 ? `재고: ${product.stock}개 남음` : '현재 품절'}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {product.original_price && product.original_price > product.price && (
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                    <span className="line-through">{formatPrice(product.original_price)}</span>
                    <span className="text-rose-600 font-bold">{discount}% 할인</span>
                  </div>
                )}
                <div className="text-3xl font-black text-slate-900">
                  {formatPrice(product.price)}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6 bg-slate-50 p-4 rounded-xl text-xs sm:text-sm text-slate-600 leading-relaxed border border-slate-100">
                {product.description}
              </div>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-6">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>The Pokémon Company 정품</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span>5만원 이상 무료 배송</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>오후 3시 이전 당일 출고</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4 text-purple-600" />
                  <span>7일 이내 안심 반품/교환</span>
                </div>
              </div>
            </div>

            {/* Quantity & Buy Buttons */}
            <div>
              {/* Quantity Controller */}
              <div className="flex items-center justify-between mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700">구매 수량</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleDecrease}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-extrabold text-sm w-6 text-center text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-sm font-black text-slate-900">
                  {formatPrice(product.price * quantity)}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={isOutOfStock}
                  onClick={() => {
                    onAddToCart(product, quantity)
                    onClose()
                  }}
                  className="py-3 px-4 rounded-xl border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  장바구니 담기
                </button>
                <button
                  disabled={isOutOfStock}
                  onClick={() => {
                    onDirectBuy(product, quantity)
                    onClose()
                  }}
                  className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-md shadow-red-500/20 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  바로 구매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
