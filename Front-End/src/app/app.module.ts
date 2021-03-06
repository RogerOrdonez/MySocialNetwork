import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AutosizeModule } from 'ngx-autosize';

import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AppRoutingModule } from './app.routing';
import { UserService} from './services/user.service';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { PersonComponent } from './components/person/person.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { FollowService } from './services/follow.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { PublicationService } from './services/publication.service';
import { MomentModule } from 'angular2-moment';
import { ProfileComponent } from './components/profile/profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PublicationComponent } from './components/publication/publication.component';
import { MessagesModule } from './messages/messages.module';
import { MessageService } from './services/message.service';
import { UserGuard } from './services/user.guard';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserComponent,
    PersonComponent,
    TimelineComponent,
    SidebarComponent,
    ProfileComponent,
    PublicationComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MomentModule,
    AutosizeModule,
    NgbModule,
    MessagesModule
  ],
  providers: [UserService,
              FollowService,
              PublicationService,
              MessageService,
              UserGuard
             ],
  bootstrap: [AppComponent]
})
export class AppModule { }
