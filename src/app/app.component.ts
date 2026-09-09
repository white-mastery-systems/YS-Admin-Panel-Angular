import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, NavigationEnd } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { SwPush } from '@angular/service-worker';
import { Socket } from "ngx-socket-io";
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AppUpdate, AppUpdateAvailability } from '@capawesome/capacitor-app-update';
import { App as CapacitorApp } from '@capacitor/app';
import { environment } from '../environments/environment';
import { CommonService } from './services/common.service';
import { ApiService } from './services/api.service';
import { SocketService } from './services/socket.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})

export class AppComponent {
  
  @HostListener('window:scroll')
  getScrollPosition() {
    this.commonService.scroll_y_pos = window.pageYOffset;
    this.commonService.screen_width = window.innerWidth;
    this.commonService.screen_height = window.innerHeight;
  }
  @HostListener('window:resize')
  getScreenProperties() {
    this.commonService.scroll_y_pos = window.pageYOffset;
    this.commonService.screen_width = window.innerWidth;
    this.commonService.screen_height = window.innerHeight;
    this.commonService.desktop_device = true;
    if(this.commonService.screen_width<=1024) this.commonService.desktop_device = false;
  }
  audio: any;

  constructor(
    private router: Router, config: NgbModalConfig, public modalService: NgbModal, public commonService: CommonService,
    private cdr: ChangeDetectorRef, private deviceService: DeviceDetectorService, private cookieService: CookieService,
    private api: ApiService, private swPush: SwPush, private socket: Socket, private io: SocketService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
    this.getScrollPosition();
    this.getScreenProperties();
    if(localStorage.getItem("darkSwitch")) {
      this.commonService.dark_theme = true;
      document.body.setAttribute("data-theme", "true");
    }
    // device type
    if(this.deviceService.isDesktop()) this.commonService.isDesktop = true;
    let iosPlatforms = ["iPad", "iPhone", "iPod", "iPod touch"];
    if(iosPlatforms.indexOf(navigator.platform) != -1) this.commonService.ios = true;
    // push notification
    if(!environment.keep_login && this.swPush.isEnabled) {
      this.swPush.messages.subscribe((event: any) => {
        // console.log("receive notification", event);
        if(event?.notification?.data?.keyword=='live_order') {
          // open live order modal
          if(!document.getElementById("newOrderModalContent") && document.getElementById("openNewOrderModal")) {
            this.audio = document.getElementById("audio-file");
            this.audio.play();
            this.audio.loop = true;
            document.getElementById("openNewOrderModal").click();
          }
        }
        // get notifications
        // this.api.NOTIFICATIONS().subscribe(result => {
        //   if(result.status) this.commonService.setNotifyData(result);
        // });
      });
      this.swPush.notificationClicks.subscribe(({action, notification}) => {
        if(notification?.data?.url) this.router.navigate([notification.data.url]);
      });
    }
    // socket
    this.socket.on('socketId', (socketId: any) => {
      console.log("socketId", socketId);
      if(this.commonService.store_details?._id) {
        this.io.onCreateRoom({ store_id: this.commonService.store_details.login_id });
      }
    });
  }

  ngAfterViewChecked() {
    //your code to update the model
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    let currentUrl = this.router.url;
    /* ROUTER EVENT */
    this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd) {
        delete this.commonService.redirect;
        delete this.commonService.secondary_header;
        delete this.commonService.dispChatBody;
        delete this.commonService.dispChatIcon;
        // prev route
        this.commonService.previous_route = currentUrl;
        currentUrl = event.url.split('?')[0];
        this.commonService.curr_route = currentUrl;
      }
    });
    // mobile app
    if(environment.keep_login) {
      CapacitorApp.addListener('backButton', ({canGoBack}) => {
        if(!canGoBack){
          CapacitorApp.exitApp();
        } else {
          window.history.back();
        }
      });
      
      let current_version = this.getCurrentAppVersion();
      let available_version = this.getAvailableAppVersion();
      if(current_version >= available_version) {
        console.log("not update")
      }
      else {
        // let flex_update = this.startFlexibleUpdate();
        let immediate_update = this.performImmediateUpdate();
        // let complete_update = await this.completeFlexibleUpdate();
      }

      await PushNotifications.addListener('registration', (token: Token) => {
        console.info('Registration token: ', token.value);
        if(this.commonService.ios) {
          this.api.IOS_TOKEN({ token: token.value }).subscribe(result => {
            if(result.status && result.data.results?.length) {
              console.log('ios token', result.data.results[0].registration_token);
              localStorage.setItem('app_token', result.data.results[0].registration_token);
            }
            else console.log("ios token response", result);
          });
        }
        else this.cookieService.set('app_token', token.value);
      });

      await PushNotifications.addListener('registrationError', (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      });

      await PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
        console.log('Push received: ' +notification); 
        this.schedule(notification);
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
        this.commonService.notification_url = notification.notification.data.url;
          document.getElementById("mybtn").click();
      });

      let permStatus = await PushNotifications.checkPermissions();

      if(permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }
      if(permStatus.receive !== 'granted') {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();

      // LocalNotifications.requestPermissions().then(result => {
      //   console.log('local', result);
      // });

      // await PushNotifications.getDeliveredNotifications();
    }
  }

  async getCurrentAppVersion() 
  {
    const result = await AppUpdate.getAppUpdateInfo();
    console.log('getCurrentAppVersion', result);
    return result.currentVersion;
  };

  async getAvailableAppVersion() {
    const result = await AppUpdate.getAppUpdateInfo();
    console.log('getAvailableAppVersion', result)
    return result.availableVersion;
  };

  async openAppStore()
  {
    await AppUpdate.openAppStore();
  };

  async performImmediateUpdate() {
    const result = await AppUpdate.getAppUpdateInfo();
    if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
      return;
    }
    if (result.immediateUpdateAllowed) {
      await AppUpdate.performImmediateUpdate();
    }
  };

  async startFlexibleUpdate() {
    const result = await AppUpdate.getAppUpdateInfo();
    if (result.updateAvailability !== AppUpdateAvailability.UPDATE_AVAILABLE) {
      return;
    }
    if (result.flexibleUpdateAllowed) {
      await AppUpdate.startFlexibleUpdate();
    }
  };
  
  async completeFlexibleUpdate() {
    await AppUpdate.completeFlexibleUpdate();
  };

  schedule(notification) {
    const randomId = Math.floor(Math.random() * 10000) + 1;
    LocalNotifications.schedule({
      notifications: [
        {
          title: notification.title,
          body: notification.body,
          largeBody : notification.body,
          id: randomId,
          smallIcon: 'ic_stat_ys_icon', 
          largeIcon : 'ic_stat_ys_icon_large', 
          extra:{url : notification.data.url}    
          // attachments: [
          //   { id: 'face', url: 'https://khanoo.com/wp-content/uploads/estate_images/house/77-1576179614/230174.jpg' ,options:{}}
          // ],
          // schedule: {
          //   at: new Date(new Date().getTime()+60*10000),
          //   repeats: false
          // }
        }
      ]
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (payload) => {
        console.log('payloaddddd', payload.notification.extra.url);
        this.commonService.notification_url = payload.notification.extra.url; 
        document.getElementById("mybtn").click();  
    });
  }

  testNotify() {
    this.router.navigate([this.commonService.notification_url]);
  }

}