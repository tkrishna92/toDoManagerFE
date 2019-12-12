import { Injectable } from '@angular/core';


import * as io from 'socket.io-client';
import {Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http'
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})


export class SocketService {

  public url = 'http://localhost:3000';

  public socket;

  // creating handshake with the socket
  constructor(private _http: HttpClient, private cookies : CookieService) { 
    this.socket = io(this.url);
  }

  // handling error event from socket
  

  // handling verifyUser event on connection
  public verifyUser = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('verifyUser',(data)=>{
        console.log("verifyUser heard"+data);
        observer.next(data);
      })
    })
  
  }

  // handling updated online user list
  public updatedOnlineUsers = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('online-user-list', (onlineUsers)=>{
        console.log(onlineUsers);
        observer.next(onlineUsers);
      })
    })
  }


  // handling various events that will be occurring on the userId



//------------------------emiting events--------------------

  // handling emiting authToken for token verification
  public checkAuthToken = (authToken)=>{
    console.log("sending 'auth-user' event");
    this.socket.emit('auth-user', (authToken))
  }

  // emiting event to get user lists

  public getUserLists = (data)=>{

  }




}


