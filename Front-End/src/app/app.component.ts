import { Component, OnInit, DoCheck } from '@angular/core';
import { faHome, faNewspaper, faUsers, faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { UserService} from './services/user.service';
import {  RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck{
  public title = 'ngSocial';
  public faHome = faHome;
  public faNewspaper = faNewspaper;
  public faUsers = faUsers;
  public faSignInAlt = faSignInAlt;
  public faUserPlus = faUserPlus;
  public identity;

  constructor( private userService: UserService) {}

  ngOnInit() {
     this.identity = this.userService.getIdentity();
  }

  ngDoCheck() {
     this.identity = this.userService.getIdentity();
  }

}
