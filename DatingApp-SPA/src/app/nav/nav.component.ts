import { AlertifyService } from './../_servises/alertify.service';
import { AuthService } from './../_servises/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model:any={};
  photoUrl: string;
  
  constructor(public authService : AuthService, private alertify : AlertifyService, private router : Router) { }
  
  ngOnInit(){
    this.authService.currentPhotoUrl.subscribe( photoUrl => this.photoUrl = photoUrl);
  }

  login(){
    this.authService.login(this.model)
    .subscribe(
      next => {
        this.alertify.success("Logged in successfully");
        this.router.navigate(["members"]);
      },error =>{
        this.alertify.error(error);
      }
    );
  } 

  loggedIn(){
    return this.authService.loggedIn();
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.alertify.message("Logged out");
    this.router.navigate(["home"]);
    this.authService.currentUser =null;
    this.authService.decodedToken =null;
  }
}
