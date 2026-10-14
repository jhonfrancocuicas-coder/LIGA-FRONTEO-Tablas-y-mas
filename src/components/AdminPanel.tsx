import React, { useState } from 'react';
import { Match, Team, Player, UserSession, GoalEvent, PlayerPosition } from '../types/tournament';
import { tournamentDb } from '../services/db';
import { authService } from '../services/auth';
import { generateSingleFileHtml } from '../services/exporter';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  UserPlus,
  Flag,
  PlusCircle,
  Database,
  Download,
  RefreshCw,
  LogOut,
  Sparkles,
  AlertCircle,
  IdCard,
  Phone,
  Trash2,
  Users,
} from 'lucide-react';

interface AdminPanelProps {
  userSession: UserSession;
  teams: Team[];
  matches: Match[];
  players: Player[];
  onDataChanged: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  userSession,
  teams,
  matches,
  players,
  onDataChanged,
  onNavigateToTab,
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'player' | 'result' | 'referee' | 'rosterList' | 'newMatch' | 'database'>('player');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- Form 1: Result state ---
  const [selectedMatchId, setSelectedMatchId] = useState<string>(matches[0]?.id || '');
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [matchStatus, setMatchStatus] = useState<'FINISHED' | 'LIVE' | 'SCHEDULED'>('FINISHED');
  const [matchReferee, setMatchReferee] = useState<string>('');
  const [matchCourt, setMatchCourt] = useState<string>('');
  const [scorersList, setScorersList] = useState<GoalEvent[]>([]);

  // Temp Scorer state
  const [newScorerPlayerId, setNewScorerPlayerId] = useState<string>('');
  const [newScorerMinute, setNewScorerMinute] = useState<number>(15);
  const [newScorerIsPenalty, setNewScorerIsPenalty] = useState<boolean>(false);

  // --- Form 2: Player state (Expanded with DNI, Phone, Birthdate, Photo/Avatar) ---
  const [playerTeamId, setPlayerTeamId] = useState<string>(teams[0]?.id || '');
  const [playerName, setPlayerName] = useState<string>('');
  const [playerDni, setPlayerDni] = useState<string>('');
  const [playerBirthDate, setPlayerBirthDate] = useState<string>('2002-05-15');
  const [playerAge, setPlayerAge] = useState<number>(24);
  const [playerDorsal, setPlayerDorsal] = useState<number>(10);
  const [playerPosition, setPlayerPosition] = useState<PlayerPosition>('ALA');
  const [playerPhone, setPlayerPhone] = useState<string>('');
  const [playerPhotoUrl, setPlayerPhotoUrl] = useState<string>('⚽');
  const [playerIsCaptain, setPlayerIsCaptain] = useState<boolean>(false);

  // Filter for roster directory
  const [directoryTeamFilter, setDirectoryTeamFilter] = useState<string>('ALL');

  // --- Form 3: Referee Assignment state ---
  const [refMatchId, setRefMatchId] = useState<string>(matches[0]?.id || '');
  const [refereeName, setRefereeName] = useState<string>('Carlos Ramos (Colegio Oficial)');
  const [assignedCourt, setAssignedCourt] = useState<string>('Cancha Central Obelisco');
  const [matchDate, setMatchDate] = useState<string>('2026-10-24');
  const [matchTime, setMatchTime] = useState<string>('18:00');

  // --- Form 4: New Match state ---
  const [newRound, setNewRound] = useState<number>(4);
  const [newHomeTeamId, setNewHomeTeamId] = useState<string>(teams[0]?.id || '');
  const [newAwayTeamId, setNewAwayTeamId] = useState<string>(teams[1]?.id || '');
  const [newDate, setNewDate] = useState<string>('2026-11-14');
  const [newTime, setNewTime] = useState<string>('19:00');
  const [newCourt, setNewCourt] = useState<string>('Cancha Central Obelisco');
  const [newReferee, setNewReferee] = useState<string>('Por designar');

