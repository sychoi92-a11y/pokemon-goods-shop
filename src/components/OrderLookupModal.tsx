import React, { useState } from 'react'
import type { Order } from '../types'
import { lookupOrders } from '../lib/supabase'
import { formatPrice } from '../utils/pokemon'
import { X, Search, PackageCheck, Clock, CheckCircle2, Truck, AlertCircle, Loader2 } from 'lucide-react'

interface OrderLookupModalProps {
  isOpen: boolean
  onClose: () => void
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [orders, setOrders] = useState<Order[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!searchTerm.trim()) return

    try {
      setIsLoading(true)
      const results = await lookupOrders(searchTerm.trim())
      setOrders(results)
      setHasSearched(true)
    } catch (err) {
      console.error('Order search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case '결제완료':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', text: '결제완료' }
      case '배송준비중':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', text: '배송준비중' }
      case '배송중':
        return { bg: 'bg-purple-50 text-purple-700 border-purple-200', text: '배송중 (출발)' }
      case '배송완료':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: '배송완료' }
      default:
        return { bg: 'bg-slate-100 text-slate-700 border-slate-200', text: status }
    }
  }

  const getStepProgress = (status: Order['status']) => {
    switch (status) {
      case '결제완료':
        return 1
      case '배송준비중':
        return 2
      case '배송중':
        return 3
      case '배송완료':
        return 4
      default:
        return 1
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-extrabold text-slate-900">주문 & 배송 실시간 조회</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              주문번호 또는 연락처로 검색
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="예: ORD-20261111-0001 또는 010-1234-5678"
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-red-500 outline-hidden"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 transition-all shrink-0 flex items-center gap-1.5 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                조회하기
              </button>
            </div>
            {/* Quick Demo Hint Button */}
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
              <span>테스트 샘플 조회:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('ORD-20261111-0001')
                }}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-semibold"
              >
                ORD-20261111-0001
              </button>
            </div>
          </form>

          {/* Results Area */}
          {isLoading ? (
            <div className="py-12 text-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600 mb-2" />
              <p className="text-xs">Supabase에서 주문 데이터를 조회하는 중입니다...</p>
            </div>
          ) : hasSearched && orders.length === 0 ? (
            <div className="py-10 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">일치하는 주문 내역이 없습니다</p>
              <p className="text-xs text-slate-400 mt-1">입력하신 주문번호나 휴대폰 번호를 다시 확인해주세요.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const badge = getStatusBadge(order.status)
                const currentStep = getStepProgress(order.status)

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4"
                  >
                    {/* Top Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">{order.order_number}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}>
                            {badge.text}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          주문일시: {new Date(order.created_at).toLocaleString('ko-KR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400">총 결제금액</span>
                        <p className="text-base font-black text-red-600">{formatPrice(order.total_amount)}</p>
                      </div>
                    </div>

                    {/* Progress Step Bar */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold">
                        <div className={currentStep >= 1 ? 'text-red-600' : 'text-slate-400'}>
                          <div
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center mb-1 text-xs ${
                              currentStep >= 1 ? 'bg-red-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </div>
                          <span>결제완료</span>
                        </div>

                        <div className={currentStep >= 2 ? 'text-amber-600' : 'text-slate-400'}>
                          <div
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center mb-1 text-xs ${
                              currentStep >= 2 ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                          </div>
                          <span>상품준비중</span>
                        </div>

                        <div className={currentStep >= 3 ? 'text-purple-600' : 'text-slate-400'}>
                          <div
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center mb-1 text-xs ${
                              currentStep >= 3 ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            <Truck className="w-3.5 h-3.5" />
                          </div>
                          <span>배송중</span>
                        </div>

                        <div className={currentStep >= 4 ? 'text-emerald-600' : 'text-slate-400'}>
                          <div
                            className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center mb-1 text-xs ${
                              currentStep >= 4 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <span>배송완료</span>
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-slate-500 uppercase">주문 상품</p>
                      <div className="divide-y divide-slate-100">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 truncate mr-2">
                              {item.image_url && (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-9 h-9 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200"
                                />
                              )}
                              <span className="font-semibold text-slate-800 truncate">{item.name}</span>
                              <span className="text-slate-400 font-mono">x{item.quantity}</span>
                            </div>
                            <span className="font-bold text-slate-900 shrink-0">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Destination */}
                    <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-700">받는 분:</span>
                        <span>{order.customer_name} ({order.customer_phone})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-700">배송 주소:</span>
                        <span className="text-right truncate max-w-[280px]">{order.customer_address}</span>
                      </div>
                      {order.note && (
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-700">배송 메모:</span>
                          <span>{order.note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
