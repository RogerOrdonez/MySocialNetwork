import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Follow } from '../../../models/follow.model';
import { Message } from '../../../models/message.model';
import { UserService } from '../../../services/user.service';
import { MessageService } from '../../../services/message.service';
import { FollowService } from '../../../services/follow.service';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sended',
  templateUrl: './sended.component.html',
  styleUrls: ['./sended.component.css']
})
export class SendedComponent implements OnInit {
  public message: Message;
  public identity;
  public token;
  public url;
  public succes: boolean;
  public messages: Message[];
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
    this.getMessages();
  }

  getMessages() {
    this.messageService.getEmittedMessages(this.token, 1)
                       .subscribe( (response: any) => {
                        if (response.messages) {
                          this.messages = response.messages;
                          console.log(this.messages);
                        }
                       },
                       error => {
                         this.succes = false;
                         console.log(<any>error);
                       });
  }

}
