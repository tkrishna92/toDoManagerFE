import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';



// added modules and services
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { EdituserComponent } from './edituser/edituser.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { EditpasswordComponent } from './editpassword/editpassword.component';
import { EditUserRouteGaurdService } from './edit-user-route-gaurd.service';


@NgModule({
  declarations: [LoginComponent, SignupComponent, EdituserComponent, ForgotpasswordComponent, EditpasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      {path: 'signup', component : SignupComponent},
      {path : 'edituser', component : EdituserComponent},
      {path : 'forgotpassword', component : ForgotpasswordComponent},
      {path : 'editpassword', component : EditpasswordComponent, canActivate:[EditUserRouteGaurdService]}
    ])
  ]
})
export class UserModule { }
