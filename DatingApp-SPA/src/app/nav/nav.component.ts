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
  
  constructor(public authService : AuthService, private alertify : AlertifyService, private router : Router) { }
  ngOnInit(){}

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
    this.alertify.message("Logged out");
    this.router.navigate(["home"]);
  }
}
