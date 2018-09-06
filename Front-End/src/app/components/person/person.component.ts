import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { faUserMinus, faUserPlus, faUserCheck, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  public identity;
  public token;
  public page;
  public nextPage;
  public prevPage;
  public success: boolean;
  public total;
  public pages = 1;
  public users: Array<User>;
  public follows;
  public followers;
  public url: string;
  public faUserMinus = faUserMinus;
  public faUserPlus = faUserPlus;
  public faUserCheck = faUserCheck;
  public faUser = faUser;
  public unfollowUserHover;
  public followUserHover = false;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.identity = userService.getIdentity();
    this.token = userService.getToken();
    this.url = environment.backendUrl;
  }

  ngOnInit() {
    this.actualPage();
  }

  actualPage() {
    this.activatedRoute.params
                       .subscribe( params => {
                          let page = +params['page'];
                          this.page = page;

                          if (!params['page']) {
                            page = 1;
                          }

                          if (!page) {
                            page = 1;
                          } else {
                            this.nextPage = page + 1;
                            this.prevPage = page - 1;

                            if (this.prevPage <= 0) {
                              this.prevPage = 1;
                            }
                          }
                          // Devolver listado de personas en la red
                          this.getUsers(page);
                       });
  }

  getUsers(page) {
    this.userService.getUsers(page)
                    .subscribe(
                      (response: any) => {
                        if (!response.usrs) {
                          this.success = false;
                        } else {
                          this.total = response.total;
                          this.pages = response.pages;
                          this.users = response.usrs;
                          this.follows = response.usrsFollowing;
                          this.followers = response.usrsFollowers;
                          if (page > this.pages ) {
                            this.route.navigate(['/']);
                          }
                        }
                      },
                      (error: any) => {
                        console.log(error);
                        if (error.status === 404) {
                          this.success = false;
                          this.route.navigate(['/people/' + this.pages]);
                        }
                        this.success = false;
                      }
                    );
  }

  changeUnfollowHover(personId) {
    this.followUserHover = !this.followUserHover;
    if (!this.followUserHover) {
      this.unfollowUserHover = null;
    } else {
      this.unfollowUserHover = personId;
    }
  }

}
