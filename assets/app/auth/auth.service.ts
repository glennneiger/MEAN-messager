import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { User } from "./user.model";
import { ErrorService } from "../errors/error.service";

@Injectable()
export class AuthService {
    // for local domain
    // private domain: string = 'localhost:3000';

    // for heroku domain
    // private domain: string = 'angular2-messager-deployment.herokuapp.com';

    // for aws domain
    private domain: string = 'angular2-messager-deployment.us-east-1.elasticbeanstalk.com';

    constructor(private http: Http, private errorService: ErrorService) {}

    signup(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        // using below line for heroku deployment
        // return this.http.post('https://' + this.domain + '/user', body, {headers: headers})
        // using below line for AWS deployment
        return this.http.post('http://' + this.domain + '/user', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    signin(user: User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        // using below line for heroku deployment
        // return this.http.post('https://' + this.domain + '/user/signin', body, {headers: headers})
        // using below line for AWS deployment
        return this.http.post('http://' + this.domain + '/user/signin', body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    logout() {
        localStorage.clear();
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null;
    }
}