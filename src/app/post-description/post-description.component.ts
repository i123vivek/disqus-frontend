import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Location } from "@angular/common";

@Component({
  selector: 'app-post-description',
  templateUrl: './post-description.component.html',
  styleUrls: ['./post-description.component.css']
})
export class PostDescriptionComponent implements OnInit {

  token: boolean;
  authToken: string;
  userId: string;
  userEmail: string;
  userName: string;
  firstName: any;
  lastName: any;
  email: any;
  mobileNumber: any;
  imageName: any;
  userCreatedOn: string;
  imagePath: any;
  postId: any;
  postTitle: any;
  postDescription: any;
  postCreatedBy: any;
  postCreatedOn: any;
  allCommentList: any = [];
  commentArraySize: number;
  commentUserId: any;
  commentorName: any;
  commentMessage: any;
  commentId: any;
  likeCount: any;
  dislikeCount: any;
  commentCreatedOn: string;
  allReplyList: any[];
  replyerUserId: any;
  replyerName: any;
  replyMessage: any;
  replyId: any;
  replycommentId: any;
  replyCreatedOn: string;
  replyLikeCount: any;
  replyDislikeCount: any;
  commentpostId: any;
  commentlikeCount: any;
  commentdislikeCount: any;

  p: Number = 1;
  count: Number = 5;

  

  constructor(public router: Router, public location: Location, public appService: AppService, public toastr: ToastrManager) { 
    //this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.authToken = Cookie.get('authToken')
    this.userId = Cookie.get('userId')
    this.userEmail = Cookie.get('email')
    this.userName = Cookie.get('fullName')
    this.postId = Cookie.get('PostSelected-Id')
    this.commentId = Cookie.get('CommentSelectedId')
    this.commentUserId = Cookie.get('userId')
    this.commentorName = Cookie.get('fullName')
    

    this.checkLoginToken();
    this.getSingleUserInfo(this.userId);
    this.getAllInfoOfAPost(this.postId);
    this.getAllCommentOfAPost();
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
  } // end of getSingleUserInfo function.





  public getAllInfoOfAPost(postId): any {

    console.log('inside getAllInfoOfAPost', postId)
    //let postId = Cookie.get('PostSelected-Id');
    this.appService.getSinglePost(postId).subscribe(
      data => {
        this.postId = data.data.postId,
          this.userId = data.data.userId,
          this.userEmail = data.data.userEmail,
          this.postTitle = data.data.postTitle,
          this.postDescription = data.data.postDescription,
          this.postCreatedBy = data.data.postCreatedBy,
          this.postCreatedOn = new Date(data.data.postCreatedOn).toLocaleString()

        this.toastr.successToastr('post details.', 'Success!');
      },
      error => {
        this.toastr.errorToastr('No post found ', 'Oops!')
      }

    )
  } // end of post detail function.


  public getAllCommentOfAPost: any = () => {
    this.appService.getAllCommentOfAPost(this.postId).subscribe((apiResponse) => {
      console.log(apiResponse);
      this.allCommentList = [];
      if (apiResponse.data != null) {
        this.allCommentList = [];
        for (let x of apiResponse.data) {
          let temp = {
            commentId: x.commentId,
            postId: x.postId,
            commentUserId: x.commentUserId,
            commentorName: x.commentorName,
            commentMessage: x.commentMessage,
            likeCount: x.likeCount,
            dislikeCount: x.dislikeCount,
            commentorEmail: x.email,
            mobileNumber: x.mobileNumber,
            commentorImageName: x.imageName,
            commentorImagePath: x.imagePath,
            commentCreatedOn: new Date(x.commentCreatedOn).toLocaleString()
          }
          this.allCommentList.push(temp);
        }
        console.log("All comments are:--", this.allCommentList);
        this.commentArraySize = this.allCommentList.length
        
      }
    })
  } // end of get all comment of a post function.

  public addComment(): any {
    if (this.token === true) {
      let commentData = {
        postId: this.postId,
        commentUserId: this.commentUserId,
        commentorName: this.commentorName,
        commentMessage: this.commentMessage,

      }

      console.log("data for adding comment", commentData)

      this.appService.addComment(commentData).subscribe(
        data => {
          console.log("comment created")
          console.log("create comment response data: ", data);
          this.toastr.successToastr('comment created.', 'Success!');
          //this.pushToCommentWindow(commentData)
          location.reload();
          //this.router.navigate(['/home']);
        }, error => {
          console.log("some error occurred while creating comment");
          console.log(error.errorMessage);
          this.toastr.errorToastr('This is error toast.', 'Oops!');
        })
    }
  } // end of add comment function.

  


  public selectComment = (commentId) => {
    Cookie.delete('CommentSelectedId');
    this.allCommentList.map((comment) => {
      if (comment.commentId == commentId) {
        Cookie.set('CommentSelectedId', comment.commentId);
        console.log("comment selected is:", Cookie.get('CommentSelectedId'))
      }
    })
  } // end of select comment function.

