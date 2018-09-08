import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Publication } from '../../models/publication.model';
import { UserService } from '../../services/user.service';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute, Params } from '@angular/router';
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

  constructor(private publicationService: PublicationService, private userService: UserService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = environment.backendUrl;
    this.publication = new Publication('', '', '', '', '');
  }

  ngOnInit() {
    console.log('Componente Timeline cargado');
  }

  onSubmit(newPublication) {
    this.publication.user = this.identity._id;
    console.log(this.publication);
    this.publicationService.addPublication(this.token, this.publication)
                           .subscribe((response: any) => {
                             if(response.publication) {
                               this.publication = response.publication;
                               newPublication.reset();
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

}
