import { Team, Player, Match, Standing, GoalEvent } from '../types/tournament';
import { db, handleFirestoreError, OperationType } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

// Official 12 Teams extracted directly from the official poster: Liga Fronteo Obelisco 2026
export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-1',
    name: 'ALPHA',
    shortName: 'ALP',
    captainName: 'Por Definir',
    coach: 'Roberto Méndez',
    homeCourt: 'Cancha Central Obelisco',
    primaryColor: '#7c3aed',
    secondaryColor: '#c084fc',
    foundedYear: 2021,
    badgeStyle: 'wolf',
    description: 'Equipo de alta intensidad y juego colectivo veloz con disciplina táctica.',
  },
  {
    id: 'team-2',
    name: 'CAIMANES FC',
    shortName: 'CAI',
    captainName: 'Por Definir',
    coach: 'Luis Carmona',
    homeCourt: 'Polideportivo Fronteo - Cancha 1',
    primaryColor: '#059669',
    secondaryColor: '#10b981',
    foundedYear: 2019,
    badgeStyle: 'alligator',
    description: 'Defensa sólida como roca y transiciones ofensivas fulminantes.',
  },
  {
    id: 'team-3',
    name: 'CARUCIENA SC',
    shortName: 'CAR',
    captainName: 'Por Definir',
    coach: 'Pietro Moretti',
    homeCourt: 'Complejo Deportivo Norte',
    primaryColor: '#0f172a',
    secondaryColor: '#f8fafc',
    foundedYear: 2018,
    badgeStyle: 'stripes',
    description: 'Estilo clásico tradicional a rayas verticales, posesión pulcra y orden.',
  },
  {
    id: 'team-4',
    name: 'CRISBAN FC',
    shortName: 'CRI',
    captainName: 'Por Definir',
    coach: 'Hernán Silva',
    homeCourt: 'Cancha Las Acacias',
    primaryColor: '#1d4ed8',
    secondaryColor: '#38bdf8',
    foundedYear: 2020,
    badgeStyle: 'star',
    description: 'El poder estelar del torneo, juego dinámico de bandas y remates lejanos.',
  },
  {
    id: 'team-5',
    name: 'DEPORTIVO SIN LUZ',
    shortName: 'DSL',
    captainName: 'Por Definir',
    coach: 'Esteban Paredes',
    homeCourt: 'Estadio Nocturno El Faro',
    primaryColor: '#d97706',
    secondaryColor: '#fbbf24',
    foundedYear: 2022,
    badgeStyle: 'lantern',
    description: 'Expertos en rematar partidos en los minutos finales; nunca bajan los brazos.',
  },
  {
    id: 'team-6',
    name: 'ELITE F.C.',
    shortName: 'ELI',
    captainName: 'Por Definir',
    coach: 'Maximiliano Costa',
    homeCourt: 'Coliseo Don Bosco',
    primaryColor: '#eab308',
    secondaryColor: '#0f172a',
    foundedYear: 2017,
    badgeStyle: 'elite',
    description: 'Uno de los clubes fundadores con palmarés de títulos en futsal y fútbol 7.',
  },
  {
    id: 'team-7',
    name: 'FAMILIS FC',
    shortName: 'FAM',
    captainName: 'Por Definir',
    coach: 'Germán Denis',
    homeCourt: 'Parque La Frontera',
    primaryColor: '#22c55e',
    secondaryColor: '#15803d',
    foundedYear: 2023,
    badgeStyle: 'beast',
    description: 'Jóvenes promesas con energía incansable, presión alta y presión asfixiante.',
  },
  {
    id: 'team-8',
    name: 'HALCONES FC',
    shortName: 'HAL',
    captainName: 'Por Definir',
    coach: 'Matías Almeyda',
    homeCourt: 'Cancha Sintética San José',
    primaryColor: '#dc2626',
    secondaryColor: '#facc15',
    foundedYear: 2019,
    badgeStyle: 'falcon',
    description: 'Juego vertical y aéreo temido en toda la liga, especialistas a balón parado.',
  },
  {
    id: 'team-9',
    name: 'LEONES FC',
    shortName: 'LEO',
    captainName: 'Por Definir',
    coach: 'Claudio Borghi',
    homeCourt: 'Polideportivo Fronteo - Cancha 2',
    primaryColor: '#2563eb',
    secondaryColor: '#60a5fa',
    foundedYear: 2020,
    badgeStyle: 'lion',
    description: 'Garra, corazón y orgullo competitivo. Nunca dan un balón por perdido.',
  },
  {
    id: 'team-10',
    name: 'LOS CHAMOS FC',
    shortName: 'CHA',
    captainName: 'Por Definir',
    coach: 'Rafael Dudamel',
    homeCourt: 'Cancha El Triunfo',
    primaryColor: '#0284c7',
    secondaryColor: '#0f172a',
    foundedYear: 2021,
    badgeStyle: 'shield_ch',
    description: 'Toque corto, alegría en la cancha, gambeta y finalización quirúrgica.',
  },
  {
    id: 'team-11',
    name: 'NEW FC',
    shortName: 'NEW',
    captainName: 'Por Definir',
    coach: 'Marcelo Rossi',
    homeCourt: 'Cancha La Estrella',
    primaryColor: '#e11d48',
    secondaryColor: '#881337',
    foundedYear: 2024,
    badgeStyle: 'new_star',
    description: 'El debutante sensación de 2026 con figuras de élite y refuerzos estelares.',
  },
  {
    id: 'team-12',
    name: 'SPORTING VISAJE',
    shortName: 'VIS',
    captainName: 'Por Definir',
    coach: 'Jorge Sampaoli',
    homeCourt: 'Arena Los Álamos',
    primaryColor: '#06b6d4',
    secondaryColor: '#0891b2',
    foundedYear: 2022,
    badgeStyle: 'visaje',
    description: 'Fútbol total de desmarques impredecibles y remates potentes de media distancia.',
  },
];

