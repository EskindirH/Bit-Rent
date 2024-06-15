import { Injectable } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../data-services/auth.service";


@Injectable()
export class Authorization implements HttpInterceptor {
    constructor(private auth: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {
        let token = this.auth.getToken();

        let httpOpts = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            }
        })
        return next.handle(httpOpts);
    }
}