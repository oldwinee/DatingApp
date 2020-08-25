import { NgForm } from '@angular/forms';
import { User } from './../../_models/user';
import { AuthService } from './../../_servises/auth.service';
import { AlertifyService } from './../../_servises/alertify.service';
import { UserService } from './../../_servises/user.service';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm: NgForm;
  user: User;
  @HostListener('window:beforeunload',['$event'])
  unloadNotification($event:any){
    if(this.editForm.dirty){
      $event.returnValue = true;
    }
  }

  constructor(
    private userService: UserService,
    private authservice: AuthService,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.userService.getUser(this.authservice.decodedToken.nameid).subscribe(
      (user) => {
        this.user = user;
        this.authservice.changeMemberPhoto(user.photoUrl);
      },
      (error) => {
        this.alertify.error(error);
      }
    );
  }

  updateUser() {
    this.userService.updateUser(this.authservice.decodedToken.nameid, this.user).subscribe(next=>{
      this.alertify.success('Profile saved successfully');
      this.editForm.reset(this.user); 
    },error=>{
      this.alertify.error(error);
    });
  }

  updateMainPhoto(photoUrl){
    this.user.photoUrl = photoUrl; 
    this.authservice.changeMemberPhoto(photoUrl);   
  }
}
