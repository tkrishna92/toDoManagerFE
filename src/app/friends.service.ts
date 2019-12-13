import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  public friendUrl = "http://localhost:3000/api/v1/friends"

  constructor(private _http : HttpClient, private cookies : CookieService) { }


  // send a friend request
  public sendFriendRequest(data): any{
    const param = new HttpParams()
    .set('userId', data)
    

    return this._http.post(`${this.friendUrl}/sendFriendRequest?authToken=${this.cookies.get('authToken')}`, param);
  }

  // check for friend requests
  public CheckFriendRequests(): any{
    console.log("check friends called");
    return this._http.get(`${this.friendUrl}/checkRequest?authToken=${this.cookies.get('authToken')}`)
  }


  //accept Friend request
  public acceptFriendRequest(friendId) : any{
    const param = new HttpParams()
    .set('friendId', friendId)

    return this._http.put(`${this.friendUrl}/acceptFriend?authToken=${this.cookies.get('authToken')}`, param);
  }




}
