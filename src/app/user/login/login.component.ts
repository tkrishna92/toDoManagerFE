import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email : string;
  public password : string;

  constructor(private router : Router, private _http : UsersService, private toaster : ToastrService, private cookies : CookieService) { }

  ngOnInit() {
  }

  public gotoSignup(): any {
    this.router.navigate(['signup']);
  }

  public loginFunction():any {
    let data = {
      email : this.email,
      password : this.password
    }

    this._http.loginUser(data).subscribe(
      data=>{
        if(data.status == "200"){
          this.toaster.success("login success");
          setTimeout(()=>{
            this.cookies.set('userName',`${data.data.userDetails.firstName} ${data.data.userDetails.lastName}`)
            this.cookies.set('roomId',`${data.data.userDetails.roomId}`)
            this.cookies.set('authToken', `${data.data.userToken}`)
            this.cookies.set('userId', `${data.data.userDetails.userId}`)
            this._http.setUserDetails(data.data.userDetails);
            this.router.navigate(['todo'])
          })
          
        }else{
          this.toaster.error(`${data.message}`);
        }
      }
    )
  }

}
