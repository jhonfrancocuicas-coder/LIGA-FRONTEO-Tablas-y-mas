import { UserSession } from '../types/tournament';
import { auth, googleProvider } from './firebase';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

const AUTH_STORAGE_KEY = 'liga_fronteo_auth_session';

class AuthService {
  private currentSession: UserSession;
  private listeners: ((session: UserSession) => void)[] = [];
  private isFirebaseReady = false;

  constructor() {
    this.currentSession = this.loadSession();
    this.initFirebaseAuthListener();
  }

  private loadSession(): UserSession {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read auth session from storage', e);
    }

    return {
      isAuthenticated: false,
      email: null,
      name: null,
      avatar: null,
      role: 'VISITOR',
      provider: 'guest',
    };
  }

  private saveSession(session: UserSession) {
    this.currentSession = session;
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Error saving session', e);
    }
    this.notify();
  }

  private initFirebaseAuthListener() {
    onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      this.isFirebaseReady = true;
      if (firebaseUser) {
        const session: UserSession = {
          isAuthenticated: true,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Administrador',
          avatar:
            firebaseUser.photoURL ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              firebaseUser.displayName || 'Admin'
            )}&background=0284c7&color=fff&bold=true`,
          role: 'ADMIN',
          provider: 'google',
        };
        this.saveSession(session);
      } else {
        // If not authenticated in Firebase
        if (this.currentSession.provider === 'google') {
          this.saveSession({
            isAuthenticated: false,
            email: null,
            name: null,
            avatar: null,
            role: 'VISITOR',
            provider: 'guest',
          });
        }
      }
    });
  }

  public subscribe(listener: (session: UserSession) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentSession));
  }

  public getSession(): UserSession {
    return { ...this.currentSession };
  }

  /**
   * Real Google Sign-In with Firebase Authentication Popup
   */
  public async loginWithGoogleReal(): Promise<{ success: boolean; session?: UserSession; error?: string }> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const session: UserSession = {
        isAuthenticated: true,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0] || 'Administrador',
        avatar:
          user.photoURL ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.displayName || 'Admin'
          )}&background=0284c7&color=fff&bold=true`,
        role: 'ADMIN',
        provider: 'google',
      };

      this.saveSession(session);
      return { success: true, session };
    } catch (err: any) {
      console.error('Firebase Google Sign-In error:', err);
      let errorMsg = 'Error al iniciar sesión con Google.';
      if (err.code === 'auth/popup-closed-by-user') {
        errorMsg = 'Ventana de inicio de sesión cerrada por el usuario.';
      } else if (err.code === 'auth/popup-blocked') {
        errorMsg = 'El navegador bloqueó la ventana emergente de Google. Por favor permite popups para este sitio.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      return { success: false, error: errorMsg };
    }
  }

  /**
   * Sign out from Firebase and local state
   */
  public async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Error during firebase signout:', e);
    }
    const emptySession: UserSession = {
      isAuthenticated: false,
      email: null,
      name: null,
      avatar: null,
      role: 'VISITOR',
      provider: 'guest',
    };
    this.saveSession(emptySession);
  }
}

export const authService = new AuthService();
