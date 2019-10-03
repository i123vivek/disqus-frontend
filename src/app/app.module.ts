import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes} from '@angular/router';
import { ToastrModule } from 'ng6-toastr-notifications';
import { HttpClientModule } from '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';

import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { AppService } from './app.service';
import { HomeComponent } from './home/home.component';
import { PostDescriptionComponent } from './post-description/post-description.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PostDescriptionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    CommonModule,
    FormsModule,
    UserModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent, pathMatch: 'full'},
      { path:'post-description', component: PostDescriptionComponent},
      { path: '', redirectTo: 'home', pathMatch: 'full'},
      { path: '*', component: HomeComponent},
      { path: '**', component: HomeComponent},
      
    ])
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
