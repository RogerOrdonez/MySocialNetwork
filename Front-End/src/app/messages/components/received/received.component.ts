import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Follow } from '../../../models/follow.model';
import { Message } from '../../../models/message.model';
import { UserService } from '../../../services/user.service';
import { MessageService } from '../../../services/message.service';
import { FollowService } from '../../../services/follow.service';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-received',
  templateUrl: './received.component.html',
  styleUrls: ['./received.component.css']
})
export class ReceivedComponent implements OnInit {
  public message: Message;
  public identity;
  public token;
  public url;
  public succes: boolean;
  public messages: Message[];
  public total;
  public page;
  public noMore: boolean;

  constructor(
    private followService: FollowService,
    private messageService: MessageService,
    private userService: UserService
  ) { 
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = environment.backendUrl;
  }

  ngOnInit() {
    this.page = 1;
    this.getMessages();
  }

  getMessages() {
    this.messageService.getMyMessages(this.token, 1)
                       .subscribe( (response: any) => {
                        if (response.messages) {
                          this.messages = response.messages;
                          this.total = response.total;
                          if (this.messages.length === this.total) {
                            this.noMore = true;
                          } else {
                            this.noMore = false;
                          }
                        }
                       },
                       error => {
                         this.succes = false;
                         console.log(<any>error);
                       });
  }

  viewMore() {
    if (this.messages.length === (this.total)) {
      this.noMore = true;
    } else {
      this.page += 1;
    }
    this.messageService.getEmittedMessages(this.token, this.page);
  }

}
