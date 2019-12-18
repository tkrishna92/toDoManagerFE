import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName : string;
  public lastName : string;
  public mobileNumber : number;
  public countryCode : string;
  public email : string;
  public password : string

  public countryList : any = [];
  public countryPhoneCode : string;
  public countryName: string;

  
  constructor(private _http: UsersService, private toaster : ToastrService, private router : Router )  { }

  ngOnInit() {
    this.getCountryList();

  }

  public signupFunction = (): any =>{
    let data = {
      firstName : this.firstName,
      lastName : this.lastName,
      mobileNumber : this.mobileNumber,
      countryCode : this.countryCode,
      email : this.email,
      password : this.password
    }

    if(!this.firstName){
      this.toaster.warning("please enter first name");
    }else if(!this.lastName){
      this.toaster.warning("please enter last name");
    }else if(!this.mobileNumber){
      this.toaster.warning("please enter mobile number");
    }else if(!this.countryName){
      this.toaster.warning("please select a country");
    }else if(!this.email){
      this.toaster.warning("please enter valid email");
    }else if(!this.password){
      this.toaster.warning("please enter password");
    }else { 
      data['countryCode'] = this.countryPhoneCode;
      console.log(data);
      this._http.signupUser(data).subscribe(
        data =>{
          console.log(data);
          if(!data.errorOccured){
            this.toaster.success("your account creation is successful");
          setTimeout(()=>{
            this.router.navigate(['/']);
          },1000)
          }else{
            this.toaster.error(data.message);
          }          
        },
        error =>{
          console.log(error.errorMessage);
          this.toaster.error(error);
        }
      )
    }
  }

  public goToSignin = (): any =>{
    this.router.navigate(['login']);
  }

  public getCountryList = (): any=>{
    this._http.getCountryList().subscribe(
      data=>{
        this.countryList = [];
        console.log(data.data);
        for(let x of data.data){ 
          this.countryList.push(x);
        }
        console.log(this.countryList)
      }
    )
  }

  public getCountryCode = (country): any=>{
    console.log("get country code called"+country);
    this._http.getCode(country).subscribe(
      data=>{
        console.log(data.data[0]);
        this.countryPhoneCode = `+${data.data}`
      }
    )
  }

  
}
