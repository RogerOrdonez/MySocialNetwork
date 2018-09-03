import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';Router
import { User} from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public user: User;
  public identity;
  public token;
  public success;
  public filesToUpload: Array<File>;
  public url: string;

  constructor(private activatedRoute: ActivatedRoute, 
              private router: Router,
              private userService: UserService,
              private uploadService: UploadService) {
    this.user = this.userService.getIdentity();
    this.identity = this.user;
    this.token = this.userService.getToken();
    this.url = environment.backendUrl;
  }

  ngOnInit() {
  }

  onSubmit(editForm) {
     this.userService.updateUser(this.user)
         .subscribe( response => {
           if (response) {
            this.success = true;
            localStorage.setItem('identity', JSON.stringify(this.user));
            this.identity = this.user;
            this.uploadService.makeFileRequest(
              this.url + 'upload-image-user/' + this.user._id,
              [],
              this.filesToUpload,
              this.token,
              'image'
            )
            .then((result: any) => {
              this.user.image = result.user.image;
              localStorage.setItem('identity', JSON.stringify(this.user));
            })
            .catch(error => {
              console.log(error);
              this.success = false;
            });
           } else {
            this.success = false;
           }
         },
        error => {
           console.log(<any>error);
           this.success = false;
        });
  }

  onFileChange(fileInput: any) {
    this.filesToUpload = <Array<File>> fileInput.target.files;
  }

}
