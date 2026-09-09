import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss'],
    standalone: false
})

export class PagesComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    
  }

}