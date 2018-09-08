import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Publication } from '../../models/publication.model';
import { UserService } from '../../services/user.service';
import { faImage } from '@fortawesome/free-solid-svg-icons';


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

  constructor(private userService: UserService) { 
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = environment.backendUrl;
    this.publication = new Publication('', '', '', '', '');
  }

  ngOnInit() {
  }

  onSubmit() {
    this.publication.user = this.identity._id;
    console.log(this.publication);
  }

}
