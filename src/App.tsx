/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { tournamentDb } from './services/db';
import { authService } from './services/auth';
import { Header } from './components/Header';
import { FixtureView } from './components/FixtureView';
import { StandingsTable } from './components/StandingsTable';
import { ScorersView } from './components/ScorersView';
import { TeamsView } from './components/TeamsView';
import { AdminPanel } from './components/AdminPanel';
import { Match, UserSession } from './types/tournament';
import { Calendar, Trophy, Sparkles, Shield, KeyRound } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'fixture' | 'standings' | 'scorers' | 'teams' | 'admin'>('fixture');
  const [userSession, setUserSession] = useState<UserSession>(authService.getSession());
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  // Trigger re-render whenever DB changes
  const [, setDbVersion] = useState(0);

  useEffect(() => {
    // Subscribe to DB changes
    const unsubDb = tournamentDb.subscribe(() => {
      setDbVersion((v) => v + 1);
    });

    // Subscribe to Auth changes
    const unsubAuth = authService.subscribe((session) => {
      setUserSession(session);
    });

    return () => {
      unsubDb();
      unsubAuth();
    };
  }, []);

  const teams = tournamentDb.getTeams();
  const matches = tournamentDb.getMatches();
  const players = tournamentDb.getPlayers();
  const standings = tournamentDb.getStandings();
  const scorers = tournamentDb.getTopScorers();

  // Metrics for header
  const totalGoals = matches
    .filter((m) => m.status === 'FINISHED' || m.status === 'LIVE')
    .reduce((sum, m) => sum + (m.homeScore || 0) + (m.awayScore || 0), 0);
  const totalFinishedMatches = matches.filter((m) => m.status === 'FINISHED').length;
  const liveMatchesCount = matches.filter((m) => m.status === 'LIVE').length;

  const handleSelectTeam = (teamId: string | null) => {
    setSelectedTeamId(teamId);
    if (teamId) {
      setActiveTab('teams');
    }
  };

  const handleEditMatch = (match: Match) => {
    setActiveTab('admin');
  };

  const handleOpenAddPlayerModal = (teamId: string) => {
    setActiveTab('admin');
  };

  const handleDataChanged = () => {
    setDbVersion((v) => v + 1);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 pb-20 sm:pb-8">
      {/* Official Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab: any) => setActiveTab(tab)}
        userSession={userSession}
        totalGoals={totalGoals}
        totalMatches={totalFinishedMatches}
        liveMatchesCount={liveMatchesCount}
      />

      {/* Main Body */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1">
        {activeTab === 'fixture' && (
          <FixtureView
            matches={matches}
            teams={teams}
            onSelectTeam={handleSelectTeam}
            onEditMatch={handleEditMatch}
            isAdmin={userSession.isAuthenticated}
          />
        )}

        {activeTab === 'standings' && (
          <StandingsTable
            standings={standings}
            onSelectTeam={handleSelectTeam}
          />
        )}

        {activeTab === 'scorers' && (
          <ScorersView
            scorers={scorers}
            onSelectTeam={handleSelectTeam}
          />
        )}

        {activeTab === 'teams' && (
          <TeamsView
            teams={teams}
            players={players}
            selectedTeamId={selectedTeamId}
            onSelectTeam={setSelectedTeamId}
            onOpenAddPlayerModal={handleOpenAddPlayerModal}
            isAdmin={userSession.isAuthenticated}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            userSession={userSession}
            teams={teams}
            matches={matches}
            players={players}
            onDataChanged={handleDataChanged}
            onNavigateToTab={(tab: any) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Mobile Floating Bottom Navigation Bar (100% Mobile Optimized) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-white/10 px-2 py-1.5 sm:hidden shadow-2xl">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('fixture')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
              activeTab === 'fixture'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Fixture</span>
          </button>

          <button
            onClick={() => setActiveTab('standings')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
              activeTab === 'standings'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Tabla</span>
          </button>

          <button
            onClick={() => setActiveTab('scorers')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
              activeTab === 'scorers'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Goleadores</span>
          </button>

          <button
            onClick={() => setActiveTab('teams')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
              activeTab === 'teams'
                ? 'text-cyan-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Equipos</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
              activeTab === 'admin'
                ? 'text-amber-400 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Admin</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-slate-300">
              LIGA FRONTEO OBELISCO 2026
            </span>
            <span>•</span>
            <span>Plataforma Oficial de Futsal & Fútbol</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Temporada 2026</span>
            <span>•</span>
            <span>12 Clubes Participantes</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Base de Datos Conectada</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