  public commentDetails(): any {

    if (Cookie.get('CommentSelectedId') === undefined || Cookie.get('CommentSelectedId') === '' || Cookie.get('CommentSelectedId') === null) {
      this.toastr.errorToastr('select a comment to view');
    }
    else {
      let commentId = Cookie.get('CommentSelectedId');
      this.appService.getSingleComment(commentId).subscribe(
        data => {
          this.commentId = data.data.commentId,
            this.commentpostId = data.data.postId,
            this.commentUserId = data.data.commentUserId,
            this.commentorName = data.data.commentorName,
            this.commentMessage = data.data.commentMessage,
            this.commentlikeCount = data.data.likeCount,
            this.commentdislikeCount = data.data.dislikeCount,
            this.commentCreatedOn = new Date(data.data.commentCreatedOn).toLocaleDateString()

          this.toastr.successToastr('comment details.', 'Success!');
        },
        error => {
          this.toastr.errorToastr('No comment found ', 'Oops!')
        }

      )
    }

  } // end of comment detail function.

  public getAllReplyOfAComment: any = (commentId) => {
    if (commentId) {

      console.log('on button select',commentId)
      Cookie.set('CommentSelectedId',commentId)

      this.commentId =  Cookie.get('CommentSelectedId')

      console.log("here commer tid",this.commentId)
      this.appService.getAllReplyOfAComment(this.commentId).subscribe((apiResponse) => {
        console.log(apiResponse);
        this.allReplyList = [];
        if (apiResponse.data != null) {
          this.allReplyList = [];
          for (let x of apiResponse.data) {
            let temp = {
              replyId: x.replyId,
              commentId: x.commentId,
              replyerUserId: x.replyerUserId,
              replyerName: x.replyerName,
              replyMessage: x.replyMessage,
              likeCount: x.likeCount,
              dislikeCount: x.dislikeCount,
              replyerEmail: x.email,
              mobileNumber: x.mobileNumber,
              replyerImageName: x.imageName,
              replyerImagePath: x.imagePath,
              replyCreatedOn: new Date(x.replyCreatedOn).toLocaleString()
            }
            this.allReplyList.push(temp);
          }
          console.log("All replys are:--", this.allReplyList);
        }
      })
    }
  } // end of get all comment of a post function.

  public addReply(data): any {

    console.log("data here is reply",data)


    let str =`List-${data}`
    console.log("id",str)
    

    this.replyMessage = (<HTMLInputElement> document.getElementById(str)).value;


    (<HTMLInputElement> document.getElementById(str)).value = ''
    console.log("ghghjhftyukj",this.replyMessage)



    if (this.token === true && this.replyMessage != '' ) {
      let replyData = {
        commentId: Cookie.get('CommentSelectedId'),
        replyerUserId: Cookie.get('userId'),
        replyerName: Cookie.get('fullName'),
        replyMessage: this.replyMessage,

      }

      this.appService.addReply(replyData).subscribe(
        data => {

          console.log("reply created")
          console.log("create reply response data: ", data);
          this.toastr.successToastr('reply created.', 'Success!');

          this.getAllReplyOfAComment(this.commentId)
          // location.reload();
          //this.router.navigate(['/home']);
        }, error => {
          console.log("some error occurred while creating reply");
          console.log(error.errorMessage);
          this.toastr.errorToastr('This is error toast.', 'Oops!');
        })
    }

    else{
      this.toastr.errorToastr('This is error toast.', 'reply not created');
    }
  } // end of add reply function.


  public selectReply = (replyId) => {
    Cookie.delete('ReplySelectedId');
    this.allReplyList.map((reply) => {
      if (reply.replyId == replyId) {
        Cookie.set('CommentSelectedId', reply.replyId);
      }
    })
  } // end of select comment function.

  public replyDetails(): any {

    if (Cookie.get('ReplySelectedId') === undefined || Cookie.get('ReplySelectedId') === '' || Cookie.get('ReplySelectedId') === null) {
      this.toastr.errorToastr('select a reply to view');
    }
    else {
      let replyId = Cookie.get('ReplySelectedId');
      this.appService.getSingleReply(replyId).subscribe(
        data => {
          this.replyId = data.data.replyId,
            this.replycommentId = data.data.commentId,
            this.replyerUserId = data.data.replyerUserId,
            this.replyerName = data.data.replyerName,
            this.replyMessage = data.data.replyMessage,
            this.replyLikeCount = data.data.likeCount,
            this.replyDislikeCount = data.data.dislikeCount,
            this.replyCreatedOn = new Date(data.data.commentCreatedOn).toLocaleDateString()

          this.toastr.successToastr('reply details.', 'Success!');
        },
        error => {
          this.toastr.errorToastr('No reply found ', 'Oops!')
        }

      )
    }

  } // end of comment detail function.



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
  } // end of logout function.

   
  public getAllLikesOfAComment:any =(commentId) =>{

    this.appService.getAllLikeOfComment(commentId).subscribe((res)=>{
      
    })

  }
}
