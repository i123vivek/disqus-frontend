import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from './../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email : any;
  public password: any;
  loginToken: boolean;

  constructor(public router:Router, public appService:AppService, public toastr: ToastrManager) { }

  ngOnInit() {
    Cookie.deleteAll();
  }


  public goToSignUp: any = () =>{
    this.router.navigate(['/signup']);
  }

  public goToSignIn: any = ()=>{
    if (!this.email) {
      this.toastr.warningToastr('enter email')
    } else if (!this.password) {
      this.toastr.warningToastr('enter password')
    } else{
      let data = {
        email: this.email,
        password: this.password
      }
      console.log('login data is:',data);
      this.appService.signinFunction(data).subscribe((apiResponse) =>{

        if(apiResponse.status === 200){
          console.log('apiResponse for login is:', apiResponse);

          Cookie.set('authToken', apiResponse.data.authToken);

          Cookie.set('userId', apiResponse.data.userDetails.userId);

          Cookie.set('email', apiResponse.data.userDetails.email);

          Cookie.set('fullName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);

          Cookie.set('loginToken','true')

          this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails);

          this.router.navigate(['/home'])
        } else {
          this.toastr.errorToastr(apiResponse.message)
        }
      },(err) => {
        this.toastr.errorToastr('some error occured')
      })
    }
  }

}
