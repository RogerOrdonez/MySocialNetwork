import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { faUserMinus, faUserPlus, faUserCheck, faUser } from '@fortawesome/free-solid-svg-icons';
import { FollowService } from '../../services/follow.service';
import { Follow } from '../../models/follow.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnChanges {
  public identity;
  public token;
  public stats;
  public url;
  public success;
  public follow;
  public follower;
  @Input() userId;
  @Input() newPosts;
  public user: User;
  public faUserMinus = faUserMinus;
  public faUserPlus = faUserPlus;
  public faUserCheck = faUserCheck;
  public faUser = faUser;
  public unfollowUserHover;
  public followUserHover: boolean;
  private changeLog: string[] = [];

  constructor(private userService: UserService, private followService: FollowService) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = environment.backendUrl;
    this.user = new User('', '', '', '', '', '', '', '');
    this.followUserHover = false;
  }

  ngOnInit() {
    // Datos de otro usuario
    if (this.userId && this.userId !== this.identity._id) {
      this.userService.getUser(this.userId)
                      .subscribe((response: any) => {
                        if (!response) {
                          this.success = false;
                        } else {
                          this.user._id = response.usr._id;
                          this.user.name = response.usr.name;
                          this.user.surname = response.usr.surname;
                          this.user.nick = response.usr.nick;
                          this.user.email = response.usr.email;
                          this.user.role = response.usr.role;
                          this.user.image = response.usr.image;
                          this.follow = response.following;
                          this.follower = response.followers;
                          this.userService.getCounters(this.userId)
                                          .subscribe(stats => {
                                            this.stats = stats;
                                          },
                                          error => {
                                            console.log(<any>error);
                                            this.success = false;
                                          });
                          this.success = true;
                        }
                      },
                      error => {
                        console.log(<any>error);
                        this.success = false;
                      });
    } else { // Datos del usuario logueado
      this.stats = this.userService.getStats();
      this.userService.getCounters()
                      .subscribe((response: any) => {
                         localStorage.setItem('stats', JSON.stringify(response));
                         this.stats = this.userService.getStats();
                         this.user._id = this.identity._id;
                         this.user.name = this.identity.name;
                         this.user.surname = this.identity.surname;
                         this.user.nick = this.identity.nick;
                         this.user.email = this.identity.email;
                         this.user.role = this.identity.role;
                         this.user.image = this.identity.image;
                         this.success = true;
                      },
                      error => {
                        console.log(<any>error);
                        this.success = false;
                      });
    }
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
                          this.follow = response;
                          this.changeUnfollowHover(followed);
                          this.stats.followers += 1;
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
                          this.follow = undefined;
                          this.stats.followers -= 1;
                          this.changeUnfollowHover(followed);
                          this.success = true;
                        }
                      },
                      error => {
                        this.success = false;
                      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( changes.newPosts.currentValue > 0) {
      this.newPosts = changes.newPosts.currentValue;
    }
  }

}
