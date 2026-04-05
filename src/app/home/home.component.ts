import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Client } from 'appwrite';
import { environment } from '@env/environment';
import { AuthService } from '@app/auth/auth.service';
import { client } from '@lib/appwrite';

interface Log {
  date: Date;
  method: string;
  path: string;
  status: number;
  response: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, DatePipe],
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('detailsRef') detailsRef!: ElementRef;

  detailHeight: number = 0;
  private resizeObserver!: ResizeObserver;
  logs: Log[] = [];
  status: 'idle' | 'loading' | 'success' | 'error' = 'idle';
  showLogs: boolean = false;

  endpoint = environment.appwriteEndpoint;
  projectId = environment.appwriteProjectId;
  projectName = environment.appwriteProjectName;

  currentUser$;

  private client: Client = client;

  constructor(
    private zone: NgZone,
    private authService: AuthService,
    private router: Router,
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngAfterViewInit() {
    this.resizeObserver = new ResizeObserver((entries) => {
      this.zone.run(() => {
        for (let entry of entries) {
          if (entry.target === this.detailsRef?.nativeElement) {
            this.detailHeight = entry.contentRect.height;
          }
        }
      });
    });
    this.resizeObserver.observe(this.detailsRef.nativeElement);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  async sendPing() {
    if (this.status === 'loading') return;
    this.status = 'loading';

    try {
      const result = await this.client.ping();
      const log: Log = {
        date: new Date(),
        method: 'GET',
        path: '/v1/ping',
        status: 200,
        response: JSON.stringify(result),
      };
      this.logs = [log, ...this.logs];
      this.status = 'success';
    } catch (err: any) {
      const log: Log = {
        date: new Date(),
        method: 'GET',
        path: '/v1/ping',
        status: err instanceof Error ? 500 : err.code,
        response: err instanceof Error ? 'Something went wrong' : err.message,
      };
      this.logs = [log, ...this.logs];
      this.status = 'error';
    }
    this.showLogs = true;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
