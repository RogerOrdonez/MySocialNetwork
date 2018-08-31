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

}
