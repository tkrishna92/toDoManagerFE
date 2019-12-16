import { Injectable } from '@angular/core';


import * as io from 'socket.io-client';
import {Observable, observable} from 'rxjs';
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
  public socketError = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('error-occurred', (data)=>{
        // console.log("error occurred in the socket service :");
        // console.log(data);
        observer.next(data);
      })
    })
  }


  // handling verifyUser event on connection
  public verifyUser = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('verifyUser',(data)=>{
        // console.log("verifyUser heard"+data);
        observer.next(data);
      })
    })
  
  }

  // handling updated online user list
  public updatedOnlineUsers = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('online-user-list', (onlineUsers)=>{
        observer.next(onlineUsers);
      })
    })
  }


  // handling various events that will be occurring on the userId
  public eventOnUserId = ()=>{
    return Observable.create((observer)=>{
      let userId = this.cookies.get('userId')
      
      this.socket.on(userId, (data)=>{
        // console.log(data);
        observer.next(data);
      })
    })
  }

  //handling friend notifications
  public friendNotification = ()=>{
    return Observable.create((observer)=>{
      
      this.socket.on('friend-request-notification', (data)=>{
        console.log("received friend notification :");
        console.log(data);
        observer.next(data);
      })
    })
  }

  //handling toDo action notifications
  public toDoActionNofitication = ()=>{
    return Observable.create((observer)=>{
      this.socket.on('action-notification',(data)=>{
        console.log("received todo action notification :")
        console.log(data);
        observer.next(data);
      })
    })
  }



//------------------------emiting events--------------------

  // handling emiting authToken for token verification
  public checkAuthToken = (authToken)=>{
    // console.log("sending 'auth-user' event");
    // console.log(authToken);
    this.socket.emit('auth-user', (authToken))
  }

  public getUserLists = (request)=>{
    console.log("sending get user list event")
    console.log(request);
    this.socket.emit('get-user-lists', request)
  }

  public getUserFriends = (request)=>{
    // console.log("sending get-friends event");
    this.socket.emit('get-friends', request);
  }

 public joinFriendsRooms = (userId)=>{
  //  console.log("sending join-friends-rooms event")
   this.socket.emit('join-friends-rooms', userId)
 }

 public getFriendRequestCount = (userId)=>{
  //  console.log("get friend request count event emitted");
   this.socket.emit('friend-request-count', (userId));
 }

 public getTodoAppUsers = (userId)=>{
  //  console.log("get all the todo app users event emitted");
   this.socket.emit('get-todo-users', (userId));
 }
 


 // emitting notification events

 // emitting friend action notification event
 public sendFriendNotification = (data)=>{
   console.log("send friend request notification"+data);
   
  this.socket.emit('friend-request', data);
 }

 // emitting todo action notification event
 public sendTodoActionNotification = (data)=>{
   console.log("send todo action notification"+data);
  this.socket.emit("list-action", (data));

 }




}


