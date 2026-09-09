import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';
declare const $: any;

@Component({
    selector: 'app-product-sections',
    templateUrl: './product-sections.component.html',
    styleUrls: ['./product-sections.component.scss'],
    standalone: false
})

export class ProductSectionsComponent implements OnInit {

  constructor(public router: Router, public commonService: CommonService) { }

  ngOnInit(): void {
    if(this.router.url=='/product-sections') {
      if(this.commonService.route_permission_list.indexOf('products')!=-1) this.router.navigate(['/product-sections/products']);
      else if(this.commonService.route_permission_list.indexOf('catalogs')!=-1) this.router.navigate(['/product-sections/catalogs']);
      else if(this.commonService.route_permission_list.indexOf('product_archive')!=-1) this.router.navigate(['/product-sections/archive']);
      else if(this.commonService.route_permission_list.indexOf('product_reviews')!=-1) this.router.navigate(['/product-sections/reviews']);
      else this.router.navigate(['/product-sections/extras']);
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
      document.getElementById('elem_'+index).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }, 100);
  }

}