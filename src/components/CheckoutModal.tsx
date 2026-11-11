import React, { useState } from 'react'
import type { CartItem, Order } from '../types'
import { formatPrice } from '../utils/pokemon'
import { createOrder } from '../lib/supabase'
import confetti from 'canvas-confetti'
import { X, CheckCircle2, ShieldCheck, CreditCard, Sparkles, Loader2, Copy, Check } from 'lucide-react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onSuccess: () => void
}

const FREE_SHIPPING_THRESHOLD = 50000
const STANDARD_SHIPPING_FEE = 3000

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onSuccess,
}) => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('문 앞에 두고 벨 눌러주세요')
  const [paymentMethod, setPaymentMethod] = useState<'pokepay' | 'card' | 'kakaopay' | 'tosspay'>('pokepay')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  if (!isOpen) return null

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
  const total = subtotal + shippingFee

  const generateOrderNumber = () => {
    const date = new Date()
    const ymd = date.toISOString().slice(0, 10).replace(/-/g, '')
    const rand = Math.floor(1000 + Math.random() * 9000)
    return `ORD-${ymd}-${rand}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert('주문자 성함, 연락처, 배송지 주소를 모두 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)

      const orderNumber = generateOrderNumber()
      const orderPayload = {
        order_number: orderNumber,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_address: address.trim(),
        note: note.trim(),
        total_amount: total,
        status: '결제완료' as const,
        items: items.map((i) => ({
          product_id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image_url: i.product.image_url,
        })),
      }

      // Save order to Supabase
      const savedOrder = await createOrder(orderPayload)
      setCompletedOrder(savedOrder)

      // Fire confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
        })
      } catch (err) {
        console.error('Confetti error:', err)
      }

      onSuccess()
    } catch (err: unknown) {
      console.error('Checkout failed:', err)
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      alert(`주문 처리 중 오류가 발생했습니다: ${message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyOrderNumber = () => {
    if (completedOrder?.order_number) {
      navigator.clipboard.writeText(completedOrder.order_number)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black">
              P
            </span>
            <h2 className="text-base font-extrabold text-slate-900">
              {completedOrder ? '주문 완료' : '주문서 작성 & 결제'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6">
          {completedOrder ? (
            /* Order Success View */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
                  Supabase DB에 정상 저장됨
                </span>
                <h3 className="text-2xl font-black text-slate-900">포켓몬 굿즈 주문 성공!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  트레이너님의 소중한 포켓몬 굿즈를 안전하고 신속하게 배송해 드리겠습니다.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500 font-semibold">주문 번호</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{completedOrder.order_number}</span>
                    <button
                      onClick={handleCopyOrderNumber}
                      className="p-1 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"
                      title="주문번호 복사"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">주문자</span>
                  <span className="font-semibold text-slate-800">{completedOrder.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">연락처</span>
                  <span className="font-semibold text-slate-800">{completedOrder.customer_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">배송지</span>
                  <span className="font-semibold text-slate-800 max-w-[200px] truncate">{completedOrder.customer_address}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold">
                  <span className="text-slate-900">결제 완료 금액</span>
                  <span className="text-red-600">{formatPrice(completedOrder.total_amount)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-md shadow-red-500/20 transition-all"
                >
                  쇼핑 계속하기
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Ordered Items Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  주문 상품 ({items.reduce((s, i) => s + i.quantity, 0)}건)
                </label>
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 max-h-36 overflow-y-auto divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.product.id} className="py-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate mr-2">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-8 h-8 object-contain shrink-0 rounded bg-white p-0.5 border border-slate-200"
                        />
                        <span className="font-semibold text-slate-800 truncate">{item.product.name}</span>
                        <span className="text-slate-400 font-mono">x{item.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info Fields */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-900 tracking-wide uppercase">
                  배송지 정보
                </h3>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    주문자 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예: 한지우"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    휴대폰 번호 (주문조회 시 사용) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="예: 010-1234-5678"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    배송지 주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="예: 태초마을 25번지 오박사 연구소 앞"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    배송 요청사항
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="배송 기사님께 남길 메모"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-900 tracking-wide uppercase">
                  결제 수단 선택
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pokepay')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'pokepay'
                        ? 'border-red-500 bg-red-50 text-red-700 shadow-xs ring-1 ring-red-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    ⚡ PokéPay (간편결제)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-red-500 bg-red-50 text-red-700 shadow-xs ring-1 ring-red-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-500" />
                    신용/체크카드
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('kakaopay')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'kakaopay'
                        ? 'border-yellow-500 bg-yellow-50 text-yellow-900 shadow-xs ring-1 ring-yellow-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    🟡 카카오페이
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tosspay')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'tosspay'
                        ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    🔵 토스페이
                  </button>
                </div>
              </div>

              {/* Total & Submit */}
              <div className="pt-2 border-t border-slate-200 space-y-3">
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>주문 상품 합계</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>배송비</span>
                    <span>{shippingFee === 0 ? '무료배송' : formatPrice(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                    <span>최종 결제 금액</span>
                    <span className="text-red-600">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Supabase Database 안전 결제 보호 시스템 가동 중</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 active:scale-98 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Supabase 주문 처리 중...</span>
                    </>
                  ) : (
                    <span>{formatPrice(total)} 결제하기</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
