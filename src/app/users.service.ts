import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UsersService {

  public userUrl = "http://localhost:3000/api/v1/users"

  constructor(private _http : HttpClient) { }

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

  public loginUser(data) : any {
    const param = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)

    return this._http.post(`${this.userUrl}/login`, (data));
  }

  public getCountryList(): any {
    return this._http.get(`${this.userUrl}/getCountryCodes`);    
  }

  public getCode(country): any{
    const param1 = new HttpParams()
      .set('countryName', country);
    return this._http.post(`${this.userUrl}/getCountryPhoneCode`, param1)
  }

  public setUserDetails(data){
    console.log(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  }

  public getUserDetails(){
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public userLogout = (authToken) : any=>{
    return this._http.put(`${this.userUrl}/logout`,(authToken))
  }


}
