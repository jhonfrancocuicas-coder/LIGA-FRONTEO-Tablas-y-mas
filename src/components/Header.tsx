import React from 'react';
import { TournamentLogo } from './TeamBadge';
import { UserSession } from '../types/tournament';
import { Trophy, Calendar, Download, Shield, Sparkles, UserCheck } from 'lucide-react';
import { generateSingleFileHtml } from '../services/exporter';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userSession: UserSession;
  totalGoals: number;
  totalMatches: number;
  liveMatchesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userSession,
  totalGoals,
  totalMatches,
  liveMatchesCount,
}) => {
  const handleDownloadStandalone = () => {
    const htmlContent = generateSingleFileHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'liga-fronteo-obelisco-2026.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-cyan-950 border-b border-emerald-500/20 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold uppercase tracking-wider shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Torneo Oficial 2026
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">12 Clubes Participantes</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">
              <strong className="text-amber-400">{totalGoals}</strong> Goles Anotados
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">
              <strong className="text-cyan-400">{totalMatches}</strong> Partidos Jugados
            </span>
            {liveMatchesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold animate-pulse">
                {liveMatchesCount} Partido EN VIVO
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadStandalone}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/80 px-2.5 py-1 rounded-lg border border-cyan-500/30 transition shadow-sm"
              title="Descarga la app completa en 1 solo archivo HTML listo para subir a GitHub Pages o abrir en el navegador"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Descargar HTML para GitHub Pages</span>
              <span className="md:hidden">Exportar HTML</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand & Crest */}
        <div
          onClick={() => setActiveTab('fixture')}
          className="flex items-center gap-3 cursor-pointer group transition"
        >
          <div className="relative">
            <TournamentLogo size="md" className="transition-transform group-hover:scale-105" />
            <div className="absolute -inset-1 bg-emerald-500/20 rounded-full blur-md -z-10 group-hover:bg-emerald-500/30 transition"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-widest uppercase bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                LIGA OFICIAL
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                2026
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black font-heading tracking-wide text-white group-hover:text-cyan-300 transition">
              LIGA FRONTEO OBELISCO
            </h1>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Fútbol & Futsal de Primera División • Temporada Inicial
            </p>
          </div>
        </div>

        {/* Right Action: Admin Profile / Login */}
        <div className="flex items-center gap-2.5">
          {userSession.isAuthenticated ? (
            <button
              onClick={() => setActiveTab('admin')}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 transition text-left"
            >
              <img
                src={userSession.avatar || 'https://ui-avatars.com/api/?name=Admin&background=0284c7&color=fff'}
                alt={userSession.name || 'Admin'}
                className="w-7 h-7 rounded-full border border-emerald-400 object-cover"
              />
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{userSession.name?.split(' ')[0]}</span>
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                  Panel Admin
                </div>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('admin')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition hover:scale-102 active:scale-98"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Acceso Admin</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="border-t border-white/5 bg-slate-900/50 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setActiveTab('fixture')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'fixture'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Fixture & Partidos</span>
            {liveMatchesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('standings')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'standings'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Tabla de Posiciones</span>
          </button>

          <button
            onClick={() => setActiveTab('scorers')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'scorers'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Goleadores (Botín de Oro)</span>
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'teams'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Equipos y Plantillas</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ml-auto ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold'
                : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-400/10'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Panel Admin (Google)</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
