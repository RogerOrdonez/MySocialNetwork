import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';Router
import { User} from '../../models/user.model';
import { UserService } from '../../services/user.service';

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

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private userService: UserService) {
    this.user = this.userService.getIdentity();
    this.identity = this.user;
    this.token = this.userService.getToken();
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
           } else {
            this.success = false;
           }
         },
        error => {
           console.log(<any>error);
           this.success = false;
        })
  }

}
