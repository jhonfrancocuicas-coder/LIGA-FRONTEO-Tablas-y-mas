import React, { useState } from 'react';
import { Match, Team, MatchStatus } from '../types/tournament';
import { TeamBadge } from './TeamBadge';
import { MapPin, User, Clock, ChevronDown, ChevronUp, Radio } from 'lucide-react';

interface FixtureViewProps {
  matches: Match[];
  teams: Team[];
  onSelectTeam?: (teamId: string) => void;
  onEditMatch?: (match: Match) => void;
  isAdmin?: boolean;
}

export const FixtureView: React.FC<FixtureViewProps> = ({
  matches,
  teams,
  onSelectTeam,
  onEditMatch,
  isAdmin = false,
}) => {
  const [selectedRound, setSelectedRound] = useState<number | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  // Available rounds
  const rounds = Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);

  const getTeam = (teamId: string): Team => {
    return (
      teams.find((t) => t.id === teamId) || {
        id: teamId,
        name: 'Equipo',
        shortName: 'EQ',
        captainName: '',
        coach: '',
        homeCourt: '',
        primaryColor: '#64748b',
        secondaryColor: '#94a3b8',
        foundedYear: 2026,
        badgeStyle: 'wolf',
      }
    );
  };

  const filteredMatches = matches.filter((m) => {
    const homeTeam = getTeam(m.homeTeamId);
    const awayTeam = getTeam(m.awayTeamId);

    const matchesRound = selectedRound === 'ALL' || m.round === selectedRound;
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      homeTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      awayTeam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.court.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.referee.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRound && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls: Round Pill Selector & Filters */}
      <div className="bg-slate-900/70 border border-white/10 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              Fixture & Próximos Enfrentamientos
            </h2>
            <p className="text-xs text-slate-400">
              Calendario oficial con canchas, fechas y designaciones arbitrales de la Liga Fronteo Obelisco.
            </p>
          </div>

          {/* Quick Round Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
            <button
              onClick={() => setSelectedRound('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                selectedRound === 'ALL'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Todas las Jornadas
            </button>
            {rounds.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRound(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  selectedRound === r
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Jornada {r}
              </button>
            ))}
          </div>
        </div>

        {/* Second row filters: Status buttons & search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === 'ALL'
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({matches.length})
            </button>
            <button
              onClick={() => setStatusFilter('LIVE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                statusFilter === 'LIVE'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                  : 'text-rose-400 hover:text-rose-300'
              }`}
            >
              <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
              En Vivo ({matches.filter((m) => m.status === 'LIVE').length})
            </button>
            <button
              onClick={() => setStatusFilter('FINISHED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === 'FINISHED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              Finalizados ({matches.filter((m) => m.status === 'FINISHED').length})
            </button>
            <button
              onClick={() => setStatusFilter('SCHEDULED')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                statusFilter === 'SCHEDULED'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-cyan-400 hover:text-cyan-300'
              }`}
            >
              Por Jugar ({matches.filter((m) => m.status === 'SCHEDULED').length})
            </button>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Buscar por equipo, cancha o árbitro..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition"
            />
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-12 text-center">
          <p className="text-slate-400 text-sm">No se encontraron partidos con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((m) => {
            const home = getTeam(m.homeTeamId);
            const away = getTeam(m.awayTeamId);
            const isLive = m.status === 'LIVE';
            const isFinished = m.status === 'FINISHED';
            const isExpanded = expandedMatchId === m.id;

            return (
              <div
                key={m.id}
                className={`bg-slate-900/80 border transition-all rounded-2xl overflow-hidden shadow-lg ${
                  isLive
                    ? 'border-rose-500/40 shadow-rose-950/20 ring-1 ring-rose-500/30'
                    : 'border-white/10 hover:border-cyan-500/30'
                }`}
              >
                {/* Match Header Badge */}
                <div className="bg-slate-950/60 px-4 py-2 border-b border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="font-bold text-slate-300">Jornada {m.round}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {m.date} - {m.time}
                    </span>
                  </div>

                  <div>
                    {isLive && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                        EN VIVO (2T)
                      </span>
                    )}
                    {isFinished && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-white/10">
                        FINALIZADO
                      </span>
                    )}
                    {!isLive && !isFinished && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        PROGRAMADO
                      </span>
                    )}
                  </div>
                </div>

                {/* Main Match Faceoff */}
                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-7 items-center gap-2">
                    {/* Home Team */}
                    <div
                      onClick={() => onSelectTeam && onSelectTeam(home.id)}
                      className="col-span-3 flex flex-col items-center text-center cursor-pointer group"
                    >
                      <TeamBadge
                        badgeStyle={home.badgeStyle}
                        name={home.name}
                        size="lg"
                        className="transition-transform group-hover:scale-110 mb-2"
                      />
                      <span className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition line-clamp-1">
                        {home.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">Local</span>
                    </div>

                    {/* Score / VS Center Area */}
                    <div className="col-span-1 flex flex-col items-center justify-center">
                      {isFinished || isLive ? (
                        <div className="flex flex-col items-center">
                          <div className="px-3 py-1 bg-slate-950/90 border border-white/10 rounded-xl shadow-inner font-score text-3xl sm:text-4xl text-cyan-400 font-bold tracking-wider leading-none">
                            {m.homeScore} : {m.awayScore}
                          </div>
                          {isLive && (
                            <span className="text-[10px] text-rose-400 font-bold mt-1 animate-pulse">
                              68&apos;
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-xs font-black text-slate-300 border border-white/5">
                            VS
                          </span>
                          <span className="text-[11px] text-cyan-400 font-semibold mt-1">
                            {m.time}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div
                      onClick={() => onSelectTeam && onSelectTeam(away.id)}
                      className="col-span-3 flex flex-col items-center text-center cursor-pointer group"
                    >
                      <TeamBadge
                        badgeStyle={away.badgeStyle}
                        name={away.name}
                        size="lg"
                        className="transition-transform group-hover:scale-110 mb-2"
                      />
                      <span className="font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition line-clamp-1">
                        {away.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">Visita</span>
                    </div>
                  </div>

                  {/* Scorers Summary if any */}
                  {m.scorers && m.scorers.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5 text-xs text-slate-300">
                      <div className="flex items-center justify-between mb-1 text-[11px] text-slate-400">
                        <span className="font-semibold text-amber-400">⚽ Goles del Partido:</span>
                        <button
                          onClick={() => setExpandedMatchId(isExpanded ? null : m.id)}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 text-[10px]"
                        >
                          {isExpanded ? 'Ocultar' : 'Ver Detalle'}
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="space-y-1 mt-2 bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                          {m.scorers.map((g) => {
                            const isHomeScorer = g.teamId === m.homeTeamId;
                            return (
                              <div
                                key={g.id}
                                className={`flex items-center justify-between text-xs py-0.5 ${
                                  isHomeScorer ? 'text-cyan-300' : 'text-emerald-300'
                                }`}
                              >
                                <span>
                                  {g.playerName} {g.isPenalty ? '(P)' : ''}
                                </span>
                                <span className="font-mono text-[11px] text-slate-400 font-bold">
                                  {g.minute}&apos;
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Court & Referee Footer Info */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-300 font-medium">{m.court}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Árbitro:</span>
                      <span className="text-emerald-300 font-semibold">{m.referee}</span>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => onEditMatch && onEditMatch(m)}
                        className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 ml-auto"
                      >
                        Gestionar Resultado / Árbitro
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
