import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss']
})

export class HelpCenterComponent implements OnInit {

  help_nav: boolean;
  configData: any = environment.config_data;

  constructor(private router: Router, public commonService: CommonService) { }

  ngOnInit(): void {
    if(this.router.url=='/support/creating-your-account') this.help_nav = true;
    this.commonService.redirect = "/account";
    this.commonService.secondary_header = "Support";
  }

  onClick() {
    this.help_nav = !this.help_nav;
  }

}