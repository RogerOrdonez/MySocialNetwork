import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public title: String;
  constructor(private router: Router) {
    this.title = 'Bienvenido a ngFollow';
    this.router.navigate(['/home']);
  }

  ngOnInit() {
  }

}
