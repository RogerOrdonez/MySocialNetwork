import { Component, OnInit, DoCheck, OnChanges, OnDestroy } from '@angular/core';
import { faHome, faNewspaper, faUsers, faSignInAlt, faUserPlus, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { UserService} from './services/user.service';
import {  RouterLinkActive, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck, OnDestroy {
  public title = 'ngFollow';
  public faHome = faHome;
  public faNewspaper = faNewspaper;
  public faUsers = faUsers;
  public faSignInAlt = faSignInAlt;
  public faUserPlus = faUserPlus;
  public faEnvelope = faEnvelope;
  public identity;
  public url: string;
  public actualRoute = '/timeline';
  public subscription: Subscription;

  constructor( private userService: UserService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.url = environment.backendUrl;
  }

  ngOnInit() {
     this.identity = this.userService.getIdentity();
     this.subscription = this.router.events.pipe(
       filter(event => event instanceof NavigationEnd)
     )
     .subscribe(() => {
        this.actualRoute = this.router.routerState.snapshot.url;
        this.scrollToTop();
     });
  }

  ngDoCheck() {
     this.identity = this.userService.getIdentity();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    localStorage.clear();
    this.identity = null;
    this.router.navigate(['/']);
  }

  scrollToTop() {
    if (window.scrollY !== 0) {
      const start = window.scrollY,
      change = 0 - start,
      startDate = +new Date(),
      easeInOutQuad = function(t, b, c, d) {
          t /= d / 2;
          if (t < 1) { return (c / 2) * t * t + b; }
          t--;
          return (-c / 2) * (t * (t - 2) - 1) + b;
      },
      animateScroll = function() {
        const currentDate = +new Date();
        const currentTime = currentDate - startDate;
        const val = parseInt(easeInOutQuad(currentTime, start, change, 100), 10);
        window.scroll(0, val);
        if (currentTime < 100) {
          requestAnimationFrame(animateScroll);
        } else {
          window.scroll(0, 0);
        }
      };
      animateScroll();
      }
  }

    onClick(route) {
      if (route === '/home' && this.identity) {
        return;
      }
      this.actualRoute = route;
      this.router.navigate([route]);
      if (this.actualRoute === route && route === '/timeline') {
        this.scrollToTop();
      }
    }
}
