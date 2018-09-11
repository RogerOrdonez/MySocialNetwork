import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user.model';
import { Follow } from '../../models/follow.model';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public user: User;
  public success: boolean;
  public identity;
  public token;
  public url;
  public stats;
  public follow;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private followService: FollowService
  ) {
      this.identity = this.userService.getIdentity();
      this.token = this.userService.getToken();
      this.url = environment.backendUrl;
    }

  ngOnInit() {
    this.loadPage();
  }

  getUser(userId) {
    this.userService.getUser(userId)
                    .subscribe( (response: any) => {
                      if (response.usr) {
                        this.user = response.usr;
                      } else {
                        this.success = false;
                      }
                    },
                    error => {
                      console.log(<any>error);
                      this.success = false;
                      console.log(this.identity._id);
                      this.router.navigate(['/profile', this.identity._id]);
                    });
  }

  loadPage() {
    this.activatedRoute.params
                       .subscribe(
                         params => {
                           const id = params['id'];
                           this.getUser(id);
                           this.getCounters(id);
                         });
  }

  getCounters(userId) {
    this.userService.getCounters(userId)
                    .subscribe(response => {
                      this.stats = response;
                    },
                    error => {
                      console.log(<any>error);
                      this.success = false;
                    });
  }

}
