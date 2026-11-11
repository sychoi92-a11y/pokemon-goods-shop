import React from 'react'
import { ShieldCheck, Database, Heart } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-b from-red-500 to-white border border-slate-700 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-900"></div>
              </div>
              <span className="font-extrabold text-white text-sm tracking-tight">
                POKÉMON GOODS STORE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              모든 포켓몬 트레이너들을 위한 공식 라이선스 굿즈 스토어.
              Supabase 클라우드 데이터베이스와 실시간 동기화됩니다.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">고객센터 안내</h4>
            <p className="text-sm font-black text-yellow-400">1588-0025</p>
            <p className="text-[11px] text-slate-400">평일 09:30 - 18:00 (점심시간 12:30 - 13:30)</p>
            <p className="text-[11px] text-slate-400">주말 및 공휴일 휴무</p>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">기술 스택 & 인프라</h4>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <Database className="w-3.5 h-3.5" />
              <span>Supabase Postgres 17 (MCP 연동)</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-blue-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Row Level Security (RLS) 보호</span>
            </div>
            <p className="text-[11px] text-slate-500">React 19 + TypeScript + Vite + Tailwind CSS</p>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs tracking-wider uppercase">안내 및 보증</h4>
            <p className="text-[11px] text-slate-400">
              © Nintendo, Creatures, GAME FREAK, TV Tokyo, ShoPro, JR Kikaku. © Pokémon.
            </p>
            <p className="text-[11px] text-slate-500">
              포켓몬과 포켓몬 캐릭터 이름은 닌텐도의 상표입니다.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© 2026 Pokémon Goods Store. Powered by Supabase MCP.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Pokémon Trainers
          </p>
        </div>
      </div>
    </footer>
  )
}
