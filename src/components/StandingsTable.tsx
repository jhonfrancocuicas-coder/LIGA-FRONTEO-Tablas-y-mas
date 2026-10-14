import React, { useState } from 'react';
import { Standing } from '../types/tournament';
import { TeamBadge } from './TeamBadge';
import { ArrowUpDown, ArrowUp, ArrowDown, Info, Shield } from 'lucide-react';

interface StandingsTableProps {
  standings: Standing[];
  onSelectTeam?: (teamId: string) => void;
}

type SortField = 'pts' | 'dg' | 'gf' | 'gc' | 'pg' | 'pe' | 'pp' | 'pj';

export const StandingsTable: React.FC<StandingsTableProps> = ({
  standings,
  onSelectTeam,
}) => {
  const [sortField, setSortField] = useState<SortField>('pts');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending
    }
  };

  const sortedList = [...standings].sort((a, b) => {
    let diff = 0;
    if (sortField === 'pts') diff = a.pts - b.pts;
    else if (sortField === 'dg') diff = a.dg - b.dg;
    else if (sortField === 'gf') diff = a.gf - b.gf;
    else if (sortField === 'gc') diff = a.gc - b.gc;
    else if (sortField === 'pg') diff = a.pg - b.pg;
    else if (sortField === 'pe') diff = a.pe - b.pe;
    else if (sortField === 'pp') diff = a.pp - b.pp;
    else if (sortField === 'pj') diff = a.pj - b.pj;

    // tie breaker
    if (diff === 0) {
      diff = a.dg - b.dg;
    }
    if (diff === 0) {
      diff = a.gf - b.gf;
    }

    return sortAsc ? diff : -diff;
  });

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-50 group-hover:opacity-100" />;
    }
    return sortAsc ? (
      <ArrowUp className="w-3 h-3 text-cyan-400 font-bold" />
    ) : (
      <ArrowDown className="w-3 h-3 text-cyan-400 font-bold" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Table Card */}
      <div className="bg-slate-900/80 border border-white/10 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
        {/* Table Header Controls */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
                TABLA DE POSICIONES
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Oficial 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Liga Fronteo Obelisco • Clasificación en tiempo real calculada automáticamente tras cada resultado.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              <span>1º al 4º: Play-Offs Cuartos</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-700"></span>
              <span>5º al 12º: Fase Regular</span>
            </div>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 font-bold">
              <tr>
                <th className="py-3.5 px-3 text-center w-12">#</th>
                <th className="py-3.5 px-4 min-w-[190px]">EQUIPO</th>
                <th
                  onClick={() => handleSort('pj')}
                  className="py-3.5 px-3 text-center cursor-pointer hover:text-white transition group"
                  title="Partidos Jugados"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>PJ</span>
                    {renderSortIcon('pj')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pg')}
                  className="py-3.5 px-3 text-center cursor-pointer hover:text-white transition group text-emerald-400"
                  title="Partidos Ganados"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>G</span>
                    {renderSortIcon('pg')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pe')}
                  className="py-3.5 px-3 text-center cursor-pointer hover:text-white transition group text-amber-400"
                  title="Partidos Empatados"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>E</span>
                    {renderSortIcon('pe')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pp')}
                  className="py-3.5 px-3 text-center cursor-pointer hover:text-white transition group text-rose-400"
                  title="Partidos Perdidos"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>P</span>
                    {renderSortIcon('pp')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('gf')}
                  className="py-3.5 px-3 text-center cursor-pointer hover:text-white transition group"
                  title="Goles a Favor"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>GF</span>
                    {renderSortIcon('gf')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('gc')}
                  className="py-3.5 px-3 text-center cursor-pointer hover:text-white transition group"
                  title="Goles en Contra"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>GC</span>
                    {renderSortIcon('gc')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('dg')}
                  className="py-3.5 px-3 text-center cursor-pointer hover:text-white transition group font-bold"
                  title="Diferencia de Goles"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>DG</span>
                    {renderSortIcon('dg')}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pts')}
                  className="py-3.5 px-4 text-center cursor-pointer hover:text-white transition group font-black text-cyan-400"
                  title="Puntos Totales"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>PTS</span>
                    {renderSortIcon('pts')}
                  </div>
                </th>
                <th className="py-3.5 px-3 text-center hidden md:table-cell">ÚLTIMOS 5</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 font-medium">
              {sortedList.map((item, index) => {
                const isPlayoffZone = index < 4;
                const isLeader = index === 0;

                return (
                  <tr
                    key={item.teamId}
                    onClick={() => onSelectTeam && onSelectTeam(item.teamId)}
                    className={`transition-colors cursor-pointer group ${
                      isLeader
                        ? 'bg-amber-500/5 hover:bg-amber-500/10'
                        : isPlayoffZone
                        ? 'hover:bg-emerald-500/5'
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    {/* Position */}
                    <td className="py-3.5 px-3 text-center font-bold relative">
                      {isPlayoffZone && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
                      )}
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-bold ${
                          isLeader
                            ? 'bg-amber-400 text-slate-950 font-black'
                            : isPlayoffZone
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'text-slate-400'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>

                    {/* Team Name & Crest */}
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-3">
                        <TeamBadge
                          badgeStyle={item.team.badgeStyle}
                          name={item.team.name}
                          size="sm"
                          className="transition-transform group-hover:scale-110"
                        />
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-1">
                            {item.team.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            Cap: {item.team.captainName}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* PJ */}
                    <td className="py-3.5 px-3 text-center text-slate-300 font-semibold">
                      {item.pj}
                    </td>

                    {/* PG */}
                    <td className="py-3.5 px-3 text-center text-emerald-400 font-bold">
                      {item.pg}
                    </td>

                    {/* PE */}
                    <td className="py-3.5 px-3 text-center text-amber-400 font-semibold">
                      {item.pe}
                    </td>

                    {/* PP */}
                    <td className="py-3.5 px-3 text-center text-rose-400">
                      {item.pp}
                    </td>

                    {/* GF */}
                    <td className="py-3.5 px-3 text-center text-slate-300">
                      {item.gf}
                    </td>

                    {/* GC */}
                    <td className="py-3.5 px-3 text-center text-slate-400">
                      {item.gc}
                    </td>

                    {/* DG */}
                    <td
                      className={`py-3.5 px-3 text-center font-bold ${
                        item.dg > 0
                          ? 'text-emerald-400'
                          : item.dg < 0
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.dg > 0 ? `+${item.dg}` : item.dg}
                    </td>

                    {/* PTS */}
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-score text-2xl font-bold text-cyan-400 px-2 py-0.5 rounded-lg bg-slate-950/80 border border-white/10 shadow-sm inline-block min-w-[36px]">
                        {item.pts}
                      </span>
                    </td>

                    {/* Form (W/D/L) */}
                    <td className="py-3.5 px-3 text-center hidden md:table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {item.form.length === 0 ? (
                          <span className="text-[10px] text-slate-500">-</span>
                        ) : (
                          item.form.map((res, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black uppercase text-slate-950 ${
                                res === 'W'
                                  ? 'bg-emerald-400'
                                  : res === 'D'
                                  ? 'bg-amber-400'
                                  : 'bg-rose-500 text-white'
                              }`}
                              title={res === 'W' ? 'Victoria' : res === 'D' ? 'Empate' : 'Derrota'}
                            >
                              {res === 'W' ? 'G' : res === 'D' ? 'E' : 'P'}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info banner */}
        <div className="bg-slate-950/80 px-4 py-3 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              Criterios de Desempate: 1) Puntos, 2) Diferencia de Goles, 3) Goles a Favor, 4) Enfrentamiento Directo.
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            Haz clic en cualquier columna para ordenar o en un equipo para ver su plantilla.
          </div>
        </div>
      </div>
    </div>
  );
};
