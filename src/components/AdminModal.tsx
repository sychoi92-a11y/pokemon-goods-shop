import React, { useState, useEffect } from 'react'
import type { Order, Category } from '../types'
import { supabase, updateOrderStatus, addProduct } from '../lib/supabase'
import { formatPrice } from '../utils/pokemon'
import { X, Database, PlusCircle, CheckCircle, RefreshCw, Layers } from 'lucide-react'

interface AdminModalProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onProductAdded: () => void
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  categories,
  onProductAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'addProduct' | 'info'>('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    name_en: '',
    category_id: categories[0]?.id || 'plush',
    pokemon_name: '뮤츠',
    pokemon_type: '에스퍼',
    price: 45000,
    original_price: 52000,
    image_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png',
    description: '전설의 포켓몬 뮤츠의 정교한 디테일과 사이코키네시스 포즈를 담은 프리미엄 한정판 굿즈입니다.',
    stock: 15,
    rating: 4.9,
    review_count: 32,
    badge: 'NEW',
    is_featured: true,
  })

  useEffect(() => {
    if (isOpen) {
      fetchOrders()
    }
  }, [isOpen])

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true)
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (err) {
      console.error('Failed to fetch admin orders:', err)
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    const success = await updateOrderStatus(orderId, newStatus)
    if (success) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      )
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await addProduct(newProduct)
      alert('상품이 Supabase 데이터베이스에 등록되었습니다!')
      onProductAdded()
      setActiveTab('orders')
    } catch (err: unknown) {
      console.error('Failed to add product:', err)
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
      alert(`상품 추가 실패: ${message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-slate-100 max-h-[92vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold">Supabase MCP 통합 백오피스</h2>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  CONNECTED
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                실시간 DB 연동 관리 (주문 상태 변경, 신규 상품 등록, 스키마 현황)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold transition-all relative ${
              activeTab === 'orders' ? 'text-red-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            실시간 주문 관리 ({orders.length}건)
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('addProduct')}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1 ${
              activeTab === 'addProduct' ? 'text-red-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            신규 굿즈 등록
            {activeTab === 'addProduct' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-1 ${
              activeTab === 'info' ? 'text-red-600' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Supabase 아키텍처 정보
            {activeTab === 'info' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-6 flex-1">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-800">
                  Supabase `orders` 테이블 실시간 목록
                </h3>
                <button
                  onClick={fetchOrders}
                  disabled={isLoadingOrders}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md border border-slate-200 hover:bg-slate-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin' : ''}`} />
                  새로고침
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  아직 등록된 주문이 없습니다.
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white">
                  {orders.map((order) => (
                    <div key={order.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-mono font-bold text-xs text-slate-900 mr-2">
                            {order.order_number}
                          </span>
                          <span className="text-xs font-semibold text-slate-700">
                            {order.customer_name} ({order.customer_phone})
                          </span>
                        </div>

                        {/* Status Select Toggle */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 font-semibold">배송상태 변경:</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                            className="text-xs font-bold py-1 px-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-hidden focus:border-red-500"
                          >
                            <option value="결제완료">결제완료</option>
                            <option value="배송준비중">배송준비중</option>
                            <option value="배송중">배송중</option>
                            <option value="배송완료">배송완료</option>
                            <option value="주문취소">주문취소</option>
                          </select>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 flex justify-between">
                        <span>
                          {order.items?.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                        </span>
                        <span className="font-bold text-slate-900">{formatPrice(order.total_amount)}</span>
                      </div>

                      <div className="text-[11px] text-slate-400 flex justify-between">
                        <span>배송지: {order.customer_address}</span>
                        <span>{new Date(order.created_at).toLocaleString('ko-KR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADD PRODUCT */}
          {activeTab === 'addProduct' && (
            <form onSubmit={handleAddProduct} className="space-y-4 max-w-2xl mx-auto">
              <h3 className="text-xs font-extrabold text-slate-800 pb-2 border-b border-slate-100">
                Supabase `products` 테이블에 새 굿즈 추가
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">굿즈 상품명</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">영문 상품명</label>
                  <input
                    type="text"
                    value={newProduct.name_en}
                    onChange={(e) => setNewProduct({ ...newProduct, name_en: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">카테고리</label>
                  <select
                    value={newProduct.category_id}
                    onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">포켓몬 이름</label>
                  <input
                    type="text"
                    required
                    value={newProduct.pokemon_name}
                    onChange={(e) => setNewProduct({ ...newProduct, pokemon_name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">포켓몬 속성 타입</label>
                  <input
                    type="text"
                    required
                    value={newProduct.pokemon_type}
                    onChange={(e) => setNewProduct({ ...newProduct, pokemon_type: e.target.value })}
                    placeholder="예: 전기, 불꽃, 에스퍼"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">판매 가격 (원)</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">정상 가격 (할인 표시용)</label>
                  <input
                    type="number"
                    value={newProduct.original_price}
                    onChange={(e) => setNewProduct({ ...newProduct, original_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">재고 수량</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">이미지 URL</label>
                <input
                  type="url"
                  required
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">상품 설명</label>
                <textarea
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Supabase에 저장 중...' : '상품 등록하기'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: INFO */}
          {activeTab === 'info' && (
            <div className="space-y-4 text-xs text-slate-700 max-w-2xl mx-auto">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Supabase Cloud 프로젝트 연동 정보
                </h4>
                <div className="space-y-1 font-mono text-[11px] text-slate-600">
                  <p><strong>Project Ref:</strong> zfhziuefybjyiqqbmmva</p>
                  <p><strong>Host:</strong> db.zfhziuefybjyiqqbmmva.supabase.co</p>
                  <p><strong>Postgres Engine:</strong> PostgreSQL 17</p>
                  <p><strong>Region:</strong> ap-southeast-2 (Sydney)</p>
                  <p><strong>Status:</strong> ACTIVE_HEALTHY</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  적용된 RLS (Row Level Security) 테이블
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li><strong>categories:</strong> 카테고리 목록 (공개 조회 및 관리 허용)</li>
                  <li><strong>products:</strong> 포켓몬 굿즈 상품 (공개 조회 및 실시간 재고/추가 허용)</li>
                  <li><strong>orders:</strong> 주문 및 배송 내역 (고객 주문 작성, 주문번호/전화번호 기반 조회 및 상태 업데이트)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
