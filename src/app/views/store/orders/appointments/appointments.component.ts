import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { OrderService } from '../order.service';
import { CommonService } from '../../../../services/common.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-appointments',
    templateUrl: './appointments.component.html',
    styleUrls: ['./appointments.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class AppointmentsComponent implements OnInit {

  pageLoader: boolean; search_bar: string; exportLoader: boolean;
  page = 1; pageSize = 10;
  params: any = {}; filterForm: any = {};
  parentList: any = []; list: any = []; addForm: any = {};
  list_type: string = 'all';
  deleteForm: any = {}; btnLoader: boolean;
  tempFilter: any = {}; selectedItem:any;
 
  constructor(private api: OrderService, public commonService: CommonService, config: NgbModalConfig, public modalService: NgbModal) { }

  onOpenFilterModal(modalName) {
    this.tempFilter = {};
    for(let key in this.filterForm) 
    {
      if(this.filterForm.hasOwnProperty(key)) this.tempFilter[key] = this.filterForm[key];
    }   
    this.selectedItem = "Status";
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  ngOnInit() {
    this.filterForm = { from_date: new Date(), to_date: new Date(new Date().setMonth(new Date().getMonth() + 1)) };
    this.getList();
  }

  getList() {
    if(this.filterForm.from_date && this.filterForm.to_date) {
      this.pageLoader = true;
      if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
      this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0,0,0,0));
      this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23,59,59,999));
      this.api.APPOINTMENT_LIST(this.filterForm).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
          this.list = result.list;
          this.list.forEach(element => {
            element.customer_name = element.customerDetails[0].name;
            element.customer_email = element.customerDetails[0].email;
          });          
        }
        else console.log("response", result);
      });
    }
  }

}