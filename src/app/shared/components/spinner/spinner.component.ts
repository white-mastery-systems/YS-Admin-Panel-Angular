import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    standalone: false
})

export class SpinnerComponent implements OnInit {

  constructor(public commonService: CommonService) { }

  ngOnInit(): void {
    
  }

}