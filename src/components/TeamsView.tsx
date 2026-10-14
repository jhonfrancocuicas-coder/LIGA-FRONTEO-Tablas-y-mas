import React, { useState } from 'react';
import { Team, Player } from '../types/tournament';
import { TeamBadge, TournamentLogo } from './TeamBadge';
import { Shield, Users, MapPin, Award, UserPlus, X, Sparkles, Printer, FileText, Phone, IdCard, Calendar } from 'lucide-react';

interface TeamsViewProps {
  teams: Team[];
  players: Player[];
  selectedTeamId?: string | null;
  onSelectTeam?: (teamId: string | null) => void;
  onOpenAddPlayerModal?: (teamId: string) => void;
  isAdmin?: boolean;
}

export const TeamsView: React.FC<TeamsViewProps> = ({
  teams,
  players,
  selectedTeamId = null,
  onSelectTeam,
  onOpenAddPlayerModal,
  isAdmin = false,
}) => {
  const [modalTeamId, setModalTeamId] = useState<string | null>(selectedTeamId);
  const [filterQuery, setFilterQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [showPrintSheet, setShowPrintSheet] = useState<boolean>(false);

  const activeTeam = teams.find((t) => t.id === (modalTeamId || selectedTeamId));
  const activeSquad = activeTeam
    ? players.filter((p) => p.teamId === activeTeam.id).sort((a, b) => a.dorsal - b.dorsal)
    : [];

  const filteredTeams = teams.filter(
    (t) =>
      t.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.captainName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      t.homeCourt.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleOpenTeam = (teamId: string) => {
    setModalTeamId(teamId);
    if (onSelectTeam) onSelectTeam(teamId);
  };

  const handleCloseModal = () => {
    setModalTeamId(null);
    setShowPrintSheet(false);
    if (onSelectTeam) onSelectTeam(null);
  };

  const getPositionLabel = (pos: string) => {
    switch (pos) {
      case 'POR':
        return 'Portero';
      case 'CIE':
        return 'Cierre';
      case 'ALA':
        return 'Ala';
      case 'PIV':
        return 'Pívot';
      case 'DEF':
        return 'Defensa';
      case 'MED':
        return 'Mediocampista';
      case 'DEL':
        return 'Delantero';
      default:
        return pos;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold font-heading text-white">
              EQUIPOS Y PLANTILLAS OFICIALES
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              12 Clubes Registrados
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Nóminas oficiales y fichas de atletas para la temporada 2026 de la Liga Fronteo Obelisco.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Buscar club, capitán o cancha..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Teams Grid (12 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeams.map((team) => {
          const teamSquad = players.filter((p) => p.teamId === team.id);
          const totalGoals = teamSquad.reduce((acc, p) => acc + (p.goals || 0), 0);

          return (
            <div
              key={team.id}
              onClick={() => handleOpenTeam(team.id)}
              className="bg-slate-900/80 border border-white/10 hover:border-cyan-500/50 rounded-2xl p-5 shadow-lg hover:shadow-cyan-950/20 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Badge & Name */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <TeamBadge
                      badgeStyle={team.badgeStyle}
                      name={team.name}
                      size="lg"
                      className="transition-transform group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {team.shortName}
                      </span>
                      <span className="text-[10px] text-slate-400">Fundado {team.foundedYear}</span>
                    </div>
                    <h3 className="text-lg font-black font-heading text-white group-hover:text-cyan-300 transition truncate">
                      {team.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {team.description || 'Club oficial de la liga.'}
                    </p>
                  </div>
                </div>

                {/* Team Info Details */}
                <div className="space-y-2 text-xs text-slate-300 border-t border-white/5 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      Capitán Oficial:
                    </span>
                    <span className="font-semibold text-white">
                      {team.captainName || 'Por Definir'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-emerald-400" />
                      Director Técnico:
                    </span>
                    <span className="font-semibold text-slate-200">{team.coach}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" />
                      Sede / Cancha:
                    </span>
                    <span className="text-slate-300 truncate max-w-[150px]">{team.homeCourt}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Roster count & quick stats */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-white/5 font-semibold">
                  👥 {teamSquad.length} Inscritos
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/20 font-bold">
                  ⚽ {totalGoals} Goles
                </span>
                <span className="text-cyan-400 group-hover:translate-x-1 transition text-xs font-bold">
                  Ver Ficha Oficial →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Details & Full Roster Modal */}
      {activeTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-4">
                <TeamBadge
                  badgeStyle={activeTeam.badgeStyle}
                  name={activeTeam.name}
                  size="xl"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {activeTeam.shortName}
                    </span>
                    <span className="text-xs text-slate-400">Temporada Oficial 2026</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black font-heading text-white">{activeTeam.name}</h2>
                  <p className="text-xs text-slate-400">
                    Cancha: <strong className="text-white">{activeTeam.homeCourt}</strong> • DT:{' '}
                    <strong className="text-white">{activeTeam.coach}</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Controls Bar */}
            <div className="px-4 sm:px-5 py-3 bg-slate-950/70 border-b border-white/5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    viewMode === 'cards'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Fichas de Atletas</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    viewMode === 'table'
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Tabla de Nómina</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPrintSheet(!showPrintSheet)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold hover:bg-amber-400/30 transition"
                  title="Generar planilla oficial imprimible"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{showPrintSheet ? 'Ocultar Planilla' : 'Planilla Imprimible'}</span>
                </button>

                {onOpenAddPlayerModal && (
                  <button
                    onClick={() => {
                      handleCloseModal();
                      onOpenAddPlayerModal(activeTeam.id);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold hover:bg-emerald-400 transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Inscribir Jugador</span>
                  </button>
                )}
              </div>
            </div>

            {/* Printable Technical Match Sheet View */}
            {showPrintSheet && (
              <div className="p-4 bg-slate-950/90 border-b border-white/10">
                <div className="bg-white text-slate-950 p-6 rounded-2xl shadow-xl max-h-[60vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <TournamentLogo size="md" />
                      <div>
                        <h3 className="text-base font-black font-heading tracking-wide uppercase">
                          LIGA FRONTEO OBELISCO 2026
                        </h3>
                        <p className="text-xs font-bold text-slate-600">
                          PLANILLA OFICIAL DE INSCRIPCIÓN Y DELEGACIÓN
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="font-black text-sm uppercase">{activeTeam.name}</div>
                      <div className="text-slate-600">DT: {activeTeam.coach}</div>
                      <div className="text-slate-600">Capitán: {activeTeam.captainName}</div>
                    </div>
                  </div>

                  <table className="w-full text-left text-xs border border-slate-300 mb-4">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2 border-r border-slate-300 text-center w-10">DORSAL</th>
                        <th className="p-2 border-r border-slate-300">NOMBRE COMPLETO</th>
                        <th className="p-2 border-r border-slate-300">C.I. / DNI</th>
                        <th className="p-2 border-r border-slate-300 text-center">POSICIÓN</th>
                        <th className="p-2 border-r border-slate-300 text-center">EDAD</th>
                        <th className="p-2 border-r border-slate-300">TELÉFONO</th>
                        <th className="p-2 text-center w-28">FIRMA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {activeSquad.map((p, idx) => (
                        <tr key={p.id}>
                          <td className="p-2 border-r border-slate-300 text-center font-bold">{p.dorsal}</td>
                          <td className="p-2 border-r border-slate-300 font-semibold">
                            {p.name} {p.isCaptain ? '(CAPITÁN)' : ''}
                          </td>
                          <td className="p-2 border-r border-slate-300 font-mono">{p.dni || 'S/D'}</td>
                          <td className="p-2 border-r border-slate-300 text-center font-semibold">{getPositionLabel(p.position)}</td>
                          <td className="p-2 border-r border-slate-300 text-center">{p.age ? `${p.age} años` : '-'}</td>
                          <td className="p-2 border-r border-slate-300 font-mono text-[11px]">{p.phone || 'S/D'}</td>
                          <td className="p-2 text-center border-b border-slate-200"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-300 text-center text-xs">
                    <div>
                      <div className="border-b border-slate-400 h-8 mb-1"></div>
                      <span className="font-bold">Firma del Delegado / DT</span>
                    </div>
                    <div>
                      <div className="border-b border-slate-400 h-8 mb-1"></div>
                      <span className="font-bold">Firma del Capitán</span>
                    </div>
                    <div>
                      <div className="border-b border-slate-400 h-8 mb-1"></div>
                      <span className="font-bold">Mesa Técnica / Árbitro</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={handlePrint}
                      className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimir Documento</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              {activeSquad.length === 0 ? (
                <div className="p-10 text-center bg-slate-950/40 rounded-2xl border border-white/5 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400 text-xl font-bold">
                    👥
                  </div>
                  <h3 className="text-base font-bold text-white">No hay jugadores inscritos en este equipo</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    La plantilla oficial de {activeTeam.name} está lista para recibir registros en la base de datos de la liga.
                  </p>
                  {onOpenAddPlayerModal && (
                    <button
                      onClick={() => {
                        handleCloseModal();
                        onOpenAddPlayerModal(activeTeam.id);
                      }}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5 mt-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Inscribir Primer Jugador Ahora</span>
                    </button>
                  )}
                </div>
              ) : viewMode === 'cards' ? (
                /* Athletic Cards View (Fichas de Jugadores) */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {activeSquad.map((player) => (
                    <div
                      key={player.id}
                      className="bg-slate-950/80 border border-white/10 hover:border-cyan-500/40 rounded-2xl p-4 transition-all shadow-md group relative overflow-hidden flex flex-col justify-between"
                    >
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-white/10 flex items-center justify-center text-2xl shadow-inner font-bold text-white overflow-hidden">
                            {player.photoUrl && player.photoUrl.startsWith('http') ? (
                              <img
                                src={player.photoUrl}
                                alt={player.name}
                                className="w-full h-full object-cover"
                              />
                            ) : player.photoUrl ? (
                              <span>{player.photoUrl}</span>
                            ) : (
                              <span>⚽</span>
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              {getPositionLabel(player.position)}
                            </span>
                            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-1 mt-1">
                              {player.name}
                            </h4>
                          </div>
                        </div>

                        {/* Jersey Dorsal */}
                        <div className="w-9 h-9 rounded-xl bg-slate-900 border-2 border-white/20 flex items-center justify-center font-score text-xl font-bold text-amber-400 shrink-0 shadow-md">
                          #{player.dorsal}
                        </div>
                      </div>

                      {/* Card Details: DNI, Age, Phone */}
                      <div className="space-y-1.5 text-xs text-slate-300 border-t border-white/5 pt-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <IdCard className="w-3.5 h-3.5 text-slate-500" />
                            C.I. / DNI:
                          </span>
                          <span className="font-mono font-semibold text-white">{player.dni || 'Sin registrar'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            Edad:
                          </span>
                          <span className="font-semibold text-slate-200">
                            {player.age ? `${player.age} años` : '-'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-500" />
                            Contacto:
                          </span>
                          <span className="font-mono text-[11px] text-cyan-300">{player.phone || 'S/D'}</span>
                        </div>
                      </div>

                      {/* Card Footer: Role & Goals */}
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                        {player.isCaptain ? (
                          <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px]">
                            👑 CAPITÁN
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">Jugador Oficial</span>
                        )}

                        <span className="text-amber-400 font-bold text-xs">
                          ⚽ {player.goals || 0} Goles
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Formal Squad Table View */
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 font-bold">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-12">#</th>
                        <th className="py-2.5 px-4">JUGADOR</th>
                        <th className="py-2.5 px-3">C.I. / DNI</th>
                        <th className="py-2.5 px-3 text-center">POSICIÓN</th>
                        <th className="py-2.5 px-3 text-center">EDAD</th>
                        <th className="py-2.5 px-3">TELÉFONO</th>
                        <th className="py-2.5 px-3 text-center text-amber-400">GOLES</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {activeSquad.map((player) => (
                        <tr key={player.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-2.5 px-3 text-center font-bold">
                            <span className="w-7 h-7 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center font-score text-lg font-bold mx-auto border border-white/10">
                              {player.dorsal}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-white font-semibold">
                            <div className="flex items-center gap-2">
                              <span>{player.name}</span>
                              {player.isCaptain && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black">
                                  CAP
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-300">
                            {player.dni || '-'}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300">
                              {getPositionLabel(player.position)}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-400">
                            {player.age ? `${player.age} años` : '-'}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-xs text-slate-300">
                            {player.phone || '-'}
                          </td>
                          <td className="py-2.5 px-3 text-center font-score text-xl font-bold text-amber-400">
                            {player.goals || 0}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Total de atletas en nómina: <strong>{activeSquad.length}</strong>
              </span>
              <button
                onClick={handleCloseModal}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
