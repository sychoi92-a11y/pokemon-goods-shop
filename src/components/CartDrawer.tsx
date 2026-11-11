import React from 'react'
import type { CartItem } from '../types'
import { formatPrice } from '../utils/pokemon'
import { X, Trash2, ShoppingBag, ArrowRight, Minus, Plus, Truck } from 'lucide-react'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onUpdateQuantity: (productId: string, delta: number) => void
  onRemoveItem: (productId: string) => void
  onProceedToCheckout: () => void
}

const FREE_SHIPPING_THRESHOLD = 50000
const STANDARD_SHIPPING_FEE = 3000

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE
  const total = subtotal + shippingFee
  const freeShippingRemain = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-extrabold text-slate-900">장바구니</h2>
              <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                {items.reduce((sum, item) => sum + item.quantity, 0)}개
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          {items.length > 0 && (
            <div className="bg-amber-50/70 border-b border-amber-100 px-5 py-3">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="flex items-center gap-1.5 text-amber-900">
                  <Truck className="w-4 h-4 text-amber-600" />
                  {isFreeShipping ? (
                    <strong className="text-emerald-700">🎉 무료배송 혜택 적용 완료!</strong>
                  ) : (
                    <span>
                      <strong className="text-amber-800">{formatPrice(freeShippingRemain)}</strong> 더 담으면{' '}
                      <strong>무료배송!</strong>
                    </span>
                  )}
                </span>
                <span className="text-amber-700 font-bold">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                  alt="Empty Cart Pikachu"
                  className="w-32 h-32 object-contain opacity-50 mb-4 grayscale"
                />
                <p className="text-base font-bold text-slate-700 mb-1">장바구니가 비어 있습니다</p>
                <p className="text-xs text-slate-400 mb-6">마음에 드는 귀여운 포켓몬 굿즈를 담아보세요!</p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-red-600 text-white font-bold text-xs shadow-md shadow-red-500/20 hover:bg-red-700 transition-all"
                >
                  굿즈 구경하러 가기
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-3.5 items-center">
                  {/* Thumbnail */}
                  <div className="w-18 h-18 rounded-xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center shrink-0">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate mb-1">
                      {item.product.name}
                    </h4>
                    <div className="text-xs font-black text-slate-900 mb-2">
                      {formatPrice(item.product.price)}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 text-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-6 h-6 flex items-center justify-center hover:bg-slate-200 text-slate-600 disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs font-extrabold text-slate-700">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>총 상품금액</span>
                  <span className="font-semibold text-slate-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span className={shippingFee === 0 ? 'text-emerald-600 font-bold' : 'font-semibold text-slate-800'}>
                    {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>최종 결제금액</span>
                  <span className="text-red-600 text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 active:scale-98 transition-all"
              >
                <span>{formatPrice(total)} 주문하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
