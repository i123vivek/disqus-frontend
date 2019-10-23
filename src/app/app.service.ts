import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = 'http://localhost:3000';

  constructor( public http: HttpClient) { }

  public getUserInfoFromLocalstorage = () => {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public setUserInfoInLocalStorage = (data) => {
    localStorage.setItem('userInfo', JSON.stringify(data))
  }

  public signupFunction(file): Observable<any>{
    return this.http.post(`${this.url}/api/v1/users/signup`, file);
  }

  public signinFunction(data): Observable<any>{
    const params = new HttpParams()
      .set('email',data.email)
      .set('password',data.password)
    return this.http.post(`${this.url}/api/v1/users/login`,params)
  }

  public logout(): Observable<any> {
    const params = new HttpParams()
      .set('authToken', Cookie.get('authToken'))
    return this.http.post(`${this.url}/api/v1/users/logout`, params);
  }

  public getSingleUser(userId) : Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/${userId}/details?authToken=${Cookie.get('authToken')}`);
  }

  public createPost(postData): Observable<any> {
    console.log("post data for create post in app service: ", postData);
    const params = new HttpParams()
      .set('userId', postData.userId)
      .set('userEmail', postData.userEmail)
      .set('postTitle', postData.postTitle)
      .set('postDescription', postData.postDescription)
      .set('postCreatedBy', postData.postCreatedBy)
      
    return this.http.post(`${this.url}/api/v1/users/create/post?authToken=${Cookie.get('authToken')}`, params);
  }

  public getAllPost(): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/get/all/post`);
  }

  public getSinglePost(postId): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/post/${postId}/details`);
  }

  public addComment(commentData): Observable<any> {
    console.log("comment data for adding comment in app service: ", commentData);
    const params = new HttpParams()
      .set('postId', commentData.postId)
      .set('commentUserId', commentData.commentUserId)
      .set('commentorName', commentData.commentorName)
      .set('commentMessage', commentData.commentMessage)
      
    return this.http.post(`${this.url}/api/v1/users/add/comment?authToken=${Cookie.get('authToken')}`, params);
  }

  public getAllCommentOfAPost(postId ): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/get/all/${postId}/comment`);
  }

  public getSingleComment(commentId): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/comment/${commentId}/details`);
  }

  public markCommentLike(likeData):Observable<any> {
    console.log("like data for comment in app service: ", likeData);
    const params = new HttpParams()
      .set('commentId',likeData.commentId)
      .set('userId',likeData.userId)
      .set('postId',likeData.postId)
      return this.http.post(`${this.url}/api/v1/users/add/comment/like?authToken=${Cookie.get('authToken')}`, params);
  }

  public deleteCommentLike(commentId): Observable<any>{
    console.log("CommentLike to be deleted", commentId);
    const params = new HttpParams()
      .set('commentId', commentId)
    return this.http.post(`${this.url}/api/v1/users/delete/${commentId}/comment/like?authToken=${Cookie.get('authToken')}`, params);
  }

  public findAllLikeOfAComment(commentId): Observable<any>{
    return this.http.get(`${this.url}/api/v1/users/get/comment/${commentId}/likes`);
  }

  public addReply(replyData): Observable<any> {
    console.log("reply data for adding reply in app service: ", replyData);
    const params = new HttpParams()
      .set('commentId', replyData.commentId)
      .set('replyerUserId', replyData.replyerUserId)
      .set('replyerName', replyData.replyerName)
      .set('replyMessage', replyData.replyMessage)
      
    return this.http.post(`${this.url}/api/v1/users/add/reply?authToken=${Cookie.get('authToken')}`, params);
  }

  public getAllReplyOfAComment(commentId): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/get/all/${commentId}/reply`);
  }

  public getSingleReply(replyId): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users/reply/${replyId}/details`);
  }


  public getAllLikeOfComment(commentId): Observable<any> {
    return this.http.get(`${this.url}/api/v1/users//get/comment/${commentId}/likes`);
  }




  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {
      errorMessage = `An error occured: ${err.error.message}`;
    }
    else {
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    }

    console.error(errorMessage);

    return Observable.throw(errorMessage);
  }
}