// Reinicio Completo: Ningún jugador pre-cargado para permitir registro limpio desde cero
export const INITIAL_PLAYERS: Player[] = [];

// Fixture Oficial de la Temporada 2026 (Todos los partidos programados, sin marcadores previos)
export const INITIAL_MATCHES: Match[] = [
  // JORNADA 1
  {
    id: 'm-1',
    round: 1,
    homeTeamId: 'team-1', // ALPHA
    awayTeamId: 'team-2', // CAIMANES FC
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-10-24',
    time: '18:00',
    court: 'Cancha Central Obelisco',
    referee: 'Carlos Ramos (Colegio Oficial)',
    scorers: [],
    notes: 'Partido Inaugural de la Temporada 2026.',
  },
  {
    id: 'm-2',
    round: 1,
    homeTeamId: 'team-4', // CRISBAN FC
    awayTeamId: 'team-3', // CARUCIENA SC
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-10-24',
    time: '19:30',
    court: 'Polideportivo Fronteo - Cancha 1',
    referee: 'Jesús Valenzuela',
    scorers: [],
  },
  {
    id: 'm-3',
    round: 1,
    homeTeamId: 'team-6', // ELITE F.C.
    awayTeamId: 'team-5', // DEPORTIVO SIN LUZ
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-10-24',
    time: '21:00',
    court: 'Coliseo Don Bosco',
    referee: 'Wilmar Roldán',
    scorers: [],
  },
  {
    id: 'm-4',
    round: 1,
    homeTeamId: 'team-8', // HALCONES FC
    awayTeamId: 'team-7', // FAMILIS FC
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-10-25',
    time: '18:00',
    court: 'Cancha Sintética San José',
    referee: 'Piero Maza',
    scorers: [],
  },
  {
    id: 'm-5',
    round: 1,
    homeTeamId: 'team-10', // LOS CHAMOS FC
    awayTeamId: 'team-9', // LEONES FC
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-10-25',
    time: '19:30',
    court: 'Cancha El Triunfo',
    referee: 'Facundo Tello',
    scorers: [],
  },
  {
    id: 'm-6',
    round: 1,
    homeTeamId: 'team-11', // NEW FC
    awayTeamId: 'team-12', // SPORTING VISAJE
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-10-25',
    time: '21:00',
    court: 'Cancha La Estrella',
    referee: 'Carlos Ramos',
    scorers: [],
  },

  // JORNADA 2
  {
    id: 'm-7',
    round: 2,
    homeTeamId: 'team-4', // CRISBAN FC
    awayTeamId: 'team-1', // ALPHA
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-10-31',
    time: '18:00',
    court: 'Cancha Central Obelisco',
    referee: 'Por designar',
    scorers: [],
  },
  {
    id: 'm-8',
    round: 2,
    homeTeamId: 'team-2', // CAIMANES FC
    awayTeamId: 'team-6', // ELITE F.C.
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-10-31',
    time: '19:30',
    court: 'Polideportivo Fronteo - Cancha 1',
    referee: 'Por designar',
    scorers: [],
  },
  {
    id: 'm-9',
    round: 2,
    homeTeamId: 'team-3', // CARUCIENA SC
    awayTeamId: 'team-8', // HALCONES FC
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-11-01',
    time: '18:00',
    court: 'Complejo Deportivo Norte',
    referee: 'Por designar',
    scorers: [],
  },
  {
    id: 'm-10',
    round: 2,
    homeTeamId: 'team-9', // LEONES FC
    awayTeamId: 'team-11', // NEW FC
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-11-01',
    time: '19:30',
    court: 'Polideportivo Fronteo - Cancha 2',
    referee: 'Por designar',
    scorers: [],
  },
  {
    id: 'm-11',
    round: 2,
    homeTeamId: 'team-5', // DEPORTIVO SIN LUZ
    awayTeamId: 'team-10', // LOS CHAMOS FC
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-11-01',
    time: '21:00',
    court: 'Estadio Nocturno El Faro',
    referee: 'Por designar',
    scorers: [],
  },
  {
    id: 'm-12',
    round: 2,
    homeTeamId: 'team-7', // FAMILIS FC
    awayTeamId: 'team-12', // SPORTING VISAJE
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-11-02',
    time: '18:00',
    court: 'Parque La Frontera',
    referee: 'Por designar',
    scorers: [],
  },

  // JORNADA 3
  {
    id: 'm-13',
    round: 3,
    homeTeamId: 'team-1', // ALPHA
    awayTeamId: 'team-10', // LOS CHAMOS FC
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-11-07',
    time: '18:00',
    court: 'Cancha Central Obelisco',
    referee: 'Por designar',
    scorers: [],
  },
  {
    id: 'm-14',
    round: 3,
    homeTeamId: 'team-8', // HALCONES FC
    awayTeamId: 'team-4', // CRISBAN FC
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-11-07',
    time: '19:30',
    court: 'Cancha Sintética San José',
    referee: 'Por designar',
    scorers: [],
  },
  {
    id: 'm-15',
    round: 3,
    homeTeamId: 'team-5', // DEPORTIVO SIN LUZ
    awayTeamId: 'team-2', // CAIMANES FC
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-11-08',
    time: '18:00',
    court: 'Estadio Nocturno El Faro',
    referee: 'Por designar',
    scorers: [],
  },
  {
    id: 'm-16',
    round: 3,
    homeTeamId: 'team-7', // FAMILIS FC
    awayTeamId: 'team-3', // CARUCIENA SC
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-11-08',
    time: '19:30',
    court: 'Parque La Frontera',
    referee: 'Por designar',
    scorers: [],
  },
  {
    id: 'm-17',
    round: 3,
    homeTeamId: 'team-12', // SPORTING VISAJE
    awayTeamId: 'team-6', // ELITE F.C.
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-11-08',
    time: '21:00',
    court: 'Arena Los Álamos',
    referee: 'Por designar',
    scorers: [],
  },
  {
    id: 'm-18',
    round: 3,
    homeTeamId: 'team-11', // NEW FC
    awayTeamId: 'team-9', // LEONES FC
    homeScore: null,
    awayScore: null,
    status: 'SCHEDULED',
    date: '2026-11-09',
    time: '19:00',
    court: 'Cancha La Estrella',
    referee: 'Por designar',
    scorers: [],
  },
];

