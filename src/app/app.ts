import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { WhatsappBtnComponent } from './components/whatsapp-btn/whatsapp-btn.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    WhatsappBtnComponent,
  ],
  template: `
    <router-outlet></router-outlet>
    @if (!isAdminRoute()) {
      <app-whatsapp-btn></app-whatsapp-btn>
    }
  `,
})
export class App {
  private router = inject(Router);
  isAdminRoute = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((event) => {
        this.isAdminRoute.set(event.urlAfterRedirects.startsWith('/admin'));
      });
    this.isAdminRoute.set(this.router.url.startsWith('/admin'));
  }
}
export { App as AppComponent };
