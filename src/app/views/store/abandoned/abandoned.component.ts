import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-abandoned',
    templateUrl: './abandoned.component.html',
    styleUrls: ['./abandoned.component.scss'],
    standalone: false
})

export class AbandonedComponent implements OnInit {

  constructor(public router: Router, public commonService: CommonService) { }

  ngOnInit(): void {
    if(this.router.url=='/orders/abandoned-cart') this.router.navigate(['/orders/abandoned-cart/customer']);
    else if(this.router.url=='/orders/abandoned-quote') this.router.navigate(['/orders/abandoned-quote/customer']);
  }

}