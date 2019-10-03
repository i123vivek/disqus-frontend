import { Component, OnInit, ElementRef } from '@angular/core';
import { AppService } from './../../app.service';
import { Router } from '@angular/router';
import { ToastrManager }  from 'ng6-toastr-notifications';
import { FileUploader } from 'ng2-file-upload';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public uploader: FileUploader = new FileUploader({});
  public firstName: any;
  public lastName: any;
  public mobileNumber: any;
  public email: any;
  public password: any;
  public imageName: any;
  public imagePath: any;
  public filesToUpload: Array<File> = [];

  constructor(public appService: AppService, public router: Router, private toastr: ToastrManager, private el: ElementRef) { }

  ngOnInit() {
    Cookie.deleteAll()
  }

  public goToSignIn: any = () =>{
    this.router.navigate(['/login']);
  } // end of goToSignIn function.

  // public signupFunction: any =()=>{
  //   if(!this.firstName){
  //     this.toastr.warningToastr('enter the first name');
  //   } else if(!this.lastName){
  //     this.toastr.warningToastr('enter the last name');
  //   } else if(!this.mobileNumber){
  //     this.toastr.warningToastr('enter mobile number');
  //   } else if(!this.email){
  //     this.toastr.warningToastr('enter email');
  //   } else if(!this.password){
  //     this.toastr.warningToastr('enter password');
  //   } else{
  //     let data ={
  //       firstName: this.firstName,
  //       lastName: this.lastName,
  //       mobileNumber: this.mobileNumber,
  //       email: this.email,
  //       password: this.password
  //     }

  //     console.log("The data for signup is:",data);
  //     this.appService.signupFunction(data).subscribe((apiResponse) =>{
  //       console.log("the apiResponse for signup is:",apiResponse);

  //       if (apiResponse.status === 200){
  //         this.toastr.successToastr('Signup successful');
  //         setTimeout(() => {
  //           this.goToSignIn();
  //         }, 2000);
  //       }
  //       else {
  //         this.toastr.errorToastr(apiResponse.message);
  //       }
  //     }, (err) => {
  //       this.toastr.errorToastr('some error occured');
  //     });
  //   }
  // }

  public signupFunction: any =()=> {
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    let fileCount: number = inputEl.files.length;
    let file = inputEl.files[0];
    console.log('file here is', file)

    if (!this.firstName) {
      this.toastr.warningToastr('enter the first name');
    } else if (!this.lastName) {
      this.toastr.warningToastr('enter the last name');
    } else if (!this.mobileNumber) {
      this.toastr.warningToastr('enter mobile number');
    } else if (!this.email) {
      this.toastr.warningToastr('enter email');
    } else if (!this.password) {
      this.toastr.warningToastr('enter password');
    } else if(!this.imageName){
      this.toastr.warningToastr('enter image');
    } else{
      let formData = new FormData();
      formData.append('firstName', this.firstName);
      formData.append('lastName', this.lastName);
      formData.append('mobileNumber', this.mobileNumber);
      formData.append('email', this.email);
      formData.append('password', this.password);
      
      
      if (fileCount > 0){
        for (let i = 0; i < fileCount; i++) {
          formData.append('image', inputEl.files[i]);
  
          console.log('formDatais', formData)
  
        }
        this.appService.signupFunction(formData).subscribe((apiResponse) => {
          console.log("the apiResponse for signup is:", apiResponse);

          if (apiResponse.status === 200) {
            this.toastr.successToastr('Signup successful');
            setTimeout(() => {
              this.goToSignIn();
            }, 2000);
          }
          else {
            this.toastr.errorToastr(apiResponse.message);
          }
        }, (err) => {
          this.toastr.errorToastr('some error occured');
        });
      }
    }
  }

}
