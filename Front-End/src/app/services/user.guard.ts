import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(
    private router: Router,
    private userServices: UserService
  ) {

  }

  canActivate(): boolean {
    const identity = this.userServices.getIdentity();
    if (identity && ( identity.role === 'ROLE_USER' || identity.role === 'ROLE_ADMIN')) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
