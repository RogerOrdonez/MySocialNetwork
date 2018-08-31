import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService} from '../../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public user: User;
  public success: Boolean;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService) {
     this.user = new User('', '', '', '', '', '', '', '');
  }

  ngOnInit() {
  }

  onSubmit(registerForm) {
     this.userService.register(this.user)
                     .subscribe (
                       response => {
                          if (response.user && response.user._id){
                            this.success = true;
                            registerForm.reset();
                          } else {
                            this.success = false;
                          }
                       },
                       error => {
                         console.log(<any>error);
                         this.success = false;
                       }
                     );
  }

}
