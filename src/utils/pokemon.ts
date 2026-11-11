export const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  전기: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  불꽃: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  물: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  풀: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
  에스퍼: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
  노말: { bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-300' },
  고스트: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  드래곤: { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
  페어리: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' },
  악: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
  강철: { bg: 'bg-zinc-100', text: 'text-zinc-800', border: 'border-zinc-300' },
}

export function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + '원'
}

export function calculateDiscount(originalPrice?: number, price?: number): number {
  if (!originalPrice || !price || originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}
