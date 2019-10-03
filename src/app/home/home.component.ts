import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Location } from "@angular/common";
import { reject } from 'q';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public token: boolean = false;
  public userId: string;
  public userEmail: string;
  public postTitle: string;
  public postDescription: string;
  public postCreatedBy: string;
  public authToken: string;
  public allPostList: any = [];
  public postId: string;
  commentorName: any;
  commentUserId: any;
  commentMessage: any;
  allCommentListOfPost: any = [];
  commentId: any;
  dislikeCount: any;
  likeCount: any;
  commentCreatedOn: string;
  firstName: any;
  lastName: any;
  email: any;
  mobileNumber: any;
  imageName: any;
  userCreatedOn: string;
  imagePath: any;
  userName: string;
  commentArraySize: Number;
  pageValue: number;

  p: Number = 1;
  count: Number = 5;

  constructor(public router: Router, public location: Location, public appService: AppService, public toastr: ToastrManager) { }

  ngOnInit() {
    this.authToken = Cookie.get('authToken')
    this.userId = Cookie.get('userId')
    this.userEmail = Cookie.get('email')
    this.userName = Cookie.get('fullName')
    this.postCreatedBy = Cookie.get('fullName')
    //this.checkStatus()
    this.checkLoginToken();
    this.getSingleUserInfo(this.userId);
    this.getAllPost();
  }



  public checkLoginToken: any = () => {
    if ((Cookie.get('loginToken') == 'true') && ((Cookie.get('authToken') !== undefined || Cookie.get('authToken') !== '' || Cookie.get('authToken') !== null))) {
      this.token = true;
      console.log("the authToken is:", Cookie.get('authToken'))
      console.log("the token value :", this.token)
    }
    else {
      this.token = false;
      console.log("the token value :", this.token)
    }
  } // end of chckLoginToken function.

  public getSingleUserInfo: any = (userId) => {
    console.log("inside user info", userId)
    this.appService.getSingleUser(userId).subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        console.log('inside apiReponse of getSingleUserInfo', apiResponse)
        this.userId = apiResponse.data.userId;
        this.firstName = apiResponse.data.firstName;
        this.lastName = apiResponse.data.lastName;
        this.email = apiResponse.data.email;
        this.mobileNumber = apiResponse.data.mobileNumber;
        this.imageName = apiResponse.data.imageName;
        this.imagePath = apiResponse.data.imagePath;
        this.userCreatedOn = new Date(apiResponse.data.userCreatedOn).toLocaleDateString()
      }

      console.log(this.imagePath)
    })

  }

  public createPost(): any {
    if (this.token === true) {
      let postData = {
        userId: this.userId,
        userEmail: this.userEmail,
        postTitle: this.postTitle,
        postDescription: this.postDescription,
        postCreatedBy: this.postCreatedBy
      }

      this.appService.createPost(postData).subscribe(
        data => {
          console.log("post created")
          console.log("create post response data: ", data);
          this.toastr.successToastr('post created.', 'Success!');
          //this.router.navigate(['/home']);
          location.reload();
        }, error => {
          console.log("some error occurred while creating post");
          console.log(error.errorMessage);
          this.toastr.errorToastr('This is error toast.', 'Oops!');
        })
    }
  } // end of create post function.


  public getAllPost: any = () => {

    this.appService.getAllPost()
      .toPromise()
      .then(apiResponse => {

        console.log("apires here ",apiResponse)
        if (apiResponse.data != null) {
          var allPostList = [];

          
          for (let x of apiResponse.data) {
            let temp = {
              postId: x.postId,
              userId: x.userId,
              userEmail: x.userEmail,
              postTitle: x.postTitle,
              postDescription: x.postDescription,
              postCreatedBy: x.postCreatedBy,
              postCreatedOn: new Date(x.postCreatedOn).toLocaleString()
            }
            allPostList.push(temp);
          }
          console.log("All Posts are:--", allPostList);
          allPostList.sort((a,b)=> a.postCreatedOn.localeCompare(b.postCreatedOn))
          return allPostList
        } else 
        {
          
        }


      }).then((postList) => {



        console.log("all post list", typeof postList)
       
        this.allCommentListOfPost = []
        //let i = 0;
        if(typeof postList != "undefined"){

          let length = postList.length
          console.log("post list length:", length)
          for (let x of postList) {
            console.log("the postId is@@@@@@@@@:", x.postId)

            this.appService.getAllCommentOfAPost(x.postId).subscribe((apiResponse) => {

              console.log("the postId is:", x.postId)
              let apiData = apiResponse.data;
              console.log("api data here is:", apiData)
              if (apiData) {
                console.log("api response is:", apiData)
                let temp = {
                  "post": x,
                  "comments": apiData,
                  "commentLength": apiData.length
                }
                this.allCommentListOfPost.push(temp)
                //i = i + 1;
                this.allCommentListOfPost.sort((a,b) => 0 - (a.post.postCreatedOn > b.post.postCreatedOn ? 1 : -1))
                console.log("commentlist of post", this.allCommentListOfPost)
                
              } else {
                let temp = {
                  "post": x,
                  "comments": apiData,
                  "commentLength": 0
                }
                this.allCommentListOfPost.push(temp)
              
                this.allCommentListOfPost.sort((a,b) => 0 - (a.post.postCreatedOn > b.post.postCreatedOn ? 1 : -1))
                
                console.log("commentlist of post", this.allCommentListOfPost)
              }

              //}



            })

          }

          console.log("commentlist########", this.allCommentListOfPost)
        }
      })



  } // end of get all post function.

  // here the function will call a promise function

  public selectPost = (postId) => {
    Cookie.delete('PostSelected-Id');
    this.allCommentListOfPost.map((post) => {
      if (post.post.postId == postId) {
        Cookie.set('PostSelected-Id', post.post.postId);
        this.router.navigate(['/post-description']);
      }
    })
  } // end of select post function.




  // public ViewPost(): any {
  //   if (Cookie.get('PostSelected-Id') === undefined || Cookie.get('PostSelected-Id') === '' || Cookie.get('PostSelected-Id') === null) {
  //     this.toastr.errorToastr('select a post to view');
  //   }
  //   else {
  //     let postId = Cookie.get('PostSelected-Id');
  //     this.appService.getSinglePost(postId).subscribe(
  //       data => {

  //         this.toastr.successToastr('post selected.', 'Success!');
  //       },
  //       error => {
  //         this.toastr.errorToastr('No post found ', 'Oops!')
  //       }

  //     )
  //   }
  // } // end of view post function.


  // public ViewComment(): any {
  //   if (Cookie.get('CommentSelectedId') === undefined || Cookie.get('CommentSelectedId') === '' || Cookie.get('CommentSelectedId') === null) {
  //     this.toastr.errorToastr('select a comment to view');
  //   }
  //   else {
  //     let commentId = Cookie.get('CommentSelectedId');
  //     this.appService.getSingleComment(commentId).subscribe(
  //       data => {

  //         this.toastr.successToastr('comment selected.', 'Success!');
  //       },
  //       error => {
  //         this.toastr.errorToastr('No comment found ', 'Oops!')
  //       }

  //     )
  //   }
  // } // end of view comment function.







  public logout: any = () => {
    this.appService.logout().subscribe((apiResponse) => {
      if (apiResponse.status === 200) {
        console.log("logout function called");
        Cookie.deleteAll();
        Cookie.set("loginToken", "false")




        this.router.navigate(['/home', "token"]);

      } else {
        this.toastr.errorToastr(apiResponse.message);
      }
    }, (err) => {
      this.toastr.errorToastr("some error occured");
    })
  }

}
