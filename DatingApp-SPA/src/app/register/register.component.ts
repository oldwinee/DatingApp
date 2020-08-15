import { AlertifyService } from './../_servises/alertify.service';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from './../_servises/auth.service';
import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter(); 
  @ViewChild("registerForm") form:NgForm;
  model:any={};
  constructor(private authService:AuthService, private alertify : AlertifyService) { }

  ngOnInit() {
  }

  register(){
    this.authService.register(this.model).subscribe(
      next=>{
        this.alertify.success("Registration successful");
      },error=> {
        this.alertify.error(error);
      }      
    ); 
    this.form.reset();
  }

  canceled(){
    this.cancelRegister.emit(false);
  }
}
