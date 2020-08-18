import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { ErrorComponent } from './error/error.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { ListComponent } from './list/list.component';
import { MessagesComponent } from './messages/messages.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';

export const appRoutes : Routes =[
    {path: '', redirectTo:'home', pathMatch:'full'},
    {path: 'home', component: HomeComponent},
    {path:'',
    runGuardsAndResolvers:"always",
    children:[
        {path: 'messages', component: MessagesComponent},
        {path: 'list', component: ListComponent},
        {path: 'members', component: MemberListComponent},
        {path: 'member/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}}
    ], canActivate:[AuthGuard]},
    {path: '**', component: ErrorComponent}
]
