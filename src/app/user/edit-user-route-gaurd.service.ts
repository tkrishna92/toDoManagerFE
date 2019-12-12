import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class EditUserRouteGaurdService implements CanActivate {

  constructor(private router: Router, private cookies : CookieService) { }

  canActivate(route : ActivatedRouteSnapshot):boolean{
    console.log("edit user route gaurd service activated");
    
    if(this.cookies.get('authToken')==="undefined" || this.cookies.get('authToken')==="null" || this.cookies.get('authToken')===""){
        this.router.navigate(['/']);
        return false;        
    }else {
      return true;
    }
  }
}
