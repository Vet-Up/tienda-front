import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CHeader } from '../../ui/c-header/c-header';
import { CCartSidebar } from '../c-cart-sidebar/c-cart-sidebar';
import { filter } from 'rxjs';

declare global {
  interface Window {
    Landbot: any;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CHeader, CCartSidebar],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  readonly router = inject(Router)
  private landbotInitialized = false;
  private landbotInstance: any = null;

  async ngOnInit() {
    this.initLandbotOnInteraction();
    this.handleRouteChanges();
  }

  private initLandbotOnInteraction() {
    const initLandbot = () => {
      const currentPath = window.location.pathname;
      
      // No mostrar en login y register
      if (currentPath.includes('/login') || currentPath.includes('/register')) {
        return;
      }
      
      if (!this.landbotInitialized) {
        this.loadLandbotScript();
      }
    };

    window.addEventListener('mouseover', initLandbot, { once: true });
    window.addEventListener('touchstart', initLandbot, { once: true });
  }

  private loadLandbotScript() {
    if (this.landbotInitialized) return;
    
    this.landbotInitialized = true;
    const script = document.createElement('script');
    script.type = 'module';
    script.async = true;
    script.src = 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs';
    
    script.addEventListener('load', () => {
      this.landbotInstance = new window.Landbot.Livechat({
        configUrl: 'https://storage.googleapis.com/landbot.online/v3/H-3316482-RPCZDE76J0QIODGB/index.json',
      });
    });
    
    document.head.appendChild(script);
  }

  private handleRouteChanges() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const isAuthPage = event.url.includes('/login') || event.url.includes('/register');
        
        // Ocultar/mostrar el chatbot según la ruta
        if (this.landbotInstance) {
          const landbotElement = document.querySelector('#landbot-livechat');
          if (landbotElement) {
            (landbotElement as HTMLElement).style.display = isAuthPage ? 'none' : 'block';
          }
        }
      });
  }

}
