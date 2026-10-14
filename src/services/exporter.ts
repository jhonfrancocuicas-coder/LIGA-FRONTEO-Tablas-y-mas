import { tournamentDb } from './db';

/**
 * Generates a self-contained single-file HTML file with CSS, Tailwind CDN,
 * embedded data, and JavaScript so it can be deployed to GitHub Pages or opened directly in a browser.
 */
export function generateSingleFileHtml(): string {
  const teams = tournamentDb.getTeams();
  const players = tournamentDb.getPlayers();
  const matches = tournamentDb.getMatches();

  return `<!DOCTYPE html>
<html lang="es" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Liga Fronteo Obelisco 2026 - Oficial</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Teko:wght@600;700&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
            heading: ['"Chakra Petch"', 'sans-serif'],
            score: ['"Teko"', 'sans-serif'],
          },
          colors: {
            brand: {
              gold: '#fbbf24',
              emerald: '#10b981',
              cyan: '#06b6d4',
              navy: '#0b1329',
              card: '#0f172a',
            }
          }
        }
      }
    }
  </script>
  <style>
    body { background-color: #030712; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; }
    .font-heading { font-family: 'Chakra Petch', sans-serif; }
    .font-score { font-family: 'Teko', sans-serif; letter-spacing: 0.05em; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: #030712; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 9999px; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
  <div id="app" class="flex-1 flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/10 px-4 py-3">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-950 border border-emerald-400/40 flex items-center justify-center font-bold text-emerald-300">
            ⚽
          </div>
          <div>
            <h1 class="text-base sm:text-lg font-bold font-heading uppercase tracking-wider text-white">LIGA FRONTEO OBELISCO</h1>
            <p class="text-xs text-emerald-400 font-semibold tracking-widest">TEMPORADA OFICIAL 2026</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            En Vivo
          </span>
        </div>
      </div>
    </header>

    <!-- Navigation tabs -->
    <nav class="bg-slate-900/60 border-b border-white/5 sticky top-[57px] z-30 px-4">
      <div class="max-w-7xl mx-auto flex gap-1 sm:gap-2 overflow-x-auto py-2">
        <button onclick="setTab('fixture')" id="tab-fixture" class="tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap bg-cyan-500 text-slate-950">🏆 Fixture & Partidos</button>
        <button onclick="setTab('posiciones')" id="tab-posiciones" class="tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap text-slate-400 hover:text-white">📊 Tabla Posiciones</button>
        <button onclick="setTab('goleadores')" id="tab-goleadores" class="tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap text-slate-400 hover:text-white">⚽ Botín de Oro</button>
        <button onclick="setTab('equipos')" id="tab-equipos" class="tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap text-slate-400 hover:text-white">🛡️ Equipos y Plantillas</button>
        <button onclick="setTab('admin')" id="tab-admin" class="tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap text-slate-400 hover:text-white">⚙️ Panel Admin</button>
      </div>
    </nav>

    <!-- Main Container -->
    <main class="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1">
      <div id="content-view"></div>
    </main>
  </div>

  <script>
    // State
    const DB = {
      teams: ${JSON.stringify(teams)},
      players: ${JSON.stringify(players)},
      matches: ${JSON.stringify(matches)},
      user: { isAuthenticated: false, email: null, name: null }
    };

    let currentTab = 'fixture';

    function setTab(tab) {
      currentTab = tab;
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = 'tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap text-slate-400 hover:text-white';
      });
      const activeBtn = document.getElementById('tab-' + tab);
      if (activeBtn) {
        activeBtn.className = 'tab-btn px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap bg-cyan-500 text-slate-950 font-bold';
      }
      render();
    }

    function calculateStandings() {
      const map = {};
      DB.teams.forEach(t => {
        map[t.id] = { team: t, pj: 0, pg: 0, pe: 0, pp: 0, gf: 0, gc: 0, dg: 0, pts: 0 };
      });

      DB.matches.filter(m => m.status === 'FINISHED' && m.homeScore !== null).forEach(m => {
        const h = map[m.homeTeamId];
        const a = map[m.awayTeamId];
        if (!h || !a) return;
        h.pj++; a.pj++;
        h.gf += m.homeScore; h.gc += m.awayScore; h.dg = h.gf - h.gc;
        a.gf += m.awayScore; a.gc += m.homeScore; a.dg = a.gf - a.gc;

        if (m.homeScore > m.awayScore) {
          h.pg++; h.pts += 3; a.pp++;
        } else if (m.homeScore < m.awayScore) {
          a.pg++; a.pts += 3; h.pp++;
        } else {
          h.pe++; a.pe++; h.pts += 1; a.pts += 1;
        }
      });

      return Object.values(map).sort((a,b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf);
    }

    function render() {
      const container = document.getElementById('content-view');
      if (currentTab === 'fixture') {
        renderFixture(container);
      } else if (currentTab === 'posiciones') {
        renderStandings(container);
      } else if (currentTab === 'goleadores') {
        renderScorers(container);
      } else if (currentTab === 'equipos') {
        renderTeams(container);
      } else if (currentTab === 'admin') {
        renderAdmin(container);
      }
    }

    function getTeam(id) {
      return DB.teams.find(t => t.id === id) || { name: 'Desconocido', shortName: '???' };
    }

    function renderFixture(container) {
      let html = '<div class="space-y-4">';
      html += '<div class="flex items-center justify-between"><h2 class="text-xl font-bold font-heading text-white">Fixture y Calendario Oficial</h2></div>';
      html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
      DB.matches.forEach(m => {
        const h = getTeam(m.homeTeamId);
        const a = getTeam(m.awayTeamId);
        const isLive = m.status === 'LIVE';
        const isFinished = m.status === 'FINISHED';
        html += '<div class="bg-slate-900/80 border border-white/10 rounded-2xl p-4 hover:border-cyan-500/40 transition">';
        html += '<div class="flex items-center justify-between text-xs text-slate-400 mb-3">';
        html += '<span>Jornada ' + m.round + ' • ' + m.date + ' ' + m.time + '</span>';
        if (isLive) {
          html += '<span class="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-bold animate-pulse">EN VIVO</span>';
        } else if (isFinished) {
          html += '<span class="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold">FINAL</span>';
        } else {
          html += '<span class="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold">PROGRAMADO</span>';
        }
        html += '</div>';

        html += '<div class="flex items-center justify-between my-2">';
        html += '<div class="flex-1 text-right font-bold text-sm sm:text-base pr-3">' + h.name + '</div>';
        html += '<div class="px-3 py-1 bg-slate-950 border border-white/10 rounded-xl font-score text-xl sm:text-2xl text-cyan-400 font-bold min-w-[64px] text-center">';
        html += (m.homeScore !== null ? m.homeScore : '-') + ' : ' + (m.awayScore !== null ? m.awayScore : '-');
        html += '</div>';
        html += '<div class="flex-1 text-left font-bold text-sm sm:text-base pl-3">' + a.name + '</div>';
        html += '</div>';

        html += '<div class="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">';
        html += '<div>🏟️ <span class="text-slate-300">' + m.court + '</span></div>';
        html += '<div>⚖️ Árbitro: <span class="text-emerald-400 font-semibold">' + (m.referee || 'Por designar') + '</span></div>';
        html += '</div>';
        html += '</div>';
      });
      html += '</div></div>';
      container.innerHTML = html;
    }

    function renderStandings(container) {
      const standings = calculateStandings();
      let html = '<div class="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden">';
      html += '<div class="p-4 border-b border-white/10 flex items-center justify-between">';
      html += '<h2 class="text-lg font-bold font-heading text-white">Tabla General de Clasificación</h2>';
      html += '<span class="text-xs text-slate-400">Liga Inicial 2026</span>';
      html += '</div>';
      html += '<div class="overflow-x-auto"><table class="w-full text-left text-sm">';
      html += '<thead class="bg-slate-950/60 text-xs text-slate-400 uppercase font-semibold">';
      html += '<tr><th class="p-3 text-center">#</th><th class="p-3">Equipo</th><th class="p-3 text-center">PJ</th><th class="p-3 text-center">G</th><th class="p-3 text-center">E</th><th class="p-3 text-center">P</th><th class="p-3 text-center">GF</th><th class="p-3 text-center">GC</th><th class="p-3 text-center">DG</th><th class="p-3 text-center font-bold text-white">PTS</th></tr>';
      html += '</thead><tbody class="divide-y divide-white/5">';
      standings.forEach((s, idx) => {
        const isPlayoffs = idx < 4;
        html += '<tr class="hover:bg-white/[0.02]">';
        html += '<td class="p-3 text-center font-bold ' + (isPlayoffs ? 'text-emerald-400' : 'text-slate-400') + '">' + (idx + 1) + '</td>';
        html += '<td class="p-3 font-bold text-white flex items-center gap-2">' + s.team.name + '</td>';
        html += '<td class="p-3 text-center">' + s.pj + '</td>';
        html += '<td class="p-3 text-center text-emerald-400 font-semibold">' + s.pg + '</td>';
        html += '<td class="p-3 text-center text-amber-400">' + s.pe + '</td>';
        html += '<td class="p-3 text-center text-rose-400">' + s.pp + '</td>';
        html += '<td class="p-3 text-center">' + s.gf + '</td>';
        html += '<td class="p-3 text-center">' + s.gc + '</td>';
        html += '<td class="p-3 text-center font-semibold ' + (s.dg > 0 ? 'text-emerald-400' : s.dg < 0 ? 'text-rose-400' : 'text-slate-400') + '">' + (s.dg > 0 ? '+' : '') + s.dg + '</td>';
        html += '<td class="p-3 text-center font-score text-xl font-bold text-cyan-400">' + s.pts + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div></div>';
      container.innerHTML = html;
    }

    function renderScorers(container) {
      const scorers = DB.players.filter(p => p.goals > 0).sort((a,b) => b.goals - a.goals);
      let html = '<div class="space-y-4">';
      html += '<h2 class="text-xl font-bold font-heading text-white">Ranking de Goleadores (Botín de Oro)</h2>';
      html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">';
      scorers.forEach((p, idx) => {
        const team = getTeam(p.teamId);
        html += '<div class="bg-slate-900/80 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-cyan-500/40 transition">';
        html += '<div class="flex items-center gap-3">';
        html += '<div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ' + (idx === 0 ? 'bg-amber-400 text-slate-950 font-score text-lg' : idx === 1 ? 'bg-slate-300 text-slate-950' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400') + '">' + (idx + 1) + '</div>';
        html += '<div><div class="font-bold text-white text-sm">' + p.name + '</div><div class="text-xs text-slate-400">' + team.name + ' • #' + p.dorsal + '</div></div>';
        html += '</div>';
        html += '<div class="text-right"><div class="font-score text-3xl font-bold text-amber-400">' + p.goals + '</div><div class="text-[10px] uppercase tracking-wider text-slate-400">Goles</div></div>';
        html += '</div>';
      });
      html += '</div></div>';
      container.innerHTML = html;
    }

    function renderTeams(container) {
      let html = '<div class="space-y-4">';
      html += '<h2 class="text-xl font-bold font-heading text-white">Equipos Participantes (12 Clubes)</h2>';
      html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">';
      DB.teams.forEach(t => {
        const teamPlayers = DB.players.filter(p => p.teamId === t.id);
        html += '<div class="bg-slate-900/80 border border-white/10 rounded-2xl p-5 hover:border-cyan-500/40 transition">';
        html += '<div class="flex items-start justify-between mb-3">';
        html += '<div><h3 class="text-lg font-bold text-white font-heading">' + t.name + '</h3><span class="text-xs text-cyan-400 font-semibold">' + t.shortName + '</span></div>';
        html += '<div class="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300">Fundado: ' + t.foundedYear + '</div>';
        html += '</div>';
        html += '<p class="text-xs text-slate-400 mb-3">' + (t.description || '') + '</p>';
        html += '<div class="text-xs space-y-1.5 border-t border-white/5 pt-3 text-slate-300">';
        html += '<div>👑 <strong>Capitán:</strong> ' + t.captainName + '</div>';
        html += '<div>📋 <strong>DT:</strong> ' + t.coach + '</div>';
        html += '<div>🏟️ <strong>Cancha:</strong> ' + t.homeCourt + '</div>';
        html += '<div>👥 <strong>Inscritos:</strong> ' + teamPlayers.length + ' jugadores</div>';
        html += '</div>';
        html += '</div>';
      });
      html += '</div></div>';
      container.innerHTML = html;
    }

    function renderAdmin(container) {
      if (!DB.user.isAuthenticated) {
        let html = '<div class="max-w-md mx-auto text-center py-12 bg-slate-900/80 border border-white/10 rounded-2xl p-6">';
        html += '<div class="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4 text-2xl">🔒</div>';
        html += '<h2 class="text-xl font-bold font-heading text-white mb-2">Panel de Administración</h2>';
        html += '<p class="text-sm text-slate-400 mb-6">Para registrar resultados, agregar jugadores y asignar árbitros, inicia sesión con Google.</p>';
        html += '<button onclick="loginGoogle()" class="w-full py-3 px-4 rounded-xl bg-white text-slate-900 font-bold hover:bg-slate-200 transition flex items-center justify-center gap-3">';
        html += '<svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.27 21.43 7.35 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.17 0 9.98 0 12s.45 3.83 1.25 5.42l4.03-3.1z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"/></svg>';
        html += 'Iniciar Sesión con Google';
        html += '</button>';
        html += '</div>';
        container.innerHTML = html;
        return;
      }

      let html = '<div class="space-y-6">';
      html += '<div class="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-white/10">';
      html += '<div class="flex items-center gap-3"><div><div class="text-sm font-bold text-white">' + DB.user.name + '</div><div class="text-xs text-slate-400">' + DB.user.email + ' • Administrador Oficial</div></div></div>';
      html += '<button onclick="logout()" class="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold hover:bg-rose-500/30">Cerrar Sesión</button>';
      html += '</div>';

      html += '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">';
      
      // Form 1: Match result
      html += '<div class="bg-slate-900/80 border border-white/10 rounded-2xl p-5">';
      html += '<h3 class="text-base font-bold text-white font-heading mb-3">1. Registrar Resultado</h3>';
      html += '<form onsubmit="handleSaveResult(event)" class="space-y-3">';
      html += '<div><label class="block text-xs text-slate-400 mb-1">Seleccionar Partido</label><select id="admin-match-select" class="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white">';
      DB.matches.forEach(m => {
        const h = getTeam(m.homeTeamId);
        const a = getTeam(m.awayTeamId);
        html += '<option value="' + m.id + '">J' + m.round + ': ' + h.name + ' vs ' + a.name + ' (' + m.status + ')</option>';
      });
      html += '</select></div>';
      html += '<div class="grid grid-cols-2 gap-2">';
      html += '<div><label class="block text-xs text-slate-400 mb-1">Goles Local</label><input type="number" min="0" id="admin-home-goals" required class="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white" value="2"></div>';
      html += '<div><label class="block text-xs text-slate-400 mb-1">Goles Visitante</label><input type="number" min="0" id="admin-away-goals" required class="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white" value="1"></div>';
      html += '</div>';
      html += '<button type="submit" class="w-full py-2 bg-emerald-500 text-slate-950 rounded-lg font-bold text-xs hover:bg-emerald-400 transition">Guardar Resultado y Actualizar Tabla</button>';
      html += '</form></div>';

      // Form 2: Add Player
      html += '<div class="bg-slate-900/80 border border-white/10 rounded-2xl p-5">';
      html += '<h3 class="text-base font-bold text-white font-heading mb-3">2. Inscribir Jugador</h3>';
      html += '<form onsubmit="handleAddPlayer(event)" class="space-y-3">';
      html += '<div><label class="block text-xs text-slate-400 mb-1">Equipo</label><select id="admin-player-team" class="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white">';
      DB.teams.forEach(t => {
        html += '<option value="' + t.id + '">' + t.name + '</option>';
      });
      html += '</select></div>';
      html += '<div><label class="block text-xs text-slate-400 mb-1">Nombre Completo</label><input type="text" id="admin-player-name" required placeholder="Ej. Carlos Valderrama" class="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white"></div>';
      html += '<div class="grid grid-cols-2 gap-2">';
      html += '<div><label class="block text-xs text-slate-400 mb-1">Dorsal (#)</label><input type="number" min="1" max="99" id="admin-player-dorsal" required class="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white" value="10"></div>';
      html += '<div><label class="block text-xs text-slate-400 mb-1">Posición</label><select id="admin-player-pos" class="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white"><option value="POR">Portero</option><option value="DEF">Defensa</option><option value="MED" selected>Medio</option><option value="DEL">Delantero</option></select></div>';
      html += '</div>';
      html += '<button type="submit" class="w-full py-2 bg-cyan-500 text-slate-950 rounded-lg font-bold text-xs hover:bg-cyan-400 transition">Inscribir Jugador</button>';
      html += '</form></div>';

      // Form 3: Assign Referee
      html += '<div class="bg-slate-900/80 border border-white/10 rounded-2xl p-5">';
      html += '<h3 class="text-base font-bold text-white font-heading mb-3">3. Asignar Árbitro</h3>';
      html += '<form onsubmit="handleAssignReferee(event)" class="space-y-3">';
      html += '<div><label class="block text-xs text-slate-400 mb-1">Partido</label><select id="admin-ref-match" class="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white">';
      DB.matches.forEach(m => {
        const h = getTeam(m.homeTeamId);
        const a = getTeam(m.awayTeamId);
        html += '<option value="' + m.id + '">J' + m.round + ': ' + h.name + ' vs ' + a.name + '</option>';
      });
      html += '</select></div>';
      html += '<div><label class="block text-xs text-slate-400 mb-1">Nombre del Árbitro</label><input type="text" id="admin-ref-name" required placeholder="Ej. Wilmar Roldán" class="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white"></div>';
      html += '<div><label class="block text-xs text-slate-400 mb-1">Cancha Asignada</label><input type="text" id="admin-ref-court" placeholder="Ej. Cancha Central Obelisco" class="w-full bg-slate-950 border border-white/10 rounded-lg p-2 text-xs text-white"></div>';
      html += '<button type="submit" class="w-full py-2 bg-amber-500 text-slate-950 rounded-lg font-bold text-xs hover:bg-amber-400 transition">Actualizar Designación</button>';
      html += '</form></div>';

      html += '</div></div>';
      container.innerHTML = html;
    }

    function loginGoogle() {
      DB.user = {
        isAuthenticated: true,
        email: 'jhonfrancocuicas@gmail.com',
        name: 'Jhon Franco Cuicas'
      };
      render();
    }

    function logout() {
      DB.user = { isAuthenticated: false, email: null, name: null };
      render();
    }

    function handleSaveResult(e) {
      e.preventDefault();
      const matchId = document.getElementById('admin-match-select').value;
      const hG = parseInt(document.getElementById('admin-home-goals').value, 10);
      const aG = parseInt(document.getElementById('admin-away-goals').value, 10);

      const m = DB.matches.find(item => item.id === matchId);
      if (m) {
        m.homeScore = hG;
        m.awayScore = aG;
        m.status = 'FINISHED';
        alert('¡Resultado guardado con éxito! La tabla de posiciones se ha actualizado en tiempo real.');
        setTab('posiciones');
      }
    }

    function handleAddPlayer(e) {
      e.preventDefault();
      const teamId = document.getElementById('admin-player-team').value;
      const name = document.getElementById('admin-player-name').value;
      const dorsal = parseInt(document.getElementById('admin-player-dorsal').value, 10);
      const position = document.getElementById('admin-player-pos').value;

      DB.players.push({
        id: 'p-' + Date.now(),
        teamId: teamId,
        name: name,
        dorsal: dorsal,
        position: position,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      });

      alert('¡Jugador "' + name + '" inscrito exitosamente en la plantilla!');
      setTab('equipos');
    }

    function handleAssignReferee(e) {
      e.preventDefault();
      const matchId = document.getElementById('admin-ref-match').value;
      const ref = document.getElementById('admin-ref-name').value;
      const court = document.getElementById('admin-ref-court').value;

      const m = DB.matches.find(item => item.id === matchId);
      if (m) {
        m.referee = ref;
        if (court) m.court = court;
        alert('¡Árbitro asignado con éxito a la jornada!');
        setTab('fixture');
      }
    }

    // Initialize
    render();
  </script>
</body>
</html>`;
}
