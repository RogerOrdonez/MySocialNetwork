import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  public userId;
  public newPost;
  public activeTab;
  public newFollowing;
  public option;
  @ViewChild('tabset') tabSet: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private followService: FollowService
  ) {
      this.identity = this.userService.getIdentity();
      this.token = this.userService.getToken();
      this.url = environment.backendUrl;
      this.newPost = 0;
      // this.activeTab = 'publications-tab';
      this.newFollowing = 0;
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
                      this.router.navigate(['/profile', this.identity._id]);
                    });
  }

  loadPage() {
    this.activatedRoute.params
                       .subscribe(
                         params => {
                           const id = params['id'];
                           this.option = params['option'];
                           if (this.option) {
                            this.tabSet.activeId = `${this.option}-tab`;
                            this.activeTab = `${this.option}-tab`;
                           }
                           this.userId = id;
                           this.newPost = 0;
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

  addPost(newPost) {
    this.newPost = newPost;
  }

  getUserId(userId) {
    if (this.option) {
      this.tabSet.activeId = `${this.option}-tab`;
    } else {
      this.tabSet.activeId = 'publications-tab';
    }
  }

  getFollowing(following) {
    this.newFollowing = following;
  }

  getOption(option) {
    console.log(option);
    if (option && option.option) {
      this.tabSet.activeId = `${option.option}-tab`;
      this.activeTab = `${option.option}-tab`;
    }
  }

}
