import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Follow } from '../../../models/follow.model';
import { Message } from '../../../models/message.model';
import { UserService } from '../../../services/user.service';
import { MessageService } from '../../../services/message.service';
import { FollowService } from '../../../services/follow.service';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  public message: Message;
  public identity;
  public token;
  public url;
  public succes: boolean;
  public follows;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private followService: FollowService,
    private messageService: MessageService,
    private userService: UserService
  ) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = environment.backendUrl;
    this.message = new Message('', '', '', '', this.identity._id, '');
  }

  ngOnInit() {
    this.getMyFollows();
  }

  onSubmit(form) {
    this.messageService.addMessage(this.token, this.message)
                       .subscribe( (response: any) => {
                         if ( response.message ) {
                           form.reset();
                           this.succes = true;
                         }
                       },
                       error => {
                         console.log(<any>error);
                         this.succes = false;
                       });
  }

  getMyFollows() {
    this.followService.getMyFollows(this.token)
                      .subscribe( (response: any) => {
                        this.follows = response.follows;
                      },
                      error => {
                        console.log(<any>error);
                        this.succes = false;
                      });
  }
}
