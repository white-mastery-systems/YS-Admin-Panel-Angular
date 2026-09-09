import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { DatePipe, TitleCasePipe, CurrencyPipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UserInterceptor } from './user.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

let socketOptions = {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
  transports: ["websocket"],
  path: environment.socket_path,
  secure: false,
  rejectUnauthorized: false,
  forceNew: true,
  timeout: 6000
};
const socketConfig: SocketIoConfig = { url: environment.socket_url, options: socketOptions };

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        SharedModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SocketIoModule.forRoot(socketConfig),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.Service_worker,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })], providers: [
        DatePipe, TitleCasePipe, CurrencyPipe,
        { provide: HTTP_INTERCEPTORS, useClass: UserInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi())
    ] })

export class AppModule { }