  // Match squads for goal scoring
  const currentMatch = matches.find((m) => m.id === selectedMatchId) || matches[0];
  const homeTeam = currentMatch ? teams.find((t) => t.id === currentMatch.homeTeamId) : null;
  const awayTeam = currentMatch ? teams.find((t) => t.id === currentMatch.awayTeamId) : null;
  const matchSquad = [
    ...(homeTeam ? players.filter((p) => p.teamId === homeTeam.id) : []),
    ...(awayTeam ? players.filter((p) => p.teamId === awayTeam.id) : []),
  ];

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 6000);
  };

  // Real Google Sign-In Action via Firebase Auth
  const handleRealGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const res = await authService.loginWithGoogleReal();
      if (!res.success) {
        setLoginError(res.error || 'No se pudo completar el inicio de sesión.');
      } else {
        showNotification(`¡Sesión iniciada con éxito! Bienvenido, ${res.session?.name}.`);
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Error inesperado durante el inicio de sesión con Google.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    showNotification('Has cerrado tu sesión de Google.');
  };

  // Calculate age from birthdate
  const handleBirthDateChange = (val: string) => {
    setPlayerBirthDate(val);
    if (val) {
      const birth = new Date(val);
      const now = new Date();
      let calculatedAge = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
        calculatedAge--;
      }
      if (calculatedAge > 10 && calculatedAge < 65) {
        setPlayerAge(calculatedAge);
      }
    }
  };

  // Form 1 Submit: Save Result
  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId) return;

    tournamentDb.updateMatchResult(
      selectedMatchId,
      homeScore,
      awayScore,
      matchStatus,
      scorersList,
      matchReferee || undefined,
      matchCourt || undefined
    );

    onDataChanged();
    showNotification(
      `¡Resultado oficial guardado! Marcador: ${homeTeam?.name} ${homeScore} - ${awayScore} ${awayTeam?.name}. La Tabla de Posiciones y Goleadores se han actualizado en tiempo real.`
    );
    setScorersList([]);
  };

  // Add goal event to match
  const handleAddGoalEvent = () => {
    if (!newScorerPlayerId) return;
    const player = players.find((p) => p.id === newScorerPlayerId);
    if (!player) return;

    const event: GoalEvent = {
      id: `g-${Date.now()}-${Math.random()}`,
      playerId: player.id,
      playerName: player.name,
      teamId: player.teamId,
      minute: newScorerMinute,
      isPenalty: newScorerIsPenalty,
    };

    setScorersList([...scorersList, event]);
    setNewScorerMinute(newScorerMinute + 5);
  };

  // Form 2 Submit: Add Player with full official athletic card fields
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !playerTeamId || !playerDni.trim()) {
      alert('Por favor completa los campos obligatorios: Nombre, Cédula (C.I./DNI) y Equipo.');
      return;
    }

    const created = tournamentDb.addPlayer({
      teamId: playerTeamId,
      name: playerName.trim(),
      dni: playerDni.trim(),
      birthDate: playerBirthDate,
      age: playerAge,
      dorsal: playerDorsal,
      position: playerPosition,
      phone: playerPhone.trim(),
      photoUrl: playerPhotoUrl,
      isCaptain: playerIsCaptain,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
    });

    onDataChanged();
    const team = teams.find((t) => t.id === playerTeamId);
    showNotification(
      `¡Atleta ${created.name} (C.I. ${created.dni}) registrado exitosamente con el dorsal #${created.dorsal} en ${team?.name}!`
    );

    // Reset inputs for next player
    setPlayerName('');
    setPlayerDni('');
    setPlayerPhone('');
    setPlayerDorsal(playerDorsal + 1);
    setPlayerIsCaptain(false);
  };

  // Delete player
  const handleDeletePlayer = (playerId: string, name: string) => {
    if (confirm(`¿Estás seguro de que deseas dar de baja al jugador "${name}" de la plantilla?`)) {
      tournamentDb.deletePlayer(playerId);
      onDataChanged();
      showNotification(`Jugador "${name}" eliminado de la nómina.`);
    }
  };

  // Form 3 Submit: Assign Referee & Court
  const handleAssignReferee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refMatchId || !refereeName.trim()) return;

    tournamentDb.updateMatchAssignment(refMatchId, refereeName.trim(), assignedCourt.trim(), matchDate, matchTime);
    onDataChanged();
    showNotification(
      `¡Designación arbitral actualizada! Árbitro: ${refereeName} • Cancha: ${assignedCourt}.`
    );
  };

  // Form 4 Submit: Create New Match
  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHomeTeamId === newAwayTeamId) {
      alert('El equipo local y visitante no pueden ser el mismo.');
      return;
    }

    tournamentDb.createMatch({
      round: newRound,
      homeTeamId: newHomeTeamId,
      awayTeamId: newAwayTeamId,
      homeScore: null,
      awayScore: null,
      status: 'SCHEDULED',
      date: newDate,
      time: newTime,
      court: newCourt,
      referee: newReferee,
    });

    onDataChanged();
    showNotification(`¡Nuevo partido programado para la Jornada ${newRound} agregado al Fixture!`);
  };

  // Database tools
  const handleExportJson = () => {
    const dataStr = tournamentDb.exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_liga_fronteo_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadStandalone = () => {
    const html = generateSingleFileHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'liga-fronteo-obelisco-2026.html';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Archivo index.html listo para GitHub Pages descargado con éxito.');
  };

  const handleResetDb = () => {
    if (
      confirm(
        '¿Confirmas el REINICIO COMPLETO DE DATOS (Empate a cero) de la Liga Fronteo Obelisco 2026? Se vaciarán marcadores y goles previos.'
      )
    ) {
      tournamentDb.resetToFactory();
      onDataChanged();
      showNotification('¡Reinicio completado! Todos los equipos en 0 puntos y tabla de goleadores vacía.');
    }
  };

  // Filtered players for directory
  const filteredDirectoryPlayers = players.filter((p) => {
    if (directoryTeamFilter === 'ALL') return true;
    return p.teamId === directoryTeamFilter;
  });

  // Quick Emoji Icons for Avatar Selector
  const avatarOptions = ['⚽', '🧤', '⚡', '🦁', '🎯', '🦅', '🐊', '🐺', '👑', '🔥', '🛡️', '⭐'];

  // ===================== IF NOT AUTHENTICATED: REAL GOOGLE SIGN IN REQUIRED =====================
  if (!userSession.isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto py-8 px-4 animate-in fade-in">
        <div className="bg-slate-900/90 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl"></div>

          <div className="text-center relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 flex items-center justify-center mx-auto mb-4 text-cyan-400 shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/10 text-amber-300 border border-amber-400/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Acceso Restringido a Organizadores
            </div>

            <h2 className="text-2xl font-black font-heading text-white">
              Panel de Administración Oficial
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto">
              Para ingresar al sistema y gestionar resultados, inscribir jugadores en las plantillas y asignar árbitros en la base de datos real, inicia sesión con Google.
            </p>
          </div>

          {/* Real Google Sign-in Card */}
          <div className="mt-8 space-y-4">
            {loginError && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-500/40 rounded-2xl text-xs text-rose-300 flex items-start gap-2.5 shadow-lg">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block">Aviso de Inicio de Sesión:</span>
                  <span>{loginError}</span>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={isLoggingIn}
              onClick={handleRealGoogleLogin}
              className={`w-full py-4 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm sm:text-base shadow-xl hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-3 active:scale-98 group cursor-pointer border border-white/20 ${
                isLoggingIn ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-2 text-slate-800">
                  <RefreshCw className="w-5 h-5 animate-spin text-cyan-600" />
                  <span>Conectando con Google...</span>
                </div>
              ) : (
                <>
                  {/* Official Google G Logo */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.27 21.43 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.17 0 9.98 0 12s.45 3.83 1.25 5.42l4.03-3.1z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.57 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z"
                    />
                  </svg>
                  <span className="font-extrabold tracking-wide">
                    Iniciar Sesión con Google
                  </span>
                </>
              )}
            </button>

            {/* Security Guarantee Banner */}
            <div className="bg-slate-950/70 border border-white/5 rounded-2xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-300 font-semibold">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                  Autenticación Oficial de Google
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Firebase Auth
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Al hacer clic, se abrirá la ventana oficial de Google para seleccionar tu cuenta. Solo los administradores autenticados tienen permisos para modificar la base de datos de la Liga Fronteo Obelisco 2026.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 text-center text-xs text-slate-400">
            🔒 Base de datos en la nube conectada con sincronización en tiempo real.
          </div>
        </div>
      </div>
    );
  }

  // ===================== IF AUTHENTICATED: FULL ADMIN & PLAYER REGISTRATION =====================
  return (
    <div className="space-y-6">
      {/* Top Banner & User Profile */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={userSession.avatar || 'https://ui-avatars.com/api/?name=Admin&background=0284c7&color=fff'}
            alt={userSession.name || 'Admin'}
            className="w-12 h-12 rounded-2xl border-2 border-emerald-400 object-cover shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sesión de Google Verificada
              </span>
              <span className="px-2 py-0.2 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ORGANIZADOR OFICIAL
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">{userSession.name}</h2>
            <p className="text-xs text-slate-400 font-mono">{userSession.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successMessage && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 text-emerald-300 text-xs sm:text-sm font-medium flex items-center gap-3 animate-in fade-in shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="flex-1">{successMessage}</div>
        </div>
      )}

      {/* Admin Action Tabs */}
      <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-2 flex gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveAdminSubTab('player')}
          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
            activeAdminSubTab === 'player'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>1. Inscribir Jugadores</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('rosterList')}
          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
            activeAdminSubTab === 'rosterList'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Directorio ({players.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('result')}
          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
            activeAdminSubTab === 'result'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>2. Cargar Resultado</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('referee')}
          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
            activeAdminSubTab === 'referee'
              ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>3. Asignar Árbitro & Cancha</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('newMatch')}
          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
            activeAdminSubTab === 'newMatch'
              ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>4. Nuevo Partido</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('database')}
          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ml-auto ${
            activeAdminSubTab === 'database'
              ? 'bg-purple-500 text-white font-bold shadow-md shadow-purple-500/20'
              : 'text-purple-300 hover:text-white hover:bg-purple-500/10'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Base de Datos</span>
        </button>
      </div>

      {/* ===================== TAB 1: FORMULARIO COMPLETO DE INSCRIPCIÓN DE JUGADORES ===================== */}
      {activeAdminSubTab === 'player' && (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                Módulo Oficial de Registro de Atletas
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ingresa los datos obligatorios para formalizar la inscripción en la base de datos de la Liga Fronteo Obelisco 2026.
            </p>
          </div>

          <form onSubmit={handleAddPlayer} className="space-y-4">
            {/* Row 1: Equipo y Nombre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  1. Club / Equipo Asignado *
                </label>
                <select
                  value={playerTeamId}
                  onChange={(e) => setPlayerTeamId(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.shortName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  2. Nombre Completo del Jugador *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Roberto 'Tigre' Gómez"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Row 2: Cédula, Fecha Nacimiento, Edad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 flex items-center gap-1">
                  <IdCard className="w-3.5 h-3.5 text-cyan-400" />
                  3. Cédula de Identidad (C.I. / DNI) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. V-27.892.415"
                  value={playerDni}
                  onChange={(e) => setPlayerDni(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  4. Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={playerBirthDate}
                  onChange={(e) => handleBirthDateChange(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  5. Edad (Años)
                </label>
                <input
                  type="number"
                  min="14"
                  max="60"
                  required
                  value={playerAge}
                  onChange={(e) => setPlayerAge(parseInt(e.target.value, 10) || 20)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Row 3: Dorsal, Posición, Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  6. Número de Camiseta (Dorsal 1-99) *
                </label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  required
                  value={playerDorsal}
                  onChange={(e) => setPlayerDorsal(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white font-score text-xl font-bold text-amber-400 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  7. Posición Táctica *
                </label>
                <select
                  value={playerPosition}
                  onChange={(e) => setPlayerPosition(e.target.value as PlayerPosition)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="POR">🧤 Portero / Guardameta (POR)</option>
                  <option value="CIE">🛡️ Cierre / Defensor Central (CIE)</option>
                  <option value="ALA">⚡ Ala / Volante Lateral (ALA)</option>
                  <option value="PIV">🎯 Pívot / Delantero de Área (PIV)</option>
                  <option value="DEF">Defensa (DEF)</option>
                  <option value="MED">Mediocampista (MED)</option>
                  <option value="DEL">Delantero (DEL)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  8. Teléfono / Contacto (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. +58 412 1234567"
                  value={playerPhone}
                  onChange={(e) => setPlayerPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Row 4: Avatar / Foto Selector & Capitán */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-2">
                  9. Foto o Avatar del Jugador
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setPlayerPhotoUrl(emoji)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition border ${
                        playerPhotoUrl === emoji
                          ? 'bg-cyan-500/20 border-cyan-400 scale-110 shadow-md'
                          : 'bg-slate-900 border-white/10 hover:bg-slate-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="O ingresa URL de imagen (opcional)"
                  value={playerPhotoUrl.startsWith('http') ? playerPhotoUrl : ''}
                  onChange={(e) => setPlayerPhotoUrl(e.target.value || '⚽')}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-3 p-3 bg-slate-900 rounded-xl border border-white/10 cursor-pointer hover:border-amber-400/40 transition">
                  <input
                    type="checkbox"
                    checked={playerIsCaptain}
                    onChange={(e) => setPlayerIsCaptain(e.target.checked)}
                    className="w-5 h-5 rounded bg-slate-950 border-white/20 text-amber-500 focus:ring-0"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      👑 Designar como Capitán Oficial del Equipo
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Actualizará automáticamente la capitanía en la ficha del club.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm sm:text-base rounded-xl transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-5 h-5" />
              <span>Guardar e Inscribir Atleta en la Base de Datos</span>
            </button>
          </form>
        </div>
      )}

      {/* ===================== TAB: DIRECTORIO DE JUGADORES REGISTRADOS ===================== */}
      {activeAdminSubTab === 'rosterList' && (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Directorio General de Jugadores Registrados
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Total de {players.length} atletas inscritos en el sistema.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Filtrar por Club:</label>
              <select
                value={directoryTeamFilter}
                onChange={(e) => setDirectoryTeamFilter(e.target.value)}
                className="bg-slate-950 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
              >
                <option value="ALL">Todos los Equipos</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredDirectoryPlayers.length === 0 ? (
            <div className="p-10 text-center bg-slate-950/40 rounded-2xl border border-white/5 space-y-2">
              <p className="text-sm text-slate-400">No hay jugadores registrados con este filtro.</p>
              <button
                onClick={() => setActiveAdminSubTab('player')}
                className="px-4 py-2 bg-cyan-500 text-slate-950 rounded-xl text-xs font-bold"
              >
                Inscribir Primer Jugador
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-950 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10 font-bold">
                  <tr>
                    <th className="py-2.5 px-3 text-center">#</th>
                    <th className="py-2.5 px-4">JUGADOR</th>
                    <th className="py-2.5 px-3">C.I. / DNI</th>
                    <th className="py-2.5 px-3">EQUIPO</th>
                    <th className="py-2.5 px-3 text-center">POS</th>
                    <th className="py-2.5 px-3 text-center">EDAD</th>
                    <th className="py-2.5 px-3">TELÉFONO</th>
                    <th className="py-2.5 px-3 text-center text-amber-400">GOLES</th>
                    <th className="py-2.5 px-3 text-center">ACCIONES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {filteredDirectoryPlayers.map((player) => {
                    const team = teams.find((t) => t.id === player.teamId);
                    return (
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
                        <td className="py-2.5 px-3 font-semibold text-slate-200">
                          {team?.name || 'Equipo'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-cyan-300">
                            {player.position}
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
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleDeletePlayer(player.id, player.name)}
                            className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-lg transition"
                            title="Eliminar de la nómina"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 2: CARGAR RESULTADO OFICIAL ===================== */}
      {activeAdminSubTab === 'result' && (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="mb-6">
            <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Cargar / Actualizar Resultado Oficial
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Al guardar el marcador, la Tabla de Posiciones y la Tabla de Goleadores (Botín de Oro) se actualizan automáticamente en tiempo real.
            </p>
          </div>

          <form onSubmit={handleSaveResult} className="space-y-6">
            {/* Match Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Selecciona el Partido del Fixture
              </label>
              <select
                value={selectedMatchId}
                onChange={(e) => {
                  setSelectedMatchId(e.target.value);
                  setScorersList([]);
                }}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white font-medium focus:outline-none focus:border-emerald-400"
              >
                {matches.map((m) => {
                  const h = teams.find((t) => t.id === m.homeTeamId);
                  const a = teams.find((t) => t.id === m.awayTeamId);
                  return (
                    <option key={m.id} value={m.id}>
                      Jornada {m.round}: {h?.name} vs {a?.name} ({m.date} - {m.court}) • [{m.status}]
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Score inputs */}
            <div className="bg-slate-950/60 border border-white/5 rounded-2xl p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-center">
                {/* Home */}
                <div className="space-y-2">
                  <div className="text-sm font-bold text-white">{homeTeam?.name || 'Local'}</div>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    required
                    value={homeScore}
                    onChange={(e) => setHomeScore(parseInt(e.target.value, 10) || 0)}
                    className="w-24 text-center bg-slate-900 border border-white/20 rounded-xl py-2 font-score text-3xl font-bold text-emerald-400 focus:outline-none focus:border-emerald-400 mx-auto"
                  />
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Goles Local</div>
                </div>

                {/* Status selector */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 block font-semibold">Estado del Partido</span>
                  <select
                    value={matchStatus}
                    onChange={(e) => setMatchStatus(e.target.value as any)}
                    className="bg-slate-900 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white font-bold mx-auto focus:outline-none focus:border-emerald-400"
                  >
                    <option value="FINISHED">FINALIZADO</option>
                    <option value="LIVE">EN VIVO</option>
                    <option value="SCHEDULED">PROGRAMADO</option>
                  </select>
                </div>

                {/* Away */}
                <div className="space-y-2">
                  <div className="text-sm font-bold text-white">{awayTeam?.name || 'Visita'}</div>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    required
                    value={awayScore}
                    onChange={(e) => setAwayScore(parseInt(e.target.value, 10) || 0)}
                    className="w-24 text-center bg-slate-900 border border-white/20 rounded-xl py-2 font-score text-3xl font-bold text-cyan-400 focus:outline-none focus:border-cyan-400 mx-auto"
                  />
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Goles Visita</div>
                </div>
              </div>
            </div>

            {/* Goal assignment to registered players */}
            <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>⚽</span> Asignar Autores de los Goles a Jugadores Inscritos
                </span>
                <span className="text-[11px] text-slate-400">
                  {scorersList.length} gol(es) cargados en este partido
                </span>
              </div>

              {matchSquad.length === 0 ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
                  ⚠️ Ninguno de los dos equipos ({homeTeam?.name} o {awayTeam?.name}) tiene jugadores inscritos aún. Puedes inscribir atletas en la pestaña <strong>&quot;1. Inscribir Jugadores&quot;</strong> para asignarles los goles individuales.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-6">
                    <select
                      value={newScorerPlayerId}
                      onChange={(e) => setNewScorerPlayerId(e.target.value)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white"
                    >
                      <option value="">-- Seleccionar Jugador Inscrito --</option>
                      {matchSquad.map((p) => {
                        const t = teams.find((item) => item.id === p.teamId);
                        return (
                          <option key={p.id} value={p.id}>
                            #{p.dorsal} {p.name} ({t?.shortName} - C.I. {p.dni || 'S/D'})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Minuto"
                      value={newScorerMinute}
                      onChange={(e) => setNewScorerMinute(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-slate-900 border border-white/10 rounded-xl p-2.5 text-xs text-white text-center"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-center">
                    <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newScorerIsPenalty}
                        onChange={(e) => setNewScorerIsPenalty(e.target.checked)}
                        className="rounded bg-slate-900 border-white/20 text-emerald-500"
                      />
                      <span>¿Penal?</span>
                    </label>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddGoalEvent}
                      className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition"
                    >
                      + Anotar Gol
                    </button>
                  </div>
                </div>
              )}

              {/* Added Scorers list */}
              {scorersList.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {scorersList.map((g, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold"
                    >
                      ⚽ {g.playerName} ({g.minute}&apos;) {g.isPenalty ? '[P]' : ''}
                      <button
                        type="button"
                        onClick={() => setScorersList(scorersList.filter((_, idx) => idx !== i))}
                        className="text-amber-300 hover:text-white ml-1 font-bold text-sm"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm sm:text-base rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Guardar Resultado Oficial y Actualizar Todo</span>
            </button>
          </form>
        </div>
      )}

      {/* ===================== TAB 3: ASIGNAR ÁRBITRO Y CANCHA ===================== */}
      {activeAdminSubTab === 'referee' && (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="mb-6">
            <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Flag className="w-5 h-5 text-amber-400" />
              Asignación Arbitral y Sedes
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Designa el juez central y la cancha de juego para los encuentros programados de la liga.
            </p>
          </div>

          <form onSubmit={handleAssignReferee} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                Selecciona el Partido
              </label>
              <select
                value={refMatchId}
                onChange={(e) => setRefMatchId(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white"
              >
                {matches.map((m) => {
                  const h = teams.find((t) => t.id === m.homeTeamId);
                  const a = teams.find((t) => t.id === m.awayTeamId);
                  return (
                    <option key={m.id} value={m.id}>
                      Jornada {m.round}: {h?.name} vs {a?.name} • Árbitro actual: {m.referee}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Árbitro Principal Designado
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Wilmar Roldán"
                  value={refereeName}
                  onChange={(e) => setRefereeName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Cancha / Escenario Asignado
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cancha Central Obelisco"
                  value={assignedCourt}
                  onChange={(e) => setAssignedCourt(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Fecha del Encuentro
                </label>
                <input
                  type="date"
                  required
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Hora Oficial
                </label>
                <input
                  type="time"
                  required
                  value={matchTime}
                  onChange={(e) => setMatchTime(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Flag className="w-5 h-5" />
              <span>Confirmar Designación Arbitral</span>
            </button>
          </form>
        </div>
      )}

      {/* ===================== TAB 4: PROGRAMAR NUEVO PARTIDO ===================== */}
      {activeAdminSubTab === 'newMatch' && (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
          <div className="mb-6">
            <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Programar Nuevo Partido en el Fixture
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Añade una nueva fecha o jornada al calendario oficial de la temporada 2026.
            </p>
          </div>

          <form onSubmit={handleCreateMatch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Jornada #
                </label>
                <input
                  type="number"
                  min="1"
                  max="22"
                  required
                  value={newRound}
                  onChange={(e) => setNewRound(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Equipo Local
                </label>
                <select
                  value={newHomeTeamId}
                  onChange={(e) => setNewHomeTeamId(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Equipo Visitante
                </label>
                <select
                  value={newAwayTeamId}
                  onChange={(e) => setNewAwayTeamId(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Fecha
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Hora
                </label>
                <input
                  type="time"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Cancha Asignada
                </label>
                <input
                  type="text"
                  required
                  value={newCourt}
                  onChange={(e) => setNewCourt(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Árbitro Principal
                </label>
                <input
                  type="text"
                  required
                  value={newReferee}
                  onChange={(e) => setNewReferee(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-xs sm:text-sm text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm rounded-xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Programar Encuentro en el Fixture</span>
            </button>
          </form>
        </div>
      )}

      {/* ===================== TAB 5: BASE DE DATOS & EXPORTAR ===================== */}
      {activeAdminSubTab === 'database' && (
        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-6">
          <div>
            <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              Control y Persistencia de la Base de Datos
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Tus datos están sincronizados en tiempo real en Cloud Firestore y en almacenamiento local. Puedes exportar respaldos o descargar la app en un solo archivo HTML.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Standalone HTML for GitHub Pages */}
            <div className="bg-gradient-to-br from-cyan-950/40 to-slate-950 p-5 rounded-2xl border border-cyan-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-2">
                  <Download className="w-4 h-4" />
                  Archivo HTML Único (GitHub Pages)
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  Genera y descarga un solo archivo <code>index.html</code> listo para arrastrar y soltar en GitHub Pages o abrir en cualquier computador o celular.
                </p>
              </div>
              <button
                onClick={handleDownloadStandalone}
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition shadow-md"
              >
                Descargar index.html Autónomo
              </button>
            </div>

            {/* Export JSON Backup */}
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm mb-2">
                  <Download className="w-4 h-4" />
                  Copia de Seguridad (Backup JSON)
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Exporta toda la base de datos actual (12 equipos, nóminas de jugadores, resultados oficiales y fixture) en formato JSON.
                </p>
              </div>
              <button
                onClick={handleExportJson}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition"
              >
                Exportar Backup JSON
              </button>
            </div>

            {/* Reset to Factory Default */}
            <div className="bg-rose-950/20 p-5 rounded-2xl border border-rose-500/20 sm:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-1">
                  <AlertCircle className="w-4 h-4" />
                  Reinicio Completo a Cero (Empate Inicial)
                </div>
                <p className="text-xs text-slate-400">
                  Restaura la tabla de posiciones con todos los equipos en 0 puntos y vacía la tabla de goleadores.
                </p>
              </div>
              <button
                onClick={handleResetDb}
                className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl transition shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                Reiniciar a Cero (0-0)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
