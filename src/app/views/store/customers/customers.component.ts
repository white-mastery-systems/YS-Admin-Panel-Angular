import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-customers',
    templateUrl: './customers.component.html',
    styleUrls: ['./customers.component.scss'],
    standalone: false
})

export class CustomersComponent implements OnInit {

  constructor(public router: Router, public commonService: CommonService) { }

  ngOnInit(): void {
    if(this.router.url=='/setting/customers') this.router.navigate(['/setting/customers/signup-user']);
  }

}