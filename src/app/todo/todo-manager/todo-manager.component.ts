import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from 'src/app/users.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/socket.service';
import { faUserFriends, faPlusCircle, faEdit, faTrash, faUndo, faRedo, faEllipsisV, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FriendsService } from 'src/app/friends.service';
import { TodoService } from 'src/app/todo.service';



@Component({
  selector: 'app-todo-manager',
  templateUrl: './todo-manager.component.html',
  styleUrls: ['./todo-manager.component.css'],
  providers : [SocketService]
})



export class TodoManagerComponent implements OnInit {

  @ViewChild('scrollMe', {read: ElementRef, static: true} )

   public scrollMe: ElementRef;

  public faFriend = faUserFriends;
  public plus = faPlusCircle;
  public editIcon = faEdit;
  public recycleIcon = faTrash;
  public undoIcon = faUndo;
  public redoIcon = faRedo;
  public optionsIcon = faEllipsisV;
  public markAsDone = faCheck;

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
  public listTitle : string;
  public listDescription : string;
  public title : string; // item title
  public description : string; // item description
  public dueDate : string; // item due date
  public parent : string; // items parent for sub-todo-items
  public currentList : any = [];
  public currentItem : any = [];
  public listItems : any = [];
  public listDoneItems : any = [];


  constructor(private cookies : CookieService, private _todoHttp : TodoService, private _userHttp : UsersService, private _friendHttp: FriendsService, private toaster: ToastrService, private router : Router, private socketService : SocketService) { }

  ngOnInit() {
    this.authToken = this.cookies.get('authToken');
    this.userInfo = this._userHttp.getUserDetails();
    this.userId = this.cookies.get('userId');
    this.userName = this.cookies.get('userName');


    this.verifyUser();
    this.UpdatedOnlineUsers();
    this.getUserOpenLists();
    this.getUserOldLists();
    this.getUserFriends();
    this.getUserDataOnUserId();
    this.joinFriendsRoom();
    this.getFriendRequestCount();
    this.getTodoUsers();
    this.getFriendNotifications();
    this.getTodoActionNotifications();
    this.getTodoItemActionNotifications();

    // error handler
    this.socketErrorHandler();
    

  }


  //socket error handler
  public socketErrorHandler = ()=>{
    this.socketService.socketError().subscribe(
      data=>{
        console.log(data);
        if(data.error = "invalid token provided" && data.status== "500"){
          console.log("error occurred in socket :"+data)
          console.log(data);
          this.router.navigate(['/'])
        }else if(data.userList && data.userId == this.userId && data.request.listStatus=="open"){
          console.log("error occurred in socket :"+data)
          console.log(data);
          this.toaster.warning(data.userList.message);
          this.userLists = [];
          this.listOwner = data.request.listOwner;
          console.log(this.listOwner);
        }else if(data.userList && data.userId == this.userId && data.request.listStatus=="done"){
          console.log("error occurred in socket :"+data)
          console.log(data);
          this.toaster.info(`${data.userList.message} that are done`);
          this.userOldLists = [];
          this.listOwner = data.request.listOwner;
          console.log(this.listOwner);
        }
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


  //get the selected user's lists that are of status "open" on login
  public getUserOpenLists = ()=>{
    let request = {
      userId : this.userId,
      listOwner : this.userId,
      listStatus : "open"
    }
    this.socketService.getUserLists(request)
    this.listOwner = this.userId;
  }

  public getSelectedUserOpenLists = (listOwner)=>{
    let request = {
      userId : this.userId,
      listOwner : listOwner,
      listStatus : "open"
    }
    this.socketService.getUserLists(request)
    this.listOwner = listOwner;
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


 // listening to friend notification action
 public getFriendNotifications = ()=>{
   this.socketService.friendNotification().subscribe(
     data=>{
       this.toaster.info(data.receiverName+data.message+data.senderName);
     }
   )
 }

 // listening to toDo action notifications
  
 public getTodoActionNotifications = ()=>{
   this.socketService.toDoActionNofitication().subscribe(
     data=>{
       console.log(data);
       this.toaster.info(data.message);
       let request = {
        userId : this.userId,
        listOwner : this.listOwner,
        listStatus : "open"
      }
      this.socketService.getUserLists(request)
     }
   )
 }

 // listening to toDo item action notifications
  
 public getTodoItemActionNotifications = ()=>{
  this.socketService.toDoItemActionNofitication().subscribe(
    data=>{
      if(this.currentList.listId == data.details.listId){
        this.toaster.info(data.message);
        this.makeGetListItemRequests();
        this.makeGetListDoneItemsRequests();
      }else{
        this.toaster.info(data.message);
      }
    }
  )
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
           console.log(data);
           console.log("no user lists available")
           
         }
       }else if(data.userFriends){
        //  console.log(data);
         this.friendList = data.userFriends.data;
         console.log(this.friendList);
       }else if(data.requestCount){

         this.requestCount = data.requestCount.data;
        //  console.log(this.requestCount);
       }else if(data.todoUsers){
        //  console.log(data.todoUsers);
         this.toDoUsersList = data.todoUsers.data;
       }
     }
   )
 }




