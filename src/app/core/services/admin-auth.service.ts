import { Injectable, computed, inject, signal } from '@angular/core';

import { environment } from '@environments/environment.development';
import { AuthService } from '@core/firebase/auth.service';
import { FirestoreService } from '@core/firebase/firestore.service';
import { Admin } from '@core/models/admin.model';

const ADMINS_COLLECTION = 'admins';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly authService = inject(AuthService);
  private readonly firestore = inject(FirestoreService);

  readonly isAdmin = signal<boolean>(false);
  readonly checking = signal<boolean>(true);
  readonly error = signal<string>('');

  readonly admin = computed<Admin | null>(() => {
    const user = this.authService.user();
    if (!user) return null;
    return this._adminRecord();
  });

  private _adminRecord = signal<Admin | null>(null);

  async checkAdminStatus(email: string): Promise<boolean> {
    const docPath = `${ADMINS_COLLECTION}/${email}`;

    if (environment.debug) {
      const user = this.authService.currentUser;
      console.log('[AdminAuth] checkAdminStatus', {
        email,
        uid: user?.uid,
        authEmail: user?.email,
        docPath,
      });
    }

    try {
      const admin = await this.firestore.getDocument<Admin>(docPath);

      if (environment.debug) {
        console.log('[AdminAuth] Firestore response', {
          admin,
          active: admin.active,
          activeType: typeof admin.active,
        });
      }

      if (!admin.active) {
        this.isAdmin.set(false);
        this._adminRecord.set(null);
        return false;
      }

      this.isAdmin.set(true);
      this._adminRecord.set(admin);
      return true;
    } catch (err) {
      if (environment.debug) {
        console.error('[AdminAuth] checkAdminStatus failed', err);
      }
      this.error.set(err instanceof Error ? err.message : 'Failed to verify admin status.');
      this.isAdmin.set(false);
      return false;
    } finally {
      this.checking.set(false);
    }
  }

  async loginAsAdmin(email: string, password: string): Promise<boolean> {
    this.checking.set(true);
    this.error.set('');

    try {
      await this.authService.login(email, password);
      const isAdmin = await this.checkAdminStatus(email);

      if (!isAdmin) {
        await this.authService.logout();
        this.error.set('Access denied. You are not an authorized admin.');
        return false;
      }

      return true;
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Login failed. Check your credentials.');
      this.checking.set(false);
      return false;
    }
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    this.isAdmin.set(false);
    this._adminRecord.set(null);
    this.checking.set(true);
    this.error.set('');
  }

  async sendPasswordReset(email: string): Promise<void> {
    await this.authService.sendPasswordReset(email);
  }

  get isAuthenticated(): boolean {
    return this.authService.user() !== null;
  }

  get isAdminUser(): boolean {
    return this.isAuthenticated && this.isAdmin();
  }
}
