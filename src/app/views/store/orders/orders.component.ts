import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
declare const $: any;

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent implements OnInit {

  constructor(public router: Router, public commonService: CommonService) { }

  ngOnInit(): void {
    if(this.router.url=='/orders') {
      let rLink = '/orders/product/live/all';
      if(this.commonService.order_menu_list[0]?.state) rLink = this.commonService.order_menu_list[0]?.state;
      this.router.navigate([rLink]);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      $('.hz_carosal').each((i, obj) => {
        if(obj.className=='hz_carosal carosal_button') {
          this.onSelect(i+1);
        }
      });​
    }, 400);
  }

  onSelect(index) {
    setTimeout(() => {
      document.getElementById('elem_'+index)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }, 100);
  }

}