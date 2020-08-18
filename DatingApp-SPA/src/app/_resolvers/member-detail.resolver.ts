import { catchError } from 'rxjs/operators';
import { AlertifyService } from './../_servises/alertify.service';
import { UserService } from './../_servises/user.service';
import { User } from './../_models/user';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userService.getUser(route.params['id']).pipe(
      catchError(error => {
        this.alertify.error(error);
        this.router.navigate(['members']);
        return of(null);
      })
    );
  }
}
