import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faSignInAlt, faSearch, faShareAlt } from '@fortawesome/free-solid-svg-icons';

// sign-in-alt
// Descubre search
// Comparte share-alt

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public title: String;
  public faSignInAlt = faSignInAlt;
  public faSearch = faSearch;
  public faShareAlt = faShareAlt;
  constructor(private router: Router) {
    this.title = 'Bienvenido a ngFollow';
    this.router.navigate(['/home']);
  }

  ngOnInit() {
  }

}