 //---------------- functions used in http calls------------------------------

  //-------------- for list related actions ----------------------------------

 public getCurrentList: any = (listId, listOwner)=>{
  console.log(listId);
  let data = {
    listId : listId,
    listOwnerId : listOwner
  }
  this._todoHttp.getListDetails(data).subscribe(
    data=>{
      console.log(data);
      if(data.status=="200"){
        this.currentList = data.data;
        this.makeGetListItemRequests();
        this.makeGetListDoneItemsRequests();
      }else{
        this.toaster.warning(data.message+"error editing the list")
      }
    }
  )
}

public makeGetUserListsRequests: any = ()=>{
    let request = {
    userId : this.userId,
    listOwner : this.listOwner,
    listStatus : "open"
  }
  this.socketService.getUserLists(request)
}

public makeGetUserDoneListsRequests: any = ()=>{
  let request = {
  userId : this.userId,
  listOwner : this.listOwner,
  listStatus : "done"
}
this.socketService.getUserLists(request)
}

//-------------- for item related actions ----------------------------------

public getCurrentItem: any = (itemId)=>{
  console.log(itemId);
  let data = {
    listId : this.currentList.listId,
    listOwnerId : this.currentList.listOwner,
    itemId : itemId
  }

  this._todoHttp.getItemDetails(data).subscribe(
    data=>{
      console.log(data);
      if(data.status=="200"){
        this.currentItem = data.data;
      }else{
        this.toaster.warning(data.message+"error editing the Item")
      }
    }
  )
}

public makeGetListItemRequests: any = ()=>{
    let request = {
    listId : this.currentList.listId,
    listOwnerId : this.currentList.listOwner,
    status : "open"
  }
  this._todoHttp.getListItems(request).subscribe(
    data=>{
      
      console.log(data);
      if(data.status == "200"){
        this.listItems = [];
        this.listItems = data.data;
        this.toaster.success(data.message);
        console.log(this.listItems)
      }else{
        this.listItems = [];
        this.toaster.warning(data.message);
      }
    }
  )
}

public makeGetListDoneItemsRequests: any = ()=>{
  let request = {
    listId : this.currentList.listId,
    listOwnerId : this.currentList.listOwner,
    status : "done"
}
this._todoHttp.getListDetails(request).subscribe(
  data=>{
    console.log(data);
    if(data.status == "200"){
      this.listDoneItems = data.data;
      this.toaster.info(data.message);
    }else{
      this.toaster.warning(data.message);
    }
  }
)
}




// ----------------------- http calls-------------------------


// ------friend related http calls----------------------------
 public getPendingRequest: any = ()=>{
   this._friendHttp.CheckFriendRequests().subscribe(
     data=>{
       
       this.friendRequests = [];
       this.friendRequests = data.data;
       console.log(this.friendRequests);
     }
   )
 }

 public acceptFriend: any = (data)=>{
   this._friendHttp.acceptFriendRequest(data.friendId).subscribe(
     data=>{
       if(data.status == "200"){
         this.toaster.success("friend accepted")
         data['notificationMessage']=" is now friends with "
         this.socketService.sendFriendNotification(data);
       }
     }
   )
 }



 // ------user related http calls-----------------------------
 public logoutUser: any = ()=>{
    this._userHttp.userLogout(this.cookies.get('authToken')).subscribe(
      data=>{
        console.log(data);
        if(data.status == "200"){
          this.toaster.success('logout success');
          this.router.navigate(['/']);
        }else{
          this.toaster.warning('logout failed');
        }
      }
    )
 }



// ------todo manager related http calls-----------------------------



// ------list http calls-----------------------------
 public createNewList: any = (listOwner)=>{

  console.log(this.listOwner);

  let data ={
    listTitle : this.listTitle,
    listDescription : this.listDescription,
    listOwner : this.listOwner
  }
   console.log(data);
   this._todoHttp.createNewList(data).subscribe(
     data=>{
       console.log(data);
       if(data.status== "200"){
         this.toaster.success(data.message);
         let actionData ={
           roomId : this.userInfo.roomId,
           userName : this.userName,
           notificationMessage : `created a new list ${data.data.listTitle}`
         }
         this.socketService.sendTodoActionNotification(actionData);
         console.log("user lists data")
         this.makeGetUserListsRequests();
       }else{
         this.toaster.warning(data.message);
       }
     }
   )
 }


 

