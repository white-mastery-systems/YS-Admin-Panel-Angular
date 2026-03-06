import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../services/common.service';


@Component({
  selector: 'app-product-extras',
  templateUrl: './product-extras.component.html',
  styleUrls: ['./product-extras.component.scss']
})

export class ProductExtrasComponent implements OnInit {
    
  constructor(public commonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.router.navigate(['/product-sections/extras']);
  }

}