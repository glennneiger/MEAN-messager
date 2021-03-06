import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";

import { ErrorService } from '../errors/error.service';
import { Message } from "./message.model";

@Injectable()
export class MessageService {
    private messages: Message[] = [];
    // for local domain
    // private domain: string = 'localhost:3000';

    // for heroku domain
    // private domain: string = 'angular2-messager-deployment.herokuapp.com';

    // for aws domain
    private domain: string = 'angular2-messager-deployment.us-east-1.elasticbeanstalk.com';

    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http, private errorService: ErrorService) {
    }

    addMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        // using below line for heroku deployment
        // return this.http.post('https://' + this.domain + '/message' + token, body, {headers: headers})
        // using below line for AWS deployment
        return this.http.post('http://' + this.domain + '/message' + token, body, {headers: headers})
            .map((response: Response) => {
                const result = response.json();
                const message = new Message(
                    result.obj.content,
                    result.obj.user.firstName,
                    result.obj._id,
                    result.obj.user._id);
                this.messages.push(message);
                return message;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    getMessages() {
        // using below line for heroku deployment
        // return this.http.get('https://' + this.domain + '/message')
        // using below line for AWS deployment
        return this.http.get('http://' + this.domain + '/message')
            .map((response: Response) => {
                const messages = response.json().obj;
                let transformedMessages: Message[] = [];
                for (let message of messages) {
                    transformedMessages.push(new Message(
                        message.content,
                        message.user.firstName,
                        message._id,
                        message.user._id)
                    );
                }
                this.messages = transformedMessages;
                return transformedMessages;
            })
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'});
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        // using below line for heroku deployment
        // return this.http.patch('https://' + this.domain + '/message/' + message.messageId + token, body, {headers: headers})
        // using below line for AWS deployment
        return this.http.patch('http://' + this.domain + '/message/' + message.messageId + token, body, {headers: headers})
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }

    deleteMessage(message: Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
        const token = localStorage.getItem('token')
            ? '?token=' + localStorage.getItem('token')
            : '';
        // using below line for heroku deployment
        // return this.http.delete('https://' + this.domain + '/message/' + message.messageId + token)
        // using below line for AWS deployment
        return this.http.delete('http://' + this.domain + '/message/' + message.messageId + token)
            .map((response: Response) => response.json())
            .catch((error: Response) => {
                this.errorService.handleError(error.json());
                return Observable.throw(error.json());
            });
    }
}