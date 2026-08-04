import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  type User,
} from 'firebase/auth';

import { firebaseApp } from './firebase.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly auth = getAuth(firebaseApp);
  private readonly platformId = inject(PLATFORM_ID);

  readonly user = signal<User | null>(null);
  readonly loading = signal<boolean>(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      onAuthStateChanged(this.auth, (user) => {
        this.user.set(user);
        this.loading.set(false);
      });
    } else {
      this.loading.set(false);
    }
  }

  async login(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    return cred.user;
  }

  async signup(email: string, password: string): Promise<User> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    return cred.user;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async updateUserProfile(
    user: User,
    data: { displayName?: string; photoURL?: string },
  ): Promise<void> {
    await updateProfile(user, data);
    this.user.set({ ...user, ...data });
  }

  get currentUser(): User | null {
    return this.auth.currentUser;
  }
}
