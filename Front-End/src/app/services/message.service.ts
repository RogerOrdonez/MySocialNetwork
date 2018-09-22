import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  public url: string;
  constructor( private http: HttpClient) { 
    this.url = environment.backendUrl;
  }

  addMessage(token, message) {
    const params = JSON.stringify(message);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);
    return this.http.post(this.url + 'message', params, {headers: headers});
  }

  getMyMessages(token, page = 1) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);
    return this.http.get(this.url + 'my-messages/' + page, {headers: headers});
  }

  getEmittedMessages(token, page = 1) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);
    return this.http.get(this.url + 'messages/' + page, {headers: headers});
  }

}
