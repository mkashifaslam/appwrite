import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account, Client, ID, Models } from 'appwrite';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private client: Client;
  private account: Account;

  currentUser$ = new BehaviorSubject<Models.User<Models.Preferences> | null>(null);

  constructor() {
    this.client = new Client()
      .setEndpoint(environment.appwriteEndpoint)
      .setProject(environment.appwriteProjectId);
    this.account = new Account(this.client);
    this.restoreSession();
  }

  private async restoreSession() {
    try {
      const user = await this.account.get();
      this.currentUser$.next(user);
    } catch {
      this.currentUser$.next(null);
    }
  }

  async login(email: string, password: string): Promise<void> {
    await this.account.createEmailPasswordSession(email, password);
    const user = await this.account.get();
    this.currentUser$.next(user);
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
    return this.account.get();
  }
}
