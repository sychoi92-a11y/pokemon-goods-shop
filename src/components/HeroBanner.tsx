import React from 'react'
import { Sparkles, ShieldCheck, Zap, Truck } from 'lucide-react'

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 text-white rounded-3xl mx-4 my-6 shadow-2xl border border-red-900/40">
      {/* Background Glows & Pokéball Silhouette */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-red-600/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -left-10 -top-10 w-72 h-72 rounded-full bg-yellow-500/15 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 container mx-auto px-6 py-10 md:py-14 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Content */}
        <div className="max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold mb-4 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            2026 NEW OFFICIAL COLLECTION
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
            너로 정했다! <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-red-400">
              포켓몬 오피셜 굿즈 스토어
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 font-normal mb-6 leading-relaxed">
            모찌 인형부터 메가진화 스케일 피규어, 라이프스타일 머그컵 & 무드등까지! <br className="hidden sm:inline" />
            Supabase 데이터베이스 실시간 재고로 안전하고 빠른 포켓몬 라이프를 시작하세요.
          </p>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-[12px]">100% 정품</p>
                <p className="text-[10px] text-slate-400">공식 라이선스</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-[12px]">번개 총알배송</p>
                <p className="text-[10px] text-slate-400">오후 3시 당일출고</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-[12px]">무료 배송</p>
                <p className="text-[10px] text-slate-400">5만원 이상 구매시</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Hero Graphic Showcase */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* Pulsing Aura */}
            <div className="absolute inset-0 rounded-full border border-yellow-400/30 animate-spin" style={{ animationDuration: '20s' }}></div>
            <div className="absolute inset-4 rounded-full border border-dashed border-red-400/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '25s' }}></div>
            
            {/* Pikachu Main Illustration */}
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
              alt="피카츄"
              className="w-56 h-56 object-contain relative z-10 drop-shadow-[0_20px_25px_rgba(250,204,21,0.35)] hover:scale-105 transition-transform duration-300"
            />

            {/* Floating Mini Badges */}
            <div className="absolute -top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[11px] px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1">
              ⭐ 베스트셀러 1위
            </div>
            <div className="absolute -bottom-2 left-2 bg-slate-900/90 border border-slate-700 text-white font-medium text-[11px] px-3 py-1.5 rounded-xl shadow-lg z-20 backdrop-blur-md">
              <span className="text-yellow-400 font-bold">⚡ 모찌 인형</span> 재입고 완료!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
