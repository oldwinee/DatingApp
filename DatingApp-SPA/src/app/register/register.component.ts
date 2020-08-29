import { Router } from '@angular/router';
import { User } from './../_models/user';
import { AlertifyService } from './../_servises/alertify.service';
import { FormsModule, NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from './../_servises/auth.service';
import { Component, OnInit, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter(); 
  @ViewChild("registerForm") form:NgForm;
  user:User;
  registerForm: FormGroup;
  bsConfig : Partial<BsDatepickerConfig>;

  constructor(private authService:AuthService, private alertify : AlertifyService, private fb: FormBuilder, private router : Router) { }

  ngOnInit() {    
    this.bsConfig ={
      containerClass : 'theme-blue'
    }
    this.createRegisterForm();
  }

  createRegisterForm(){
    this.registerForm = this.fb.group({
      gender:['male',Validators.required],
      username: ['',Validators.required],
      knownAs:['',Validators.required],
      dateOfBirth:[null,Validators.required],
      city:['',Validators.required],
      state:['',Validators.required],
      country:['',Validators.required],
      password: ['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword:['',[Validators.required]]
    },{validator : this.passwordMatchValidator})
  }

passwordMatchValidator(g : FormGroup){
  return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
}

  register(){
    if(this.registerForm.valid){
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(()=>{
        this.alertify.success("Registration successful...!");
      },error=>{
        this.alertify.error(error);
      },()=>{
        this.authService.login(this.user).subscribe(()=>{
          this.router.navigate(['/members']);
        });
      });
    }
  }

  canceled(){
    this.cancelRegister.emit(false);
  }
}
