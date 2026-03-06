import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../services/store-api.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-courier-partners',
  templateUrl: './courier-partners.component.html',
  styleUrls: ['./courier-partners.component.scss'],
  animations: [SharedAnimations]
})

export class CourierPartnersComponent implements OnInit {

  page = 1; pageSize = 10;
  list: any = []; search_bar: string;
  cpForm: any; deleteForm: any;
  pageLoader: boolean; popupLoader: boolean;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private storeApi: StoreApiService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.commonService.redirect = "/setting/shipping-methods";
    this.commonService.secondary_header = "Shipping Integration";
    this.pageLoader = true;
    this.storeApi.CP_LIST().subscribe(result => {
      if(result.status) this.setCpList(result);
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

	onSubmit() {
    this.cpForm.submit = true;
    if(this.cpForm.form_type=='add') {
      this.storeApi.ADD_CP(this.cpForm).subscribe(result => {
        this.cpForm.submit = false;
        if(result.status) {
          this.setCpList(result);
          document.getElementById('closeModal').click();
        }
        else {
          this.cpForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.storeApi.UPDATE_CP(this.cpForm).subscribe(result => {
        this.cpForm.submit = false;
        if(result.status) {
          this.setCpList(result);
          document.getElementById('closeModal').click();
        }
        else {
          this.cpForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }
  
  // EDIT
  onEdit(x, modalName) {
    this.popupLoader = true; this.cpForm = { form_type: 'edit' };
    this.modalService.open(modalName, { windowClass: 'scroll-modal-xl', scrollable : true });
    this.storeApi.CP_DETAILS(x._id).subscribe(result => {
      this.popupLoader = false;
      if(result.status) {
        this.cpForm = result.data;
        this.cpForm.form_type = 'edit';
        if(!this.cpForm.metadata) this.cpForm.metadata = {};
      }
      else console.log("response", result);
    });
  }

  onUpdateStatus() {
    let newStatus = 'active';
    if(this.cpForm.status=='active') newStatus = 'inactive';
    let sendData: any = {};
    for(let key in this.cpForm) {
      if(this.cpForm.hasOwnProperty(key)) sendData[key] = this.cpForm[key];
    }
    sendData.status = newStatus;
    this.cpForm.submit = true;
    this.storeApi.UPDATE_CP(sendData).subscribe(result => {
      this.cpForm.submit = false;
      if(result.status) {
        this.setCpList(result);
        document.getElementById('closeModal').click();
      }
      else {
        this.cpForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  
  // DELETE
  onDelete() {
    this.deleteForm.submit = true;
    this.storeApi.DELETE_CP(this.deleteForm).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        this.setCpList(result);
        document.getElementById('closeModal').click();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  setCpList(result) {
    this.list = result.list;
    this.commonService.courier_partners = result.list.filter(obj => obj.status=='active');
    this.commonService.updateLocalData('courier_partners', this.commonService.courier_partners);
  }

}