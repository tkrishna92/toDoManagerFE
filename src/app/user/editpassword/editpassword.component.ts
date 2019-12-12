import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editpassword',
  templateUrl: './editpassword.component.html',
  styleUrls: ['./editpassword.component.css']
})
export class EditpasswordComponent implements OnInit {

  public password : string;

  constructor(private _http : UsersService, private router: Router, private toaster: ToastrService, private cookies: CookieService ) { }

  ngOnInit() {
  }

  public editPassword() : any{
    let data ={
      password : this.password,
      authToken : this.cookies.get('authToken')
    }

    if(!this.password){
      this.toaster.warning("please enter a password")
    }else {
      this._http.editPassword(data).subscribe(
        data =>{
          if(data.status == "200"){
            this.toaster.success("user password reset");
            setTimeout(()=>{
              this.router.navigate(['/']);
            })
          }else{
            this.toaster.error(data.message);
          }
        }
      )
    }
  }

  public gotologin() : any{
    this.router.navigate(['/']);
  }
  
  


}
