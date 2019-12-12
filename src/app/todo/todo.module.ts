import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoManagerComponent } from './todo-manager/todo-manager.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [TodoManagerComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule, 
    FontAwesomeModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([
      {path : 'todo', component : TodoManagerComponent}
    ])
  ]
})
export class TodoModule { }
