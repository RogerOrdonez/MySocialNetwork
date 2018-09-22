import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { PersonComponent } from './components/person/person.component';
import { ProfileComponent } from './components/profile/profile.component';
import { MainComponent } from './messages/components/main/main.component';
import { AddComponent } from './messages/components/add/add.component';
import { ReceivedComponent } from './messages/components/received/received.component';
import { SendedComponent } from './messages/components/sended/sended.component';
import { UserGuard } from './services/user.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'datos', component: UserComponent, canActivate: [UserGuard]},
  { path: 'timeline', component: TimelineComponent, canActivate: [UserGuard] },
  { path: 'people', component: PersonComponent, canActivate: [UserGuard] },
  { path: 'people/:page', component: PersonComponent, canActivate: [UserGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [UserGuard]},
  { path: 'profile/:id/:option', component: ProfileComponent, canActivate: [UserGuard]},
  {
    path: 'messages',
    component: MainComponent,
    children: [
      {path: '', redirectTo: 'received', pathMatch: 'full', canActivate: [UserGuard]},
      {path: 'send', component: AddComponent, canActivate: [UserGuard]},
      {path: 'received', component: ReceivedComponent, canActivate: [UserGuard]},
      {path: 'sended', component: SendedComponent, canActivate: [UserGuard]}
    ],
    canActivate: [UserGuard]
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
