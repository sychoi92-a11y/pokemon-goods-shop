import React from 'react'
import type { Category, SortOption } from '../types'
import { ArrowUpDown } from 'lucide-react'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onSelectCategory: (id: string) => void
  selectedType: string
  onSelectType: (type: string) => void
  sortBy: SortOption
  onSelectSort: (sort: SortOption) => void
  totalCount: number
}

const POKEMON_TYPES = [
  { id: 'all', name: '전체 타입' },
  { id: '전기', name: '⚡ 전기' },
  { id: '불꽃', name: '🔥 불꽃' },
  { id: '물', name: '💧 물' },
  { id: '풀', name: '🌿 풀' },
  { id: '에스퍼', name: '🔮 에스퍼' },
  { id: '드래곤', name: '🐉 드래곤' },
  { id: '노말', name: '⚪ 노말' },
  { id: '고스트', name: '👻 고스트' },
  { id: '격투', name: '🥊 격투' },
]

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedType,
  onSelectType,
  sortBy,
  onSelectSort,
  totalCount,
}) => {
  return (
    <div className="container mx-auto px-4 mb-6 space-y-3">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        <button
          onClick={() => onSelectCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            selectedCategory === 'all'
              ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          🌟 전체 상품
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Type Filter & Sort Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Type pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 shrink-0">속성:</span>
          {POKEMON_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectType(t.id)}
              className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedType === t.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Count & Sort Selector */}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          <span className="text-xs text-slate-500 font-medium">
            총 <strong className="text-red-600 font-bold">{totalCount}</strong>개 상품
          </span>

          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value as SortOption)}
              className="pl-8 pr-6 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-700 hover:border-slate-400 focus:outline-hidden focus:border-red-500 cursor-pointer"
            >
              <option value="featured">추천순</option>
              <option value="popular">인기순 (리뷰 많은순)</option>
              <option value="latest">신상품순</option>
              <option value="price-asc">낮은 가격순</option>
              <option value="price-desc">높은 가격순</option>
              <option value="rating">평점 높은순</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
