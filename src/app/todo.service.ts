import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  public todoUrl = "http://localhost:3000/api/v1/toDo"


  constructor(private _http: HttpClient, private cookies : CookieService) { }

  // create a new list
  public createNewList (data): any{
    let param1 = new HttpParams()
    .set('listTitle', data.listTitle)
    .set('listDescription', data.listDescription)

    return this._http.post(`${this.todoUrl}/createNewList?authToken=${this.cookies.get('authToken')}`, param1);
  }
  

  // create new item for a list
   public createNewListItem (data): any{
     let param2 = new HttpParams()
     .set('listOwnerId', data.listOwnerId)
     .set('listId', data.listId)
     .set('title', data.title)
     .set('description', data.description)
     .set('dueDate', data.dueDate)
     .set('parent', data.parent)

     return this._http.post(`${this.todoUrl}/createNewItem?authToken=${this.cookies.get('authToken')}`, param2);
   }

   // edit item in a list
   public editListItem (data) : any{
     let param3 = new HttpParams()
     .set('listOwnerId', data.listOwnerId)
     .set('itemId', data.itemId)
     .set('title', data.title)
     .set('description', data.description)
     .set('dueDate', data.dueDate)


     return this._http.post(`${this.todoUrl}/editItem?authToken=${this.cookies.get('authToken')}`, param3)
   }


   // edit list details
   public editList (data) : any{
    let param4 = new HttpParams()
    .set('listOwnerId', data.listOwnerId)
    // .set('actionOnList', data.actionOnList) //optional to give edit access to only the owner
    .set('listId', data.listId)
    .set('listTitle', data.listTitle)
    .set('listDescription', data.listDescription)
    .set('listIsHidden', data.listIsHidden)


    return this._http.put(`${this.todoUrl}/editList?authToken=${this.cookies.get('authToken')}`, param4)
  }

  // delete item in a list
  public deleteListItem(data): any{
    let param5 = new HttpParams()
    .set('itemId',data.itemId)
    .set('listOwnerId', data.listOwnerId)
    return this._http.post(`${this.todoUrl}/deleteItem?authToken=${this.cookies.get('authToken')}`, param5);
  }


  // delete list
  public deleteList (data): any{
    let param6 = new HttpParams()
    .set('listOwnerId', data.listOwnerId)
    .set('listId', data.listId);
    // .set('actionOnList', data.actionOnList) // optional to give access to only the owner of the list

    return this._http.post(`${this.todoUrl}/deleteList?authToken=${this.cookies.get('authToken')}`, param6);

  }

  //get all items of the list
  public getListItems(data):any{
    let param7 = new HttpParams()
    .set('listOwnerId', data.listOwnerId)
    .set('listId', data.listId);

    return this._http.post(`${this.todoUrl}/getAllListItems?authToken=${this.cookies.get('authToken')}`, param7);
  }


 // mark an item as done
 public markItemAsDone(data): any{
   let param8 = new HttpParams()
   .set('itemId', data.itemId)
   .set('listOwnerId', data.listOwnerId)

   return this._http.put(`${this.todoUrl}/markItemAsDone?authToken=${this.cookies.get('authToken')}`, param8);
 }


 // mark an item as open
 public markItemAsOpen(data): any{
   let param9 = new HttpParams()
   .set('itemId', data.itemId)
   .set('listOwnerId', data.listOwnerId)

   return this._http.put(`${this.todoUrl}/markItemAsOpen?authToken=${this.cookies.get('authToken')}`, param9);

 }


 // undo an action on an item
 public undoItemAction(data): any{
  let param10 = new HttpParams()
  .set('itemId', data.itemId)
  .set('listOwnerId', data.listOwnerId)

  return this._http.put(`${this.todoUrl}/undoAction?authToken=${this.cookies.get('authToken')}`, param10);

}

// undo an action on an item
public redoItemAction(data): any{
  let param10 = new HttpParams()
  .set('itemId', data.itemId)
  .set('listOwnerId', data.listOwnerId)

  return this._http.put(`${this.todoUrl}/redoAction?authToken=${this.cookies.get('authToken')}`, param10);

}


// undo an action on an item
public undoListAction(data): any{
  let param10 = new HttpParams()
  .set('listId', data.listId)
  .set('listOwnerId', data.listOwnerId)

  return this._http.put(`${this.todoUrl}/undoListAction?authToken=${this.cookies.get('authToken')}`, param10);

}

// undo an action on an item
public redoListAction(data): any{
  let param10 = new HttpParams()
  .set('listId', data.listId)
  .set('listOwnerId', data.listOwnerId)

  return this._http.put(`${this.todoUrl}/redoListAction?authToken=${this.cookies.get('authToken')}`, param10);

}



}
