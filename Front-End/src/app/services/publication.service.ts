import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Publication } from '../models/publication.model';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  public backendUrl: string;
  public url: string;
  constructor(private http: HttpClient) {
    this.backendUrl = environment.backendUrl;
   }

   addPublication(token, publication: Publication) {
      const params = JSON.stringify(publication);
      const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
      return this.http.post(this.url + 'publication', params, {headers: headers});
   }

   getPublications(token, page = 1, userId?) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
      if (userId) {
        this.url = `publications/${userId}/${page}`;
      } else {
        this.url = `publications/${page}`;
      }
      return this.http.get(this.backendUrl + this.url, {headers: headers})
                      .pipe(retry(1));
   }

   deletePublication(token, publicationId) {
      const headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);
      return this.http.delete(this.url + 'publication/' + publicationId, {headers: headers});
   }


}
