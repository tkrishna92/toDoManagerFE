import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/users.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  public email : string;
  public mobileNumber : string;
  public editUrl : string;

  constructor(private router : Router, private _http: UsersService, private toaster : ToastrService, private cookies : CookieService) { }

  ngOnInit() {
  }

  public checkMobileNumber (): any{
    let data = {
      email : this.email,
      mobileNumber : this.mobileNumber
    }

    this._http.forgotUserPassword(data).subscribe(
      data =>{
        if(data.status == "200"){
          this.toaster.success("account verified")
          setTimeout(()=>{
            this.cookies.set('authToken', `${data.data.userToken}`)
            this.router.navigate(['editpassword'])
          })
        }else{          
          this.toaster.warning(data.message)
        }
      }
    )
  }

  public goToLogin(): any{
    this.router.navigate(['/']);
  }

  public gotoSignup(): any {
    this.router.navigate(['signup']);
  }

}
