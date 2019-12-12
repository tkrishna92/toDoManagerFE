import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from 'src/app/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-todo-manager',
  templateUrl: './todo-manager.component.html',
  styleUrls: ['./todo-manager.component.css']
})



export class TodoManagerComponent implements OnInit {

  public faFriend = faUserFriends;

  public authToken : string;
  public userInfo : any;
  public listOwner : string;
  public listStatus : string;
  public onlineUsers : any =[];
  public userLists : any = [];
  public friendList : any = [];
  public toDoUsersList : any = [];


  constructor(private cookies : CookieService, private _userHttp : UsersService, private toaster: ToastrService, private router : Router, private socketService : SocketService) { }

  ngOnInit() {
    this.authToken = this.cookies.get('authToken');
    this.userInfo = this._userHttp.getUserDetails();

    this.verifyUser();
    this.UpdatedOnlineUsers();

  }

  public verifyUser = () =>{
    this.socketService.verifyUser().subscribe(
      data =>{
        console.log("sending auth token")
        this.socketService.checkAuthToken(this.authToken); // to send authToken on login for verification
        this.socketService.updatedOnlineUsers();
      }
    )
  }

  public UpdatedOnlineUsers = ()=>{
    this.socketService.updatedOnlineUsers().subscribe(
      data=>{
        this.onlineUsers = []; // to create a new list of online users everytime the list gets updated
        console.log(data);
      }
    )
  }




}
