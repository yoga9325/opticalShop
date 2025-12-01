import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse
} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { EncryptionService } from '../services/encryption.service';

@Injectable()
export class EncryptionInterceptor implements HttpInterceptor {

    constructor(private encryptionService: EncryptionService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(request);

        // encriyption disabled for development

        // let clonedRequest = request;
        // if (request.body) {
        //     const encryptedBody = this.encryptionService.encrypt(request.body);
        //     clonedRequest = request.clone({
        //         body: encryptedBody,
        //         setHeaders: { 'Content-Type': 'application/json' }
        //     });
        // }

        // return next.handle(clonedRequest).pipe(
        //     map((event: HttpEvent<any>) => {
        //         if (event instanceof HttpResponse) {
        //             if (event.body) {
        //                 const decryptedBody = this.encryptionService.decrypt(event.body);
        //                 if (decryptedBody) {
        //                     return event.clone({ body: decryptedBody });
        //                 }
        //             }
        //         }
        //         return event;
        //     })
        // );
    }
}
