import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService} from '../../services/user.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: User;
  public success: Boolean;
  public identity;
  public token;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService) {
    this.user = new User('', '', '', '', '', '', '', '');
  }

  ngOnInit() {
  }

  onSubmit(loginForm) {
    this.userService.signUp(this.user)
        .subscribe((response: any) => {
            this.identity = response.user;
            if ( !this.identity || !this.identity._id) {
              this.success = false;
            } else {
              this.success = true;
              localStorage.setItem('identity', JSON.stringify(this.identity));
              this.getToken();
            }
            loginForm.reset();
       },
        error => {
          console.log(<any>error);
          this.success = false;
        });
  }

  getToken() {
    this.userService.signUp(this.user, 'true')
        .subscribe((response: any) => {
            this.token = response.token;
            if ( !this.token) {
              this.success = false;
            } else {
              localStorage.setItem('token', JSON.stringify(this.token));
              this.success = true;
            }
       },
        error => {
          console.log(<any>error);
          this.success = false;
        });
  }

}
