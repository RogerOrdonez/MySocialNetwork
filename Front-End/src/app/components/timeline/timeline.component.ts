import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Publication } from '../../models/publication.model';
import { UserService } from '../../services/user.service';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { retry } from 'rxjs/operators';
import { PublicationService } from '../../services/publication.service';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  public identity;
  public token;
  public url;
  public success;
  public publication: Publication;
  public faImage = faImage;
  public page;
  public pages;
  public publications: Array<Publication>;
  public total;
  public itemsPerPage;
  public noMore = false;
  public retry = 0;

  constructor(private publicationService: PublicationService, private userService: UserService, private router: Router) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = environment.backendUrl;
    this.publication = new Publication('', '', '', '', null);
    this.page = 1;
  }

  ngOnInit() {
    if (this.token) {
      this.getPublications(this.page);
    }
  }

  onSubmit(newPublication) {
    this.publication.user = this.identity._id;
    this.publicationService.addPublication(this.token, this.publication)
                           .subscribe((response: any) => {
                             if (response.publication) {
                               this.publication = response.publication;
                               this.publications.unshift(this.publication);
                               newPublication.reset();
                               this.getPublications(1);
                               this.success = true;
                             } else {
                               this.success = false;
                             }
                           }
                           ,
                           error => {
                             this.success = false;
                             console.log(<any> error);
                           });
  }

  getPublications(page, adding = false) {
    this.publicationService.getPublications(this.token, page)
                           .subscribe((response: any) => {
                             if (response.publications) {
                               this.total = response.totalItems;
                               this.pages = response.pages;
                               this.itemsPerPage = response.itemsPerPage;
                               if (!adding) {
                                  this.publications = response.publications;
                                  if (this.publications.length === (this.total)) {
                                      this.noMore = true;
                                  }
                               } else {
                                 const publicationsCopy  = this.publications;
                                 const newPublications = response.publications;
                                 this.publications = publicationsCopy.concat(newPublications);
                                 if (this.publications.length === (this.total)) {
                                   this.noMore = true;
                                 } else {
                                   this.noMore = false;
                                 }
                               }
                               if (page > this.pages && this.pages > 0) {
                                 this.router.navigate(['/home']);
                               }
                               this.success = true;
                             } else {
                               this.success = false;
                             }
                           },
                           error => {
                             this.success = false;
                             console.log(<any> error);
                           });
  }

  viewMore() {
    if (this.publications.length === (this.total)) {
      this.noMore = true;
    } else {
      this.page += 1;
    }
    this.getPublications(this.page, true);
    // window.scrollTo(0, 0); Ir hasta arriba
  }


}
