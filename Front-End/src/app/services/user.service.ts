import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url: String;
  public identity;
  public token;
  public stats;

  constructor( public http: HttpClient) {
    this.url = environment.backendUrl;
  }

  register(user: User): Observable<any> {
    console.log(user);
    console.log(this.url);
    const params = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.url + 'register', params, {headers: headers});
  }

  signUp(user: User, getToken: String = null) {
    if (getToken != null ) {
      user.gettoken = getToken;
    }
    const params = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(this.url + 'login', params, {headers: headers});
  }

  getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity'));
    if (identity != 'undefined') {
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;

  }

  getToken() {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;

  }

  getStats() {
    const stats = JSON.parse(localStorage.getItem('stats'));
    if (stats) {
       this.stats = stats;
    } else {
       this.stats = null;
    }

    return this.stats;

  }

  getCounters(userId = null) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', this.getToken());
    if (userId != null) {
       return this.http.get(this.url + 'counters/' + userId, {headers: headers});
    } else {
      return this.http.get(this.url + 'counters', {headers: headers});
    }
  }

  updateUser(user: User){
    const params = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', this.getToken());
    return this.http.put(this.url + 'update-user/' + user._id, params, {headers: headers});
  }

  getUsers(page = null) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', this.getToken());
    return this.http.get(this.url + 'users/' + page, {headers: headers});
  }

  getUser(userId) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', this.getToken());
    return this.http.get(this.url + 'user/' + userId, {headers: headers});
  }

  getFollowing(userId, page = null) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', this.getToken());
    return this.http.get(this.url + 'following/' + userId + '/' + page, {headers: headers});
  }

  getFollowers(userId, page = null) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                     .set('Authorization', this.getToken());
    return this.http.get(this.url + 'follower/' + userId + '/' + page, {headers: headers});
  }

}
