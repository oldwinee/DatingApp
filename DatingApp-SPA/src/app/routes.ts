import { AuthGuard } from './guards/auth.guard';
import { ErrorComponent } from './error/error.component';
import { MemberListComponent } from './member-list/member-list.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const appRoutes : Routes =[
    {path: '', redirectTo:'home', pathMatch:'full'},
    {path: 'home', component: HomeComponent},
    {path:'',
    runGuardsAndResolvers:"always",
    children:[
        {path: 'messages', component: MessagesComponent},
        {path: 'list', component: ListComponent},
        {path: 'members', component: MemberListComponent}
    ], canActivate:[AuthGuard]},
    {path: '**', component: ErrorComponent}
]
