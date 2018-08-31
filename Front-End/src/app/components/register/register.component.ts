import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public user: User;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
     this.user = new User('', '', '', '', '', '', '', '');
  }

  ngOnInit() {
  }

  onSubmit(registerForm) {

  }

}
