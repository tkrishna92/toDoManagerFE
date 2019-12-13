import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from 'src/app/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FriendsService } from 'src/app/friends.service';


@Component({
  selector: 'app-todo-manager',
  templateUrl: './todo-manager.component.html',
  styleUrls: ['./todo-manager.component.css']
})



export class TodoManagerComponent implements OnInit {

  public faFriend = faUserFriends;

  public authToken : string;
  public userInfo : any;
  public userName : string;
  public userId : string;
  public listOwner : string;
  public listStatus : string;
  public onlineUsers : any =[];
  public userLists : any = [];
  public userOldLists : any = [];
  public friendList : any = [];
  public toDoUsersList : any = [];
  public friendRequests : any = [];
  public requestCount : string;


  constructor(private cookies : CookieService, private _userHttp : UsersService, private _friendHttp: FriendsService, private toaster: ToastrService, private router : Router, private socketService : SocketService) { }

  ngOnInit() {
    this.authToken = this.cookies.get('authToken');
    this.userInfo = this._userHttp.getUserDetails();
    this.userId = this.cookies.get('userId');
    this.userName = this.cookies.get('userName');


    this.verifyUser();
    this.UpdatedOnlineUsers();
    this.getUserOpenLists(this.userId);
    this.getUserOldLists();
    this.getUserFriends()
    this.getUserDataOnUserId();
    this.joinFriendsRoom();
    this.getFriendRequestCount();
    this.getTodoUsers();

    // error handler
    this.socketErrorHandler();
    

  }


  //socket error handler
  public socketErrorHandler = ()=>{
    this.socketService.socketError().subscribe(
      data=>{
        console.log("error occurred in socket :"+data)
      }      
    )
  }


  // verify user on login
  public verifyUser = () =>{
    this.socketService.verifyUser().subscribe(
      data =>{
        console.log("sending auth token")
        this.socketService.checkAuthToken(this.authToken); // to send authToken on login for verification
        this.socketService.updatedOnlineUsers();
      }
    )
  }

  // subscribe to updated online user list - provides an updated online user list on every update
  public UpdatedOnlineUsers = ()=>{
    this.socketService.updatedOnlineUsers().subscribe(
      data=>{
        console.log("received online user list on another user login or logout")
        this.onlineUsers = data; // to create a new list of online users everytime the list gets updated
        
        
        console.log(this.onlineUsers);
      }
    )
  }


  //get the selected user's lists that are of status "open"
  public getUserOpenLists = (listOwner)=>{
    let request = {
      userId : this.userId,
      listOwner : listOwner,
      listStatus : "open"
    }
    this.socketService.getUserLists(request)
  }

  // get the user's old lists with status "done"
  public getUserOldLists = ()=>{
    let request = {
      userId : this.userId,
      listOwner : this.userId,
      listStatus : "done"
    }
    this.socketService.getUserLists(request)
  }


  // get friends details of the user
  public getUserFriends = ()=>{
    let request = {
      userId : this.userId
    }
    this.socketService.getUserFriends(request);
  }


  // join all the friends rooms of the user to listen to their notifications
  public joinFriendsRoom = ()=>{
    this.socketService.joinFriendsRooms(this.userId);
  }

  // on login get a count of pending friend requests
  public getFriendRequestCount = ()=>{
    this.socketService.getFriendRequestCount(this.userId);
  }


  // on login get a list of all users that use the todo app
 public getTodoUsers=()=>{
   this.socketService.getTodoAppUsers(this.userId);
 }


 // it subscribe to a range of data on the userId of the user logged in
 public getUserDataOnUserId = ()=>{
   this.socketService.eventOnUserId().subscribe(
     data=>{
      //  console.log(data);
       if(data.userList){
         if(data.requestDetails.listStatus== "open"){
           this.userLists = data.userList.data;           
         }else if(data.requestDetails.listStatus== "done"){
           this.userOldLists = data.userList.data;           
         }else {
           console.log("no user lists available")
         }
       }else if(data.userFriends){
         this.friendList = data.userFriends;
        //  console.log(this.friendList);
       }else if(data.requestCount){

         this.requestCount = data.requestCount.data;
         console.log(this.requestCount);
       }else if(data.todoUsers){
         console.log(data.todoUsers);
         this.toDoUsersList = data.todoUsers.data;
       }
     }
   )
 }


 //----------------http call functions------------------------------

 public getPendingRequest: any = ()=>{
   this._friendHttp.CheckFriendRequests().subscribe(
     data=>{
       
       this.friendRequests = [];
       this.friendRequests = data.data;
       console.log(this.friendRequests);
     }
   )
 }



}
