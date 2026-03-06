import { Component, OnInit } from '@angular/core';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';
import { StoreApiService } from 'src/app/services/store-api.service';

@Component({
  selector: 'app-notification-setup',
  templateUrl: './notification-setup.component.html',
  styleUrls: ['./notification-setup.component.scss'],
  providers: [AmazingTimePickerService]
})

export class NotificationSetupComponent implements OnInit {

  pageLoader: boolean;
  errorMsg: any; successMsg: any; formSubmit: boolean;
  beforeDays: any = ['reward_expiry', 'coupon_expiry'];
  notify_triggers: any = [
    {
      isActive: false, type: 'abandoned_cart', name: "Abandoned Cart",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "duration", triggers: ['duration', 'fixed']
    },
    {
      isActive: false, type: 'product_wishlist', name: "Product Wishlist",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "instant", triggers: ['instant', 'duration', 'fixed']
    },
    {
      isActive: false, type: 'wishlist_fast_selling', name: "Wishlist Fast Selling",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "instant", triggers: ['instant']
    },
    {
      isActive: false, type: 'wishlist_soldout', name: "wishlist Sold Out",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "instant", triggers: ['instant']
    },
    {
      isActive: false, type: 'wishlist_restock', name: "Wishlist Restock",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "duration", triggers: ['duration', 'fixed']
    },
    {
      isActive: false, type: 'catalog_follow', name: "Catalog Follow",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "instant", triggers: ['instant', 'duration', 'fixed']
    },
    {
      isActive: false, type: 'catalog_unfollow', name: "Catalog Unfollow",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "instant", triggers: ['instant', 'duration', 'fixed']
    },
    {
      isActive: false, type: 'catalog_new_product', name: "Catalog New Product",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "fixed", triggers: ['fixed']
    },
    {
      isActive: false, type: 'catalog_disc_product', name: "Catalog Discount Product",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "fixed", triggers: ['fixed']
    },
    {
      isActive: false, type: 'reward_point_added', name: "Reward Point Added",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "instant", triggers: ['instant']
    },
    {
      isActive: false, type: 'manual_point_update', name: "Manual Reward Point Added",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "instant", triggers: ['instant']
    },
    {
      isActive: false, type: 'reward_expiry', name: "Reward Point Expiry",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "fixed", triggers: ['fixed']
    },
    {
      isActive: false, type: 'reward_expired', name: "Reward Point Expired",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "fixed", triggers: ['fixed']
    },
    {
      isActive: false, type: 'offer_code_created', name: "Coupon Created",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "instant", triggers: ['instant']
    },
    {
      isActive: false, type: 'coupon_expiry', name: "Coupon Expiry",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "fixed", triggers: ['fixed']
    },
    {
      isActive: false, type: 'coupon_expired', name: "Coupon Expired",
      desc: "", btn_disable: false,
      msg_enabled: false, trigger_type: "fixed", triggers: ['fixed']
    },
    // {
    //   isActive: false, type: 'product_restock', name: "Notify on Product Restock",
    //   desc: "", btn_disable: false,
    //   msg_enabled: false, trigger_type: "fixed", triggers: ['fixed']
    // },
    {
      isActive: false, type: 'signup', name: "Signup",
      desc: "", btn_disable: true,
      msg_enabled: true, trigger_type: "instant", triggers: ['instant']
    },
    {
      isActive: false, type: 'order_placed', name: "Order Placed",
      desc: "", btn_disable: true,
      msg_enabled: true, trigger_type: "instant", triggers: ['instant']
    },
    {
      isActive: false, type: 'order_confirmed', name: "Order Confirmed",
      desc: "", btn_disable: true,
      msg_enabled: true, trigger_type: "instant", triggers: ['instant']
    },
    {
      isActive: false, type: 'order_dispatched', name: "Order Dispatched",
      desc: "", btn_disable: true,
      msg_enabled: true, trigger_type: "instant", triggers: ['instant']
    },
    {
      isActive: false, type: 'order_delivered', name: "Order Delivered",
      desc: "", btn_disable: true,
      msg_enabled: true, trigger_type: "instant", triggers: ['instant']
    }
  ];
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, public api: StoreApiService,
    private atp: AmazingTimePickerService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.pageLoader = true; this.formSubmit = false;
    this.api.STORE_DETAILS().subscribe((result) => {
      if(result.status) {
        setTimeout(() => { this.pageLoader = false; }, 500);
        let dbList = result.data.notify_triggers;
        this.notify_triggers.forEach(el => {
          let notData = dbList.find(obj=> obj.type === el.type);
          if(notData) {
            el.isActive = true;
            for (let prop in notData) { el[prop] = notData[prop]; }
          }
        });
      }
      else console.log("response", result);
    });
  }
  
  onSubmit() {
    delete this.errorMsg; delete this.successMsg; this.formSubmit = true;
    this.api.STORE_UPDATE({ notify_triggers: this.notify_triggers.filter(el => el.isActive) }).subscribe(result => {
      this.formSubmit = false;
      if(result.status) {
        this.successMsg = 'Updated Successfully';
        setTimeout(()=>{ this.successMsg = ''; }, 3000)
      }
      else{
        this.errorMsg = result.message;
        console.log("response", result);
      } 
    });
  }

  timePicker(x) {
    const amazingTimePicker =this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      x.time = this.commonService.timeConversion(time);
    });
  }

  incQty(x) {
    if(x.hrs_after && x.hrs_after < 24) x.hrs_after += 0.5;
    if(!x.hrs_after) x.hrs_after = 1;
  }
  decQty(x) {
    if(x.hrs_after && x.hrs_after > 1) x.hrs_after -= 0.5;
    if(!x.hrs_after) x.hrs_after = 1;
  }
  
}