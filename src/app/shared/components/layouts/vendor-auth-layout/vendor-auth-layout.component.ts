import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ApiService } from '../../../../services/api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vendor-auth-layout',
  templateUrl: './vendor-auth-layout.component.html',
  styleUrls: ['./vendor-auth-layout.component.scss']
})

export class VendorAuthLayoutComponent implements OnInit {

  pageLoader: boolean;

  constructor(private router: Router, public commonService: CommonService, private cookieService: CookieService, private api: ApiService) { }

  ngOnInit(): void {
    this.pageLoader = true;
    let storeSplit = this.router.url.split('/');
    let storeName = storeSplit[storeSplit.length-1];
    if(storeName) {
      if(this.cookieService.check('vInfo'))
      {
        let vInfo = JSON.parse(this.cookieService.get('vInfo'));
        if(vInfo.name == storeName) {
          this.commonService.vendor_login_info = vInfo;
          this.pageLoader = false;
        }
        else this.getDomainInfo(storeName);
      }
      else this.getDomainInfo(storeName);
    }
  }

  getDomainInfo(storeName) {
    this.api.DOMAIN_INFO(storeName).subscribe(result => {
      if(result.status) {
        let storeLogo = environment.img_baseurl+"uploads/"+result.data._id+"/logo.png?v="+new Date().valueOf();
        let vInfo = {
          id: result.data._id, name: result.data.sub_domain, logo: storeLogo, theme_text: "#000",
          theme_color: result.data.theme_colors.primary, bg_color: result.data.theme_colors.primary
        };
        if(result.data.theme_colors.vendor_bg) vInfo.bg_color = result.data.theme_colors.vendor_bg;
        if(this.lightOrDark(vInfo.theme_color)=='dark') { vInfo.theme_text = "#fff"; }
        const cDate = new Date();
        cDate.setHours(cDate.getHours() + 12);
        this.commonService.vendor_login_info = vInfo;
        this.cookieService.set('vInfo', JSON.stringify(vInfo), cDate);
        setTimeout(() => { this.pageLoader = false; }, 500);
      }
      else console.log("response", result);
    });
  }

  lightOrDark(color) {
    let r, g, b, hsp;
    // Check the format of the color, HEX or RGB?
    if (color.match(/^rgb/)) {
      // If HEX --> store the red, green, blue values in separate variables
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      r = color[1];
      g = color[2];
      b = color[3];
    } 
    else {
      // If RGB --> Convert it to HEX: http://gist.github.com/983661
      color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
      r = color >> 16;
      g = color >> 8 & 255;
      b = color & 255;
    }
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
    // Using the HSP value, determine whether the color is light or dark
    if(hsp>145) return 'light'; // 127.5
    else return 'dark';
  }

}