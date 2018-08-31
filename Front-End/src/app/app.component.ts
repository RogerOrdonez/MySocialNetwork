import { Component } from '@angular/core';
import { faHome, faNewspaper, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngSocial';
  faHome = faHome;
  faNewspaper = faNewspaper;
  faUsers = faUsers;
}
