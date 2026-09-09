import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { AdminApiService } from 'src/app/services/admin-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-ys-feedbacks',
    templateUrl: './ys-feedbacks.component.html',
    styleUrls: ['./ys-feedbacks.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class YsFeedbacksComponent implements OnInit {

  constructor(private api: AdminApiService, public commonService: CommonService, public modalService: NgbModal) { }
  
  page = 1; pageSize = 10;
  list: any = []; search_bar: string;
  pageLoader: boolean; viewForm: any = {};
  filterForm: any = { type: 'all', from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date() };
  imgBaseUrl = environment.img_baseurl;

  ngOnInit(): void {
    this.pageLoader = true;
    let fromDate = new Date(this.filterForm.from_date).setHours(0,0,0,0);
    let toDate = new Date(this.filterForm.to_date).setHours(23,59,59,999);
    this.api.FEEDBACK_LIST({ type: this.filterForm.type, from_date: fromDate, to_date: toDate }).subscribe(result => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) this.list = result.list;
      else console.log("response", result);
    });
  }

  onView(id, modalName) {
    this.api.FEEDBACK_DETAILS(id).subscribe(result => {
      if(result.status) {
        this.viewForm = result.data;
        this.modalService.open(modalName);
      }
      else console.log("response", result);
    });
  }

  onUpdate() {
    this.api.UPDATE_FEEDBACK({ _id: this.viewForm._id, status: this.viewForm.status, severity: this.viewForm.severity }).subscribe(result => {
      if(result.status) {
        document.getElementById("closeModal").click();
        this.ngOnInit();
      }
      else {
        this.viewForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}