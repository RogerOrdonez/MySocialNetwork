import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Follow } from '../models/follow.model';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  public url: string;
  constructor(public httpClient: HttpClient) {
    this.url = environment.backendUrl;
  }

  follow(token, follow) {
    const params = JSON.stringify(follow);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);
    return this.httpClient.post(this.url + 'follow', params, {headers: headers});
  }

  unFollow(token, userId) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);
    return this.httpClient.delete(this.url + 'follow/' + userId, {headers: headers});
  }

  getMyFollows(token) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', token);
    return this.httpClient.get(this.url + 'get-my-follows/true', {headers: headers});
  }

}
