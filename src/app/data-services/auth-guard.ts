import { ActivatedRoute, CanActivate, CanActivateFn, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate{
    
constructor(private auth: AuthService, private _route: Router){}

    canActivate(){
        if(this.auth.isLogedIn()){           
            return true;
        }
        else{
            this._route.navigate(['/login']);
            return false;
        }
    }
}