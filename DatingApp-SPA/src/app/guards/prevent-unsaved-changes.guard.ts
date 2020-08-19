import { MemberEditComponent } from './../members/member-edit/member-edit.component';
import { Injectable, Component } from '@angular/core';
import { CanDeactivate } from '@angular/router'

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent>{
    canDeactivate(component:MemberEditComponent){
        if(component.editForm.dirty){
            return confirm('Changes are not saved. Are you sure you want to leave the page?');
        }
        return true;
    }

}