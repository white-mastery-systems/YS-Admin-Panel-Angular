import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Socket } from "ngx-socket-io";
import { fromEvent } from "rxjs";
import { CookieService } from 'ngx-cookie-service';
import { map, filter, debounceTime } from "rxjs/operators";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { SidebarService, IMenuItem } from '../../../../services/sidebar.service';
import { Utils } from './../../../animations/utils';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
declare const $: any;

@Component({
    selector: 'app-store-layout',
    templateUrl: './store-layout.component.html',
    styleUrls: ['./store-layout.component.scss'],
    standalone: false
})

export class StoreLayoutComponent implements OnInit {

  selectedItem: IMenuItem;
  currentYear: any = (new Date()).getFullYear();
  imgBaseUrl = environment.img_baseurl;
  keep_login = environment.keep_login;
  audio: any; notifyType: string;
  feedForm: any = {}; groupList: any = [];
  imgForm: any = {}; fileList: FormData = new FormData();
  msgLimit: number = 30; imgLimitInKB: number = 1024;
  msgBodyAttr: any = { totalMsg: 0, lastScrollTop: 0, skip: 0, limit: this.msgLimit };
  todayDate: string | null = ""; yesterDate: string | null = "";
  msgLoader: boolean; chatCount: number = 0;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public router: Router, public navService: SidebarService,
    public commonService: CommonService, private api: ApiService, private socket: Socket, private datePipe: DatePipe,
    private cookieService: CookieService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
    this.socket.on('new_msg', (data: any) => {
      if(this.commonService.dispChatBody) {
        this.processMsg('push', data);
        this.msgBodyAttr.totalMsg++;
        setTimeout(() => {
          let objDiv: any = document.getElementById("msg_area");
          objDiv.scrollTop = objDiv.scrollHeight;
        }, 10);
        this.socket.emit('ys_chat_viewed', data._id);
      }
      else this.chatCount++;
    });
  }

  processMsg(type: string, payload: any) {
    payload.format_date = this.datePipe.transform(payload.createdAt, 'dd MMM y');
    let gInd = this.groupList.findIndex((s: any) => s.date==payload.format_date);
    if(type=='push') {
      if(gInd != -1) this.groupList[gInd].msg_list.push(payload);
      else this.groupList.push({ date: payload.format_date, msg_list: [payload] });
    }
    else {
      if(gInd != -1) this.groupList[gInd].msg_list.unshift(payload);
      else this.groupList.unshift({ date: payload.format_date, msg_list: [payload] });
    }
  }

  ngOnInit() {
    this.updateSidebar();
    // CLOSE SIDENAV ON ROUTE CHANGE
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(routeChange => {
      this.closeChildNav();
      if(Utils.isMobile()) { this.navService.sidebarState.sidenavOpen = false; }
    });
    this.navService.getSidePanelList();
    if(this.navService.sidePanelList.length) this.setActiveFlag();
    else this.navService.sidebarState.sidenavOpen = false;
    if(this.commonService.store_details?.status=='active' && this.commonService.store_details?.login_type=='admin') {
      // get notifications
      // this.api.NOTIFICATIONS().subscribe(result => {
      //   if(result.status) this.commonService.setNotifyData(result);
      // });
      // chat count
      this.api.MESSAGE_COUNT().subscribe(result => {
        if(result.status) {
          this.chatCount = result.total;
          if(!this.chatCount && !result.initiated && !this.cookieService.check(this.commonService.store_details?.login_id+'_chat'))
            this.chatCount = 2;
        }
      });
    }
  }

  openChat() {
    this.chatCount = 0; this.commonService.dispChatBody = true; this.msgLoader = true;
    this.msgBodyAttr = { totalMsg: 0, lastScrollTop: 0, skip: 0, limit: this.msgLimit };
    let newDate = new Date();
    this.todayDate = this.datePipe.transform(newDate, 'dd MMM y');
    this.yesterDate = this.datePipe.transform(new Date(newDate.setDate(newDate.getDate() - 1)), 'dd MMM y');
    this.groupList = [{
      date: this.todayDate, msg_list: [
        {
          "room_id" : "00001", "sender_id" : "00001", "sender_name" : "Yourstore",
          "createdAt" : new Date(), "content" : "Hi"
        },
        {
          "room_id" : "00001", "sender_id" : "00001", "sender_name" : "Yourstore",
          "createdAt" : new Date(), "content" : "How can i help you?"
        }
      ]
    }];
    this.cookieService.set(this.commonService.store_details?.login_id+'_chat', "true");
    this.api.MESSAGE_LIST(this.msgBodyAttr.skip, this.msgBodyAttr.limit, null).subscribe(result => {
      this.msgLoader = false;
      if(result.status) {
        if(result.list.length) {
          let fmDate = result.list[result.list.length - 1].createdAt;
          this.groupList[0].date = this.datePipe.transform(fmDate, 'dd MMM y');
          this.groupList[0].msg_list[0].createdAt = fmDate;
          this.groupList[0].msg_list[1].createdAt = fmDate;
          this.msgBodyAttr.totalMsg = result.total;
          result.list
          .sort((a: any, b: any) => 0 - (a.createdAt > b.createdAt ? -1 : 1))
          .forEach((el: any) => { this.processMsg('push', el); });
          setTimeout(() => {
            let objDiv: any = document.getElementById("msg_area");
            if(objDiv) {
              objDiv.scrollTop = objDiv.scrollHeight;
              this.onSetMsgScrollEvt();
            }
          }, 50);
        }
      }
      // reset chat count
      this.api.MESSAGE_READ().subscribe(() => { });
    });
  }

  onSetMsgScrollEvt() {
    let objDiv: any = document.getElementById("msg_area");
    if(objDiv) {
      let scroll$ = fromEvent(objDiv, 'scroll').pipe(debounceTime(0), map(() => {
        let st = objDiv.scrollTop;
        let diff = st - this.msgBodyAttr.lastScrollTop;
        this.msgBodyAttr.lastScrollTop = (st <= 0)? 0: st;
        return (diff >= 0)? 'Down': 'Up';
      }));
      scroll$.subscribe((scrollPos) => {
        if(scrollPos=='Up') this.onLoadMoreMsg();
      });
    }
  }
  onLoadMoreMsg() {
    let totalRenderedMsgs = this.groupList.reduce((accumulator: number, currentValue: any) => {
      return accumulator + currentValue['msg_list'].length;
    }, 0);
    if(!this.msgBodyAttr.apiTriggered && this.msgBodyAttr.totalMsg > totalRenderedMsgs) {
      this.msgBodyAttr.apiTriggered = true;
      this.msgBodyAttr.skip = this.msgBodyAttr.skip+this.msgBodyAttr.limit;
      this.api.MESSAGE_LIST(this.msgBodyAttr.skip, this.msgBodyAttr.limit, null).subscribe(result => {
        if(result.status) {
          this.msgBodyAttr.apiTriggered = false;
          this.msgBodyAttr.totalMsg = result.total;
          let objDiv: any = document.getElementById("msg_area");
          let prevHeight = objDiv.scrollHeight - objDiv.scrollTop;
          result.list.forEach((el: any) => { this.processMsg('unshift', el); });
          setTimeout(() => {
            objDiv.scrollTop = objDiv.scrollHeight - prevHeight;
          });
        }
        else console.log("response", result);
      });
    }
  }

  onSendMsg() {
    let elem: any = document.getElementById('msgarea');
    if(elem.value.trim()) {
      this.fileList = new FormData();
      this.fileList.append('data', JSON.stringify({ content: elem.value.trim().replace(new RegExp('\n', 'g'), "<br />") }));
      elem.value = "";
      this.api.SEND_MESSAGE(this.fileList).subscribe(result => {
        if(!result.status) console.log("response", result);
      });
    }
    else elem.value = "";
  }
  onSendImg() {
    if(this.imgForm.img_file) {
      this.imgForm.submit = true; this.fileList = new FormData();
      if(this.imgForm.message) {
        this.imgForm.message = this.imgForm.message.trim().replace(new RegExp('\n', 'g'), "<br />");
      }
      this.fileList.append('data', JSON.stringify({ content: this.imgForm.message }));
      this.fileList.append('attachments', this.imgForm.img_file);
      this.api.SEND_MESSAGE(this.fileList).subscribe(result => {
        this.imgForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal')?.click();
          this.clearInput();
        }
        else console.log("response", result);
      });
    }
  }

  onChatEnter(event: any): void {
    if(event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendMsg();
    }
  }

  pageBack() {
    if(this.commonService.redirect) this.router.navigate([this.commonService.redirect])
    else this.commonService.goBack();
  }

  signOut() {
    if(this.commonService.store_details?.login_type=='vendor') {
      this.commonService.signOut('/vendor/signin/'+this.commonService.store_details?.sub_domain);
    }
    else this.commonService.signOut('/session/signin');
  }

  selectItem(item) {
    this.navService.sidebarState.childnavOpen = true;
    this.selectedItem = item;
    this.setActiveMainItem(item);
  }
  closeChildNav() {
    this.navService.sidebarState.childnavOpen = false;
    this.setActiveFlag();
  }

  onClickChangeActiveFlag(item) {
    this.setActiveMainItem(item);
  }
  setActiveMainItem(item) {
    this.navService.sidePanelList.forEach(item => { item.active = false; });
    item.active = true;
  }

  setActiveFlag() {
    if(window && window.location) {
      const activeRoute = window.location.hash || window.location.pathname;
      this.navService.sidePanelList.forEach(item => {
        item.active = false;
        if(!item.hidden_routes) item.hidden_routes = [];
        if(activeRoute.indexOf(item.state) !== -1 || item.hidden_routes.findIndex(el => activeRoute.indexOf(el) !== -1) !== -1) {
          this.selectedItem = item;
          item.active = true;
        }
        if(item.sub) {
          item.sub.forEach(subItem => {
            subItem.active = false;
            if(activeRoute.indexOf(subItem.state) !== -1) {
              this.selectedItem = item;
              item.active = true;
            }
            if(subItem.sub) {
              subItem.sub.forEach(subChildItem => {
                if(activeRoute.indexOf(subChildItem.state) !== -1) {
                  this.selectedItem = item;
                  item.active = true;
                  subItem.active = true;
                }
              });
            }
          });
        }
      });
    }
  }

  gotoDashboard() {
    if(this.commonService.store_details?.status=='active') this.router.navigate(['/dashboard']);
  }

  updateSidebar() {
    if(Utils.isMobile()) {
      this.navService.sidebarState.sidenavOpen = false;
      this.navService.sidebarState.childnavOpen = false;
    }
    else {
      this.navService.sidebarState.sidenavOpen = true;
    }
  }
  toggelSidebar() {
    const state = this.navService.sidebarState;
    state.sidenavOpen = !state.sidenavOpen;
    state.childnavOpen = false;
  }

  stopAudio() {
    this.audio = document.getElementById("audio-file");
    this.audio.pause();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.updateSidebar();
  }

  openNotify(x, type) {
    if(!x.viewed) {
      x.viewed = true;
      this.commonService.notifyCount = this.commonService.notifications.filter(el => !el.viewed).length;
      this.api.UPDATE_NOTIFICATIONS(x._id, type).subscribe(result => {
        if(result.status) this.commonService.setNotifyData(result);
      });
    }
    if(x.url) {
      this.router.navigate([x.url]);
      $('.store-overlay').click();
    }
  }

  btnRedirect(x) {
    if(x.link_type == 'internal') {
      this.router.navigate([x.link]);
    }
    else if(x.link_type == 'external') {
      window.open(x.link, "_blank");
    }
  }

  onSetFormData(imgList) {
    return new Promise((resolve, reject) => {
      for(let i=0; i<imgList.length; i++) {
        this.fileList.append('attachments', imgList[i].image, i+'_img');
      }
      resolve(true);
    });
  }

  onSubmitFeedback() {
    this.fileList = new FormData();
    this.feedForm.submit = true;
    this.onSetFormData(this.feedForm.image_list).then(() => {
      let formData = Object.assign({}, this.feedForm);
      delete formData.image_list;
      this.fileList.append('data', JSON.stringify(formData)); 
      this.api.ADD_FEEDBACK(this.fileList).subscribe((result) => {
        this.feedForm.submit = false;
        if(result.status) this.feedForm.success = true;
        else {
          this.feedForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    });
  }

  fileChangeListener(event) {  
    if(event.target.files?.length) {      
      let maxLimit = 5 - this.feedForm.image_list.length;
      for(let i=0; i<maxLimit; i++) {
        let fileData = event.target.files[i];
        if(fileData && ["image/jpeg", "image/png"].indexOf(fileData.type) != -1) {
          let myReader: FileReader = new FileReader();
          myReader.onload = (event: ProgressEvent) => {
            let imgTag: any = new Image();
            imgTag.src = (<FileReader>event.target).result;
            imgTag.onload = () => {
              this.feedForm.image_list.push({ image: fileData });
            }
          }
          myReader.readAsDataURL(fileData);
        }
      }
    }
  }

  chatFileChangeListener(event: any) {
    this.imgForm = {};
    if(event.target.files && event.target.files[0]) {
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size/ 1024);
      if(["image/jpeg", "image/png", "image/webp"].indexOf(fileData.type) != -1) {
        let reader = new FileReader();
        reader.onload = (event: ProgressEvent) => {
          if(fileInKB<=this.imgLimitInKB) {
            this.imgForm.temp_img = (<FileReader>event.target).result;
            this.imgForm.img_file = fileData;
          }
          else this.imgForm.error = true;
          document.getElementById("openImageModal")?.click()
        }
        reader.readAsDataURL(event.target.files[0]);
      }
      else console.log("Invaid file");
    }
  }
  clearInput() {
    let el: any = document.getElementById('inputImg');
    if(el) el.value = "";
  }
  
}

$(document).on('click', '.openNotifyBar', function() {
  $('.store-overlay').show();
  $('.notify-bar').css('display', 'block');
  $('.notify-bar').removeClass('cart-dismiss');
  $('.notify-bar').addClass('cart-opened');
  $("body").css({"overflow": "hidden"});
});
$(document).on('click', '.openFeedbackBar', function() {
  $('.store-overlay').show();
  $('.feedback-bar').css('display', 'block');
  $('.feedback-bar').removeClass('cart-dismiss');
  $('.feedback-bar').addClass('cart-opened');
  $("body").css({"overflow": "hidden"});
});
$(document).on('click', '.closebtn, .store-overlay', function() {
  $('.store-overlay').hide();
  $('.notify-bar').removeClass('cart-opened');
  $('.notify-bar').addClass('cart-dismiss');
  $('.feedback-bar').removeClass('cart-opened');
  $('.feedback-bar').addClass('cart-dismiss');
  $("body").css({"overflow": "visible"});
});