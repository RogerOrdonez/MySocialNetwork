import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { PersonComponent } from './components/person/person.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'datos', component: UserComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'people', component: PersonComponent },
  { path: 'people/:page', component: PersonComponent },
  { path: 'profile/:id', component: ProfileComponent}
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
