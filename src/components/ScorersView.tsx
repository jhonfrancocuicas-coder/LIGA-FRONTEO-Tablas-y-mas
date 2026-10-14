import React, { useState } from 'react';
import { Player, Team } from '../types/tournament';
import { TeamBadge } from './TeamBadge';
import { Trophy, Award, Flame, Search } from 'lucide-react';

interface ScorersViewProps {
  scorers: { player: Player; team: Team; goals: number; assists: number; matchesCount: number }[];
  onSelectTeam?: (teamId: string) => void;
}

export const ScorersView: React.FC<ScorersViewProps> = ({
  scorers,
  onSelectTeam,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTeam, setFilterTeam] = useState<string>('ALL');

  const filteredScorers = scorers.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.team.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTeam = filterTeam === 'ALL' || item.team.id === filterTeam;

    return matchesSearch && matchesTeam;
  });

  const top3 = scorers.slice(0, 3);
  const remainingScorers = filteredScorers;

  // Extract unique teams
  const uniqueTeams = Array.from(new Set(scorers.map((s) => s.team))).filter(
    (v, i, a) => a.findIndex((t) => t.id === v.id) === i
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/20 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-heading text-white">
              BOTÍN DE ORO 2026
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40">
              Máximos Goleadores
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Ranking oficial de los mejores artilleros y goleadores de la Liga Fronteo Obelisco.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-center">
            <span className="block text-[10px] text-slate-400 uppercase font-bold">Líder Goleador</span>
            <span className="font-score text-xl font-bold text-amber-400">
              {top3[0]?.player.name || 'Sin datos'} ({top3[0]?.goals || 0} Goles)
            </span>
          </div>
        </div>
      </div>

      {/* If No Scorers Yet (Tournament Starting State) */}
      {scorers.length === 0 ? (
        <div className="bg-slate-900/80 border border-white/10 rounded-3xl p-10 text-center shadow-xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold font-heading text-white">
            La Carrera por el Botín de Oro está por Comenzar
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
            Todos los equipos inician igualados a cero puntos y cero goles. Tan pronto como se dispute la primera jornada y se registren goles en el panel de administración, se activará el ranking y podio de máximos artilleros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 2nd Place - Silver */}
          {top3[1] && (
            <div className="order-2 md:order-1 bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 relative overflow-hidden shadow-lg hover:border-slate-400/50 transition group">
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-slate-400/20 text-slate-200 border border-slate-400/30 text-xs font-black">
                2º LUGAR • PLATA
              </div>
              <div className="flex flex-col items-center text-center mt-2">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-slate-400/60 flex items-center justify-center font-bold text-slate-200 text-xl font-score shadow-md">
                    #{top3[1].player.dorsal}
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <TeamBadge badgeStyle={top3[1].team.badgeStyle} name={top3[1].team.name} size="sm" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                  {top3[1].player.name}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mb-3">{top3[1].team.name}</p>

                <div className="w-full grid grid-cols-2 gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-white/5 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Goles</span>
                    <span className="font-score text-3xl font-bold text-slate-200">{top3[1].goals}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Asistencias</span>
                    <span className="font-score text-3xl font-bold text-cyan-400">{top3[1].assists}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place - GOLD (Center & Prominent) */}
          {top3[0] && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/50 via-slate-900 to-slate-900 border-2 border-amber-400/60 rounded-2xl p-6 relative overflow-hidden shadow-2xl shadow-amber-950/40 hover:scale-[1.02] transition group">
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/20 rounded-full blur-2xl"></div>
              <div className="absolute top-3 right-3 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow-md flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>1º LUGAR • BOTÍN DE ORO</span>
              </div>
              <div className="flex flex-col items-center text-center mt-3">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center font-black text-amber-300 text-3xl font-score shadow-xl">
                    #{top3[0].player.dorsal}
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <TeamBadge badgeStyle={top3[0].team.badgeStyle} name={top3[0].team.name} size="md" />
                  </div>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition">
                  {top3[0].player.name}
                </h3>
                <p className="text-xs text-amber-400/90 font-bold mb-3">{top3[0].team.name}</p>

                <div className="w-full grid grid-cols-2 gap-2 bg-slate-950/90 p-3 rounded-xl border border-amber-500/20 text-center">
                  <div>
                    <span className="block text-[10px] text-amber-400 uppercase font-bold flex items-center justify-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      Goles
                    </span>
                    <span className="font-score text-4xl font-black text-amber-400 leading-none">
                      {top3[0].goals}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-bold">Asistencias</span>
                    <span className="font-score text-4xl font-bold text-cyan-400 leading-none">
                      {top3[0].assists}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place - Bronze */}
          {top3[2] && (
            <div className="order-3 bg-slate-900/80 border border-amber-800/40 rounded-2xl p-5 relative overflow-hidden shadow-lg hover:border-amber-700/50 transition group">
              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-amber-800/20 text-amber-400 border border-amber-700/40 text-xs font-black">
                3º LUGAR • BRONCE
              </div>
              <div className="flex flex-col items-center text-center mt-2">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-950/40 border-2 border-amber-700/60 flex items-center justify-center font-bold text-amber-300 text-xl font-score shadow-md">
                    #{top3[2].player.dorsal}
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <TeamBadge badgeStyle={top3[2].team.badgeStyle} name={top3[2].team.name} size="sm" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                  {top3[2].player.name}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mb-3">{top3[2].team.name}</p>

                <div className="w-full grid grid-cols-2 gap-2 bg-slate-950/70 p-2.5 rounded-xl border border-white/5 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Goles</span>
                    <span className="font-score text-3xl font-bold text-amber-400">{top3[2].goals}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Asistencias</span>
                    <span className="font-score text-3xl font-bold text-cyan-400">{top3[2].assists}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Complete Scorers Table & Filter */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold font-heading text-white">Tabla General de Artilleros</h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar jugador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="bg-slate-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="ALL">Todos los Equipos</option>
              {uniqueTeams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 font-bold">
              <tr>
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-4">JUGADOR</th>
                <th className="py-3 px-4">EQUIPO</th>
                <th className="py-3 px-3 text-center">POS</th>
                <th className="py-3 px-3 text-center">PJ</th>
                <th className="py-3 px-3 text-center">ASIST</th>
                <th className="py-3 px-4 text-center text-amber-400 font-bold">GOLES</th>
                <th className="py-3 px-3 text-center">PROMEDIO</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 font-medium">
              {remainingScorers.map((item, idx) => {
                const ratio = (item.goals / Math.max(1, item.matchesCount)).toFixed(2);
                return (
                  <tr
                    key={item.player.id}
                    className="hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="py-3 px-3 text-center font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${
                          idx === 0
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-950'
                            : idx === 2
                            ? 'bg-amber-800 text-white'
                            : 'text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-mono">
                          {item.player.dorsal}
                        </span>
                        <span>{item.player.name}</span>
                        {item.player.isCaptain && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-black">
                            CAP
                          </span>
                        )}
                      </div>
                    </td>

                    <td
                      onClick={() => onSelectTeam && onSelectTeam(item.team.id)}
                      className="py-3 px-4 cursor-pointer hover:text-cyan-300 transition"
                    >
                      <div className="flex items-center gap-2">
                        <TeamBadge badgeStyle={item.team.badgeStyle} name={item.team.name} size="xs" />
                        <span className="text-slate-300 font-semibold">{item.team.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                        {item.player.position}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center text-slate-400">
                      {item.matchesCount}
                    </td>

                    <td className="py-3 px-3 text-center text-cyan-400 font-semibold">
                      {item.assists}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-score text-2xl font-bold text-amber-400 px-2.5 py-0.5 rounded-lg bg-slate-950 border border-amber-500/30 inline-block min-w-[36px]">
                        {item.goals}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center text-slate-400 font-mono text-xs">
                      {ratio} g/p
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