const STORAGE_KEY = 'liga_fronteo_obelisco_2026_clean_v3';

export interface DatabaseState {
  teams: Team[];
  players: Player[];
  matches: Match[];
  lastUpdated: string;
}

class TournamentDatabase {
  private state: DatabaseState;
  private listeners: (() => void)[] = [];

  constructor() {
    this.state = this.loadFromStorage();
    this.initFirestoreListener();
  }

  private initFirestoreListener() {
    try {
      const tournamentDocRef = doc(db, 'tournament', 'liga_fronteo_2026');
      onSnapshot(
        tournamentDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data() as DatabaseState;
            if (data && data.teams && Array.isArray(data.players) && Array.isArray(data.matches)) {
              this.state = data;
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
              } catch (e) {
                // ignore storage error
              }
              this.notify();
            }
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, 'tournament/liga_fronteo_2026');
        }
      );
    } catch (e) {
      console.warn('Firestore onSnapshot listener could not be attached:', e);
    }
  }

  private loadFromStorage(): DatabaseState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.teams && Array.isArray(parsed.players) && Array.isArray(parsed.matches)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read from local storage, using initial clean seed', e);
    }

    return {
      teams: INITIAL_TEAMS,
      players: INITIAL_PLAYERS,
      matches: INITIAL_MATCHES,
      lastUpdated: new Date().toISOString(),
    };
  }

  private saveToStorage() {
    try {
      this.state.lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Error saving database to storage', e);
    }
    this.notify();

    // Push to Cloud Firestore
    try {
      const tournamentDocRef = doc(db, 'tournament', 'liga_fronteo_2026');
      setDoc(tournamentDocRef, this.state).catch((err) => {
        handleFirestoreError(err, OperationType.WRITE, 'tournament/liga_fronteo_2026');
      });
    } catch (err) {
      console.warn('Could not push to Firestore:', err);
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Getters
  public getTeams(): Team[] {
    return [...this.state.teams];
  }

  public getTeam(id: string): Team | undefined {
    return this.state.teams.find((t) => t.id === id);
  }

  public getPlayers(): Player[] {
    return [...this.state.players];
  }

  public getPlayersByTeam(teamId: string): Player[] {
    return this.state.players.filter((p) => p.teamId === teamId);
  }

  public getMatches(): Match[] {
    return [...this.state.matches];
  }

  public getMatch(id: string): Match | undefined {
    return this.state.matches.find((m) => m.id === id);
  }

  // Standings Calculation (When 0 finished matches, all teams have exact 0s!)
  public getStandings(): Standing[] {
    const teams = this.state.teams;
    const matches = this.state.matches;

    const map = new Map<string, Standing>();

    // Initialize all 12 teams with 0s
    teams.forEach((t) => {
      map.set(t.id, {
        teamId: t.id,
        team: t,
        pj: 0,
        pg: 0,
        pe: 0,
        pp: 0,
        gf: 0,
        gc: 0,
        dg: 0,
        pts: 0,
        form: [],
      });
    });

    // Only FINISHED matches with actual scores count towards standings
    const finishedMatches = matches
      .filter((m) => m.status === 'FINISHED' && m.homeScore !== null && m.awayScore !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    finishedMatches.forEach((m) => {
      const homeStanding = map.get(m.homeTeamId);
      const awayStanding = map.get(m.awayTeamId);

      if (!homeStanding || !awayStanding) return;

      const hG = m.homeScore!;
      const aG = m.awayScore!;

      // Home
      homeStanding.pj += 1;
      homeStanding.gf += hG;
      homeStanding.gc += aG;
      homeStanding.dg = homeStanding.gf - homeStanding.gc;

      // Away
      awayStanding.pj += 1;
      awayStanding.gf += aG;
      awayStanding.gc += hG;
      awayStanding.dg = awayStanding.gf - awayStanding.gc;

      if (hG > aG) {
        homeStanding.pg += 1;
        homeStanding.pts += 3;
        homeStanding.form.push('W');

        awayStanding.pp += 1;
        awayStanding.form.push('L');
      } else if (hG < aG) {
        awayStanding.pg += 1;
        awayStanding.pts += 3;
        awayStanding.form.push('W');

        homeStanding.pp += 1;
        homeStanding.form.push('L');
      } else {
        homeStanding.pe += 1;
        homeStanding.pts += 1;
        homeStanding.form.push('D');

        awayStanding.pe += 1;
        awayStanding.pts += 1;
        awayStanding.form.push('D');
      }
    });

    // Keep only last 5 results in form
    map.forEach((standing) => {
      standing.form = standing.form.slice(-5);
    });

    // Sort order: PTS desc, DG desc, GF desc, PG desc, Team initial order
    const standingsList = Array.from(map.values()).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.dg !== a.dg) return b.dg - a.dg;
      if (b.gf !== a.gf) return b.gf - a.gf;
      if (b.pg !== a.pg) return b.pg - a.pg;
      // Default to initial team order if all 0
      return a.team.id.localeCompare(b.team.id);
    });

    return standingsList;
  }

  // Top Scorers Calculation
  public getTopScorers(): { player: Player; team: Team; goals: number; assists: number; matchesCount: number }[] {
    const list = this.state.players.map((p) => {
      const team = this.state.teams.find((t) => t.id === p.teamId) || {
        id: p.teamId,
        name: 'Equipo',
        shortName: 'EQ',
        captainName: '',
        coach: '',
        homeCourt: '',
        primaryColor: '#64748b',
        secondaryColor: '#94a3b8',
        foundedYear: 2026,
        badgeStyle: 'wolf' as const,
      };

      const teamMatches = this.state.matches.filter(
        (m) => (m.homeTeamId === p.teamId || m.awayTeamId === p.teamId) && m.status === 'FINISHED'
      ).length;

      return {
        player: p,
        team,
        goals: p.goals || 0,
        assists: p.assists || 0,
        matchesCount: teamMatches,
      };
    });

    // Only return players who have scored at least 1 goal
    return list.filter((item) => item.goals > 0).sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      return b.assists - a.assists;
    });
  }

  // --- MUTATIONS ---

  /**
   * Add a new Player with full official athletic card attributes
   */
  public addPlayer(playerData: Omit<Player, 'id'>): Player {
    const newId = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newPlayer: Player = {
      ...playerData,
      id: newId,
      goals: playerData.goals || 0,
      assists: playerData.assists || 0,
      yellowCards: playerData.yellowCards || 0,
      redCards: playerData.redCards || 0,
      registeredAt: new Date().toISOString(),
    };

    // If marked as captain, update team captain and unset others in same team
    if (newPlayer.isCaptain) {
      this.state.players.forEach((p) => {
        if (p.teamId === newPlayer.teamId && p.isCaptain) {
          p.isCaptain = false;
        }
      });
      const team = this.state.teams.find((t) => t.id === newPlayer.teamId);
      if (team) {
        team.captainName = newPlayer.name;
      }
    }

    this.state.players.push(newPlayer);
    this.saveToStorage();
    return newPlayer;
  }

  /**
   * Delete Player from Roster
   */
  public deletePlayer(playerId: string): boolean {
    const idx = this.state.players.findIndex((p) => p.id === playerId);
    if (idx === -1) return false;
    this.state.players.splice(idx, 1);
    this.saveToStorage();
    return true;
  }

  /**
   * Update or Register a Match Result
   */
  public updateMatchResult(
    matchId: string,
    homeScore: number,
    awayScore: number,
    status: 'FINISHED' | 'LIVE' | 'SCHEDULED' = 'FINISHED',
    newScorers?: GoalEvent[],
    referee?: string,
    court?: string
  ): boolean {
    const matchIndex = this.state.matches.findIndex((m) => m.id === matchId);
    if (matchIndex === -1) return false;

    const oldMatch = this.state.matches[matchIndex];

    const updatedMatch: Match = {
      ...oldMatch,
      homeScore,
      awayScore,
      status,
      referee: referee ?? oldMatch.referee,
      court: court ?? oldMatch.court,
      scorers: newScorers ?? oldMatch.scorers,
    };

    this.state.matches[matchIndex] = updatedMatch;

    // Credit goals to registered players in the scorers list
    if (newScorers && newScorers.length > 0) {
      newScorers.forEach((scorer) => {
        const playerIndex = this.state.players.findIndex((p) => p.id === scorer.playerId);
        if (playerIndex !== -1) {
          this.state.players[playerIndex].goals = (this.state.players[playerIndex].goals || 0) + 1;
        }
      });
    }

    this.saveToStorage();
    return true;
  }

  /**
   * Assign or Change Referee and Court to a Match
   */
  public updateMatchAssignment(matchId: string, referee: string, court?: string, date?: string, time?: string): boolean {
    const matchIndex = this.state.matches.findIndex((m) => m.id === matchId);
    if (matchIndex === -1) return false;

    this.state.matches[matchIndex] = {
      ...this.state.matches[matchIndex],
      referee,
      court: court ?? this.state.matches[matchIndex].court,
      date: date ?? this.state.matches[matchIndex].date,
      time: time ?? this.state.matches[matchIndex].time,
    };

    this.saveToStorage();
    return true;
  }

  /**
   * Schedule a new Match in the tournament
   */
  public createMatch(matchData: Omit<Match, 'id' | 'scorers'>): Match {
    const newId = `m-${Date.now()}`;
    const newMatch: Match = {
      ...matchData,
      id: newId,
      scorers: [],
    };

    this.state.matches.push(newMatch);
    this.saveToStorage();
    return newMatch;
  }

  /**
   * Reset database to pristine 0-0 state
   */
  public resetToFactory(): void {
    this.state = {
      teams: INITIAL_TEAMS,
      players: INITIAL_PLAYERS,
      matches: INITIAL_MATCHES,
      lastUpdated: new Date().toISOString(),
    };
    this.saveToStorage();
  }

  /**
   * Export database as clean JSON
   */
  public exportData(): string {
    return JSON.stringify(this.state, null, 2);
  }

  /**
   * Import database from JSON
   */
  public importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data.teams) && Array.isArray(data.players) && Array.isArray(data.matches)) {
        this.state = {
          teams: data.teams,
          players: data.players,
          matches: data.matches,
          lastUpdated: new Date().toISOString(),
        };
        this.saveToStorage();
        return true;
      }
    } catch (e) {
      console.error('Failed to import JSON data', e);
    }
    return false;
  }
}

export const tournamentDb = new TournamentDatabase();
