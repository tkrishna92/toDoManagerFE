import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstCharComponent } from './first-char/first-char.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [FirstCharComponent],
  imports: [
    CommonModule
  ],
  exports : [
    CommonModule,
    FirstCharComponent,
    FormsModule

  ]
})
export class SharedModule { }
