import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { faUserMinus, faUserPlus, faUserCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import { FollowService } from '../../services/follow.service';
import { Follow } from '../../models/follow.model';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit, OnChanges {
  public identity;
  public token;
  public page;
  public nextPage;
  public prevPage;
  public success: boolean;
  public total;
  public pages = 1;
  public users: Array<User>;
  public follows = [];
  public followers = [];
  public usersFollowers;
  public usersFollowing;
  public url: string;
  public faUserMinus = faUserMinus;
  public faUserPlus = faUserPlus;
  public faUserCheck = faUserCheck;
  public faUser = faUser;
  public unfollowUserHover;
  public followUserHover = false;
  @Input() option: string;
  @Input() userId: string;

  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private followService: FollowService
  ) {
    this.identity = userService.getIdentity();
    this.token = userService.getToken();
    this.url = environment.backendUrl;
    this.option = 'timeline';
    this.userId = this.identity._id;
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
                          if (this.option === 'timeline') {
                            this.getUsers(page);
                          }
                          if ( this.option === 'following') {
                            this.getFollowing(this.userId, page);
                          }
                          if ( this.option === 'followers') {
                            this.getFollowers(this.userId, page);
                          }
                       });
  }

  getUsers(page, option?) {
    this.userService.getUsers(page)
                    .subscribe(
                      (response: any) => {
                        if (!response.usrs) {
                          this.success = false;
                        } else {
                          this.total = response.total;
                          this.pages = response.pages;
                          if (!option){
                            this.users = response.usrs;
                          }
                          this.follows = response.usrsFollowing;
                          this.followers = response.usrsFollowers;
                          if (this.pages) {
                            if (page > this.pages ) {
                              this.route.navigate(['/']);
                            }
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

  getFollowing(userId, page) {
    this.userService.getFollowing(userId, page)
                    .subscribe(
                      (response: any) => {
                        if (!response.following) {
                          this.success = false;
                        } else {
                          this.total = response.total;
                          this.pages = response.pages;
                          this.usersFollowing = response.following as Array<any>;
                          this.users = this.usersFollowing
                                                    .map((following) => {
                                                      return following.followed;
                                                    });
                          this.getUsers(1, 'Following');
                          /*this.follows = this.usersFollowing
                                             .map((following, index, array) => {
                                                return following.followed._id;
                                              });*/
                          if (this.pages) {
                            if (page > this.pages ) {
                              this.route.navigate(['/']);
                            }
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

  getFollowers(userId, page) {
    this.userService.getFollowers(userId, page)
                    .subscribe(
                      (response: any) => {
                        if (!response.follower) {
                          this.success = false;
                        } else {
                          this.total = response.total;
                          this.pages = response.pages;
                          this.usersFollowers = response.follower as Array<any>;
                          this.users = this.usersFollowers
                            .map((followers) => {
                              return followers.user;
                            });
                          this.getUsers(1, 'Followers');
                          if (this.pages) {
                            if (page > this.pages) {
                              this.route.navigate(['/']);
                            }
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

  followUser(followed) {
    const follow = new Follow('', this.identity._id, followed);
    this.followService.follow(this.token, follow)
                      .subscribe( response => {
                        if (!response) {
                          this.success = false;
                        } else {
                          this.follows.push(followed);
                          this.changeUnfollowHover(followed);
                          this.success = true;
                        }
                      },
                      error => {
                        this.success = false;
                      });
  }

  unfollowUser(followed) {
    this.followService.unFollow(this.token, followed)
                      .subscribe( response => {
                        if (!response) {
                          this.success = false;
                        } else {
                          const unfollowed = this.follows.indexOf(followed);
                          if (unfollowed >= 0) {
                            this.follows.splice(unfollowed, 1);
                          }
                          this.changeUnfollowHover(followed);
                          this.success = true;
                        }
                      },
                      error => {
                        this.success = false;
                      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.userId) {
      this.ngOnInit();
    }
  }

}
