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
  public success;
  constructor(private userService: UserService) {
    this.identity = this.userService.getIdentity();
    this.token = this.userService.getToken();
    this.url = environment.backendUrl;
  }

  ngOnInit() {
    console.log('Componente Sidebar cargado');
    this.stats = this.userService.getStats();
    this.userService.getCounters()
                    .subscribe((response: any) => {
                       localStorage.setItem('stats', JSON.stringify(response));
                       this.stats = this.userService.getStats();
                       this.success = true;
                    },
                    error => {
                      console.log(<any>error);
                    });
  }

}
