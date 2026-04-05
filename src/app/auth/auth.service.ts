import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account, ID, Models } from 'appwrite';
import { account } from '@lib/appwrite';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private account: Account = account;

  currentUser$ = new BehaviorSubject<Models.User<Models.Preferences> | null>(
    null,
  );

  constructor() {
    this.restoreSession();
  }

  private async restoreSession() {
    try {
      await this.getCurrentUser();
      console.log('Session restored');
    } catch {
      this.currentUser$.next(null);
    }
  }

  async login(email: string, password: string): Promise<void> {
    await this.account.createEmailPasswordSession(email, password);
    await this.getCurrentUser();
  }

  async register(name: string, email: string, password: string): Promise<void> {
    await this.account.create(ID.unique(), email, password, name);
    await this.login(email, password);
  }

  async logout(): Promise<void> {
    await this.account.deleteSession('current');
    this.currentUser$.next(null);
  }

  async getCurrentUser(): Promise<Models.User<Models.Preferences>> {
    const user = await this.account.get();
    this.currentUser$.next(user);
    return user;
  }
}
