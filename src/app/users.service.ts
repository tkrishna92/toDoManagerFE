import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  public userUrl = "http://localhost:3000/api/v1/users"

  constructor(private _http : HttpClient, private cookies : CookieService) { }


  // signup user
  public signupUser(data) : any {
    const param = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('countryCode', data.countryCode)
      .set('email', data.email)
      .set('password', data.password)

    return this._http.post(`${this.userUrl}/signup`, (param));
  }


  // login user
  public loginUser(data) : any {
    const param = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)

    return this._http.post(`${this.userUrl}/login`, (data));
  }

  // for signup purpose
  public getCountryList(): any {
    return this._http.get(`${this.userUrl}/getCountryCodes`);    
  }

  // get country telephone code for signup purpose
  public getCode(country): any{
    const param1 = new HttpParams()
      .set('countryName', country);
    return this._http.post(`${this.userUrl}/getCountryPhoneCode`, param1)
  }

  // after login for saving user data in local storage
  public setUserDetails(data){
    console.log(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  // for getting logged in user details from local storage
  public getUserDetails(){
    return JSON.parse(localStorage.getItem('userInfo'));
  }


  // for logout
  public userLogout(data) : any{
    
    return this._http.put(`${this.userUrl}/logout?authToken=${data}`,(data))
  }


  // for forgotPassword
  public forgotUserPassword(data) : any{
    const param2 = new HttpParams()
      .set('email', data.email)
      .set('mobileNumber', data.mobileNumber)

    return this._http.post(`${this.userUrl}/forgotPassword`, param2);
  }

  // for editing password
   public editPassword(data): any{
     const param3 = new HttpParams()
     .set('password', data.password)
     
     return this._http.put(`${this.userUrl}/editPassword?authToken=${data.authToken}`, param3);
   }

   // for getting single user details
   public getSelectedUserDetails(data): any{
    let param4 = new HttpParams()
    .set('userId', data.userId)

    return this._http.put(`${this.userUrl}/getSingleUser?authToken=${this.cookies.get('authToken')}`, param4);

   }



}
