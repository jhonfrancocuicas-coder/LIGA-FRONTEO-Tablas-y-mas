/**
 * Types for Liga Fronteo Obelisco 2026
 */

export type MatchStatus = 'SCHEDULED' | 'LIVE' | 'FINISHED';

export type PlayerPosition = 'POR' | 'CIE' | 'ALA' | 'PIV' | 'DEF' | 'MED' | 'DEL';

export interface Player {
  id: string;
  teamId: string;
  name: string;
  dni: string; // Cédula de Identidad (DNI / C.I.)
  birthDate?: string; // Fecha de Nacimiento
  age: number;
  dorsal: number;
  position: PlayerPosition;
  phone: string; // Teléfono / Contacto
  photoUrl?: string; // Foto o Avatar (URL o icono)
  isCaptain?: boolean;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  registeredAt?: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  captainName: string;
  coach: string;
  homeCourt: string;
  primaryColor: string;
  secondaryColor: string;
  foundedYear: number;
  badgeStyle: 'wolf' | 'alligator' | 'stripes' | 'star' | 'lantern' | 'elite' | 'beast' | 'falcon' | 'lion' | 'shield_ch' | 'new_star' | 'visaje';
  description?: string;
}

export interface GoalEvent {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  minute: number;
  isPenalty?: boolean;
  isOwnGoal?: boolean;
}

export interface Match {
  id: string;
  round: number; // Jornada
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  date: string;
  time: string;
  court: string;
  referee: string;
  scorers: GoalEvent[];
  notes?: string;
}

export interface Standing {
  teamId: string;
  team: Team;
  pj: number; // Partidos Jugados
  pg: number; // Ganados
  pe: number; // Empatados
  pp: number; // Perdidos
  gf: number; // Goles a Favor
  gc: number; // Goles en Contra
  dg: number; // Diferencia de Goles
  pts: number; // Puntos
  form: ('W' | 'D' | 'L')[]; // Últimos partidos
}

export interface UserSession {
  isAuthenticated: boolean;
  email: string | null;
  name: string | null;
  avatar: string | null;
  role: 'ADMIN' | 'CAPTAIN' | 'VISITOR';
  provider: 'google' | 'guest';
}
