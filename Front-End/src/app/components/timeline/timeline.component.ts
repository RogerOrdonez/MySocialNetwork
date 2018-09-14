import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Publication } from '../../models/publication.model';
import { UserService } from '../../services/user.service';
import { faImage, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle as faTimeCircleReg } from '@fortawesome/free-regular-svg-icons';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { retry } from 'rxjs/operators';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  public identity;
  public token;
  public url;
  public urlImage;
  public success;
  public publication: Publication;
  public faImage = faImage;
  public faTimesCircle = faTimesCircle;
  public faTimeCircleReg = faTimeCircleReg;
  public page;
  public pages;
  public publications: Array<Publication>;
  public total;
  public itemsPerPage;
  public noMore = false;
  public retry = 0;
  @Input() userId;
  public filesToUpload: Array<File>;
  @ViewChild('inputFile') inputFile: ElementRef;

  constructor(
      private publicationService: PublicationService,
      private userService: UserService,
      private router: Router,
      private uploadService: UploadService
  ) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = environment.backendUrl;
    this.publication = new Publication('', '', '', '', null);
    this.page = 1;
  }

  ngOnInit() {
    if (this.token) {
      this.getPublications(this.page, false, this.userId);
    }
  }

  onSubmit(newPublication) {
    this.publication.user = this.identity._id;
    this.publicationService.addPublication(this.token, this.publication)
                           .subscribe((response: any) => {
                             if (response.publication) {
                                this.publication = response.publication;
                                this.publications.unshift(this.publication);
                                // Subir Imagen
                                if (this.filesToUpload) {
                                  this.uploadService.makeFileRequest(
                                      this.url + 'upload-image-pub/' + response.publication._id,
                                      [],
                                      this.filesToUpload,
                                      this.token,
                                      'image'
                                    )
                                    .then((result: any) => {
                                      this.publication.file = result.image;
                                    });
                                  newPublication.reset();
                                  this.urlImage = null;
                                  this.filesToUpload = null;
                                  this.getPublications(1, false, this.userId);
                                  this.success = true;
                                } else {
                                  this.success = false;
                                }
                                this.success = true;
                                this.getPublications(1, false, this.userId);
                             }
                           }
                           ,
                           error => {
                             this.success = false;
                             console.log(<any> error);
                           });
  }

  fileChangeEvent(inputFile: any) {
    this.filesToUpload = <Array<File>>inputFile.target.files;
    if (inputFile.target.files && inputFile.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(inputFile.target.files[0]);
      reader.onload = (event: any) => {
        this.urlImage = event.target.result;
      };
    }
  }

  getPublications(page, adding = false, userId?) {
    this.publicationService.getPublications(this.token, page, userId)
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
    this.getPublications(this.page, true, this.userId);
    // window.scrollTo(0, 0); Ir hasta arriba
  }

  removeImage() {
    this.urlImage = null;
    this.filesToUpload = null;
    this.inputFile.nativeElement.value = '';
  }

}