 public editExistingList: any = (listId)=>{
   let data = {
     listTitle : this.listTitle,
     listDescription : this.listDescription,
     listOwnerId : this.listOwner,
     listId : listId,
     listIsHidden : false
   }
   console.log(data);
   this._todoHttp.editList(data).subscribe(
     data=>{
       if(data.status == "200"){
         this.toaster.success(data.message);
         let actionData = {
           roomId : this.userInfo.roomId,
           userName : this.userName,
           notificationMessage : `created a new list ${data.data.listTitle}`
         }
         this.socketService.sendTodoActionNotification(actionData);
         this.makeGetUserListsRequests();
       }else{
         this.toaster.warning(data.message);
       }
     }
   )
 }

 public deleteExistingList: any = ()=>{
   let data = {
     listId : this.currentList.listId,
     listOwnerId : this.listOwner
   }
   this._todoHttp.deleteList(data).subscribe(
     data=>{
       if(data.status == "200"){
         this.toaster.success(data.message);
         let actionData = {
           roomId : this.userInfo.roomId,
           userName : this.userName,
           notificationMessage : `deleted a list : ${this.currentList.listTitle}`
         }
         this.socketService.sendTodoActionNotification(actionData);
         this.makeGetUserListsRequests();
         this.makeGetUserDoneListsRequests();
       }else {
         this.toaster.warning(data.message);
       }
     }
   )
 }

 public undoListAction: any = ()=>{
   let data = {
     listId : this.currentList.listId,
     listOwnerId : this.listOwner
   }
   this._todoHttp.undoListAction(data).subscribe(
     data=>{
       if(data.status == "200"){
         this.toaster.success(data.message);
         let actionData = {
           roomId : this.userInfo.roomId,
           userName : this.userName,
           notificationMessage : `did an undo action on : ${this.currentList.listTitle}`
         }
         this.socketService.sendTodoActionNotification(actionData);
         this.makeGetUserListsRequests();
       }else {
        this.toaster.warning(data.message);
      }
     }
   )
 }

 public redoListAction: any = ()=>{
  let data = {
    listId : this.currentList.listId,
    listOwnerId : this.listOwner
  }
  this._todoHttp.redoListAction(data).subscribe(
    data=>{
      if(data.status == "200"){
        this.toaster.success(data.message);
        let actionData = {
          roomId : this.userInfo.roomId,
          userName : this.userName,
          notificationMessage : `did a redo action on : ${this.currentList.listTitle}`
        }
        this.socketService.sendTodoActionNotification(actionData);
        this.makeGetUserListsRequests();
      }else {
        this.toaster.warning(data.message);
      }
    }
  )
}

public markListAsDone: any = ()=>{
  let data = {
    listId : this.currentList.listId,
    listOwnerId : this.listOwner
  }
  this._todoHttp.markListAsDone(data).subscribe(
    data=>{
      if(data.status == "200"){
        this.toaster.success(data.message);
        let actionData = {
          roomId : this.userInfo.roomId,
          userName : this.userName,
          notificationMessage : `marked ${this.currentList.listTitle} as done`
        }
        this.socketService.sendTodoActionNotification(actionData);
        this.makeGetUserListsRequests();
        this.makeGetUserDoneListsRequests();
      }else {
        this.toaster.warning(data.message);
      }
    }
  )
}


public markListAsOpen: any = ()=>{
  let data = {
    listId : this.currentList.listId,
    listOwnerId : this.listOwner
  }
  this._todoHttp.markListAsOpen(data).subscribe(
    data=>{
      console.log(data);
      if(data.status == "200"){
        this.toaster.success(data.message);
        let actionData = {
          roomId : this.userInfo.roomId,
          userName : this.userName,
          notificationMessage : `re-opened ${this.currentList.listTitle}`
        }
        this.socketService.sendTodoActionNotification(actionData);
        this.makeGetUserListsRequests();
        this.makeGetUserDoneListsRequests();
      }else {
        this.toaster.warning(data.message);
      }
    }
  )
}



// ------list http calls end-----------------------------


// ------list item http calls start-----------------------------

// create a new list item
public createListItem: any = ()=>{
  let data = {
    listOwnerId : this.currentList.listOwner,
    listId : this.currentList.listId,
    title : this.title,
    description : this.description,
    dueDate : this.dueDate,
    parent : (this.currentItem.parent)?this.currentItem.parent:"",
  }
  this._todoHttp.createNewListItem(data).subscribe(
    data=>{
      if(data.status="200"){
        this.toaster.success(data.message);
        let actionData = {
          roomId : this.userInfo.roomId,
          userName : this.userName,
          listId : this.currentList.listId,
          notificationMessage : `created a new item ${data.data.title} in ${this.currentList.listTitle}`
        }
        this.socketService.sendTodoItemActionNotification(actionData);        
        this.makeGetListItemRequests();
        this.makeGetListDoneItemsRequests();
      }else{
        this.toaster.warning(data.message);
      }
    }
  )
}




}
