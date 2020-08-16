import { AlertifyService } from './../_servises/alertify.service';
import { AuthService } from './../_servises/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService : AuthService, private alertify : AlertifyService, private router : Router){}
  canActivate():  boolean {
    
    if(this.authService.loggedIn()){
      return true;
    }

    this.alertify.error("Unauthorised...!"); 
    this.router.navigate(["home"]);   
    return false;
  }
  
}
