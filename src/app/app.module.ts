import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//importing start

// angular
 import {RouterModule , Routes} from '@angular/router';
 import {HttpClientModule} from '@angular/common/http';
 import {FormsModule} from '@angular/forms';
 import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
 import { NgxSpinnerModule} from "ngx-spinner";

// external modules

 import {ToastrModule} from 'ngx-toastr';
 import {CookieService} from 'ngx-cookie-service';


 // components, modules and services
  
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './user/login/login.component';
import { UsersService } from './users.service';
import { TodoService } from './todo.service';
import { FriendsService } from './friends.service';





@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TodoModule,
    UserModule,
    SharedModule,
    FormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      {path : 'login', component : LoginComponent, pathMatch : 'full'},
      {path : '', redirectTo : 'login', pathMatch : 'full'},
      {path : '*', component : LoginComponent},
      {path : '**', component : LoginComponent}
    ])

  ],
  providers: [HttpClientModule, CookieService, UsersService, TodoService, FriendsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
