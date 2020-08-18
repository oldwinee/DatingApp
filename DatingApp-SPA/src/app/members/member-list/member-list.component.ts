import { AlertifyService } from './../../_servises/alertify.service';
import { UserService } from './../../_servises/user.service';
import { User } from './../../_models/user';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users : User[];
  constructor(private userService : UserService, private alertify: AlertifyService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers()
  {
    this.userService.getUsers().subscribe(
    (users:User[])=>{
      this.users = users;
    },
    error=>{
      this.alertify.error(error);
    });
  }

}
