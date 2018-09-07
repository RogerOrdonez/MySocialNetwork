import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  public identity;
  public token;
  public stats;
  public url;
  public succes;
  constructor(private userService: UserService) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.stats = this.userService.getStats();
    this.url = environment.backendUrl;
  }

  ngOnInit() {
    console.log('Componente Sidebar cargado');
  }

}
