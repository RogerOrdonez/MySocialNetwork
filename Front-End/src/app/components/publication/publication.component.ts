import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Publication } from '../../models/publication.model';
import { UserService } from '../../services/user.service';
import { faImage, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faTimesCircle as faTimeCircleReg } from '@fortawesome/free-regular-svg-icons';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-publication',
  templateUrl: './publication.component.html',
  styleUrls: ['./publication.component.css']
})
export class PublicationComponent implements OnInit {
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
  public newPost;
  @Output() sentPost = new EventEmitter(true);
  public editedText;
  public editedPublication;
  public editedImage;
  public changed: boolean;
  public originalText;
  @Input() userId;
  public editMode: boolean;
  public filesToUpload: Array<File>;
  public filesToUpdate: Array<File>;
  public urlUpdateImage;
  @ViewChild('inputFile') inputFile: ElementRef;
  @ViewChild('updateFile') updateFile: ElementRef;
  closeResult: string;

  constructor(
      private publicationService: PublicationService,
      private userService: UserService,
      private router: Router,
      private uploadService: UploadService,
      private modalService: NgbModal
  ) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = environment.backendUrl;
    this.publication = new Publication('', '', '', '', null);
    this.newPost = 0;
    this.page = 1;
    this.editMode = false;
    this.changed = false;
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
                                      newPublication.reset();
                                      this.urlImage = null;
                                      this.filesToUpload = null;
                                      this.success = true;
                                      this.newPost += 1;
                                      this.sentPost.emit(this.newPost);
                                      this.getPublications(1, false, this.userId);
                                    });
                                }
                                newPublication.reset();
                                this.urlImage = null;
                                this.filesToUpload = null;
                                this.success = true;
                                this.newPost += 1;
                                this.sentPost.emit(this.newPost);
                                this.getPublications(1, false, this.userId);
                             } else {
                              this.success = false;
                            }
                           }
                           ,
                           error => {
                             this.success = false;
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

  fileUpdateEvent(inputFile: any) {
    this.filesToUpdate = <Array<File>>inputFile.target.files;
    if (inputFile.target.files && inputFile.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(inputFile.target.files[0]);
      reader.onload = (event: any) => {
        this.urlUpdateImage = event.target.result;
        this.changed = true;
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

  removeUpdateImage() {
      this.urlUpdateImage = null;
      this.filesToUpdate = null;
      this.updateFile.nativeElement.value = '';
  }

  editPost(publicationId, originalText) {
    this.editedPublication = publicationId;
    this.originalText = originalText;
    this.editedText = originalText;
    this.editMode = true;
  }

  deleteImage(image) {
    this.editedImage = 'null';
    this.changed = true;
  }

  cancelEdit() {
    this.editMode = false;
    this.editedPublication = null;
    this.editedImage = null;
    this.originalText = null;
    this.changed = false;
    this.filesToUpload = null;
    this.urlImage = null;
  }

  updateText() {
    if (this.editedText !== this.originalText) {
      this.changed = true;
    } else {
      this.changed = false;
    }
  }

  updatePublication() {
    if (this.editedImage === undefined) {
      this.editedImage = 'null';
    }
    this.publicationService.updatePublication(this.token, this.editedPublication, this.editedText, this.editedImage)
                           .subscribe(
                            (response: any) => {
                              if (response) {
                                if (this.filesToUpdate) {
                                  this.uploadService.makeFileRequest(
                                      this.url + 'upload-image-pub/' + this.editedPublication,
                                      [],
                                      this.filesToUpdate,
                                      this.token,
                                      'image'
                                    )
                                    .then((result: any) => {
                                      this.success = true;
                                      this.editMode = false;
                                      this.editedPublication = null;
                                      this.editedImage = null;
                                      this.originalText = null;
                                      this.changed = false;
                                      this.filesToUpdate = null;
                                      this.urlImage = null;
                                      this.urlUpdateImage = null;
                                      this.getPublications(1, false, this.userId);
                                    });
                                }
                                this.success = true;
                                this.editMode = false;
                                this.editedPublication = null;
                                this.editedImage = null;
                                this.originalText = null;
                                this.changed = false;
                                this.filesToUpdate = null;
                                this.urlImage = null;
                                this.urlUpdateImage = null;
                                this.getPublications(1, false, this.userId);
                              }
                            },
                            error => {
                              this.success = false;
                            });
  }

  deletePost(publicationId) {
    this.publicationService.deletePublication(this.token, publicationId)
                          .subscribe(
                            response => {
                                this.success = true;
                                this.newPost -= 1;
                                this.sentPost.emit(this.newPost);
                                this.getPublications(1, false, this.userId);
                            },
                            error => {
                              this.success = false;
                              console.log(<any>error);
                            });
  }

}
