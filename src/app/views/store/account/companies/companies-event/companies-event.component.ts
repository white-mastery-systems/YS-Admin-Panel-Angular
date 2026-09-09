import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';

@Component({
    selector: 'app-companies-event',
    templateUrl: './companies-event.component.html',
    styleUrls: ['./companies-event.component.scss'],
    standalone: false
})

export class CompaniesEventComponent implements OnInit {

  pageLoader: boolean; state_list:any = [];
  compForm: any = {}; btnLoader: Boolean;
  defdial_code: string; errorMsg: string;

  constructor(
    private router: Router, public modalService: NgbModal, private activeRoute: ActivatedRoute,
    private api: CustomerApiService, public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/setting/customers/companies";
      this.commonService.secondary_header = "Add Company";
      this.compForm = { form_type: 'add', contact_person: [{}], designation: [{}]};
      if(params.id!='add') {
        this.pageLoader = true;
        this.commonService.secondary_header = "Update Company";
        this.api.COMPANY_DETAILS(params.id).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.compForm = result.data;
            this.compForm.form_type = 'edit';
            if(this.compForm.country) this.onCountryChange(this.compForm.country);
          }
          else console.log("response", result);
        });
      }
      else {
        this.compForm.country = this.commonService.store_details.country;
        this.onCountryChange(this.compForm.country);
      }
    });
  }

  onSubmit() {
    delete this.compForm.errorMsg;
    this.compForm.submit = true;
    if(this.compForm.form_type=='add') {
      this.api.ADD_COMPANIES(this.compForm).subscribe((result) => {
        this.compForm.submit = false;
        if(result.status) this.router.navigate(['/setting/customers/companies'])
        else{
          console.log("response", result);
          this.compForm.errorMsg = result.message;
        }
      })
    }
    else{
      this.api.UPDATE_COMPANIES(this.compForm).subscribe((result)=>{
        this.compForm.submit = false;
        if(result.status) this.router.navigate(['/setting/customers/companies'])
        else{
          console.log("response", result);
          this.compForm.errorMsg = result.message;
        }
      })
    }
  }

  onCountryChange(x) {    
    this.state_list = [];
    let index = this.commonService.country_list.findIndex(object => object.name==x);    
    if(index!=-1) {
      this.state_list = this.commonService.country_list[index].states;
      this.compForm.dial_code = this.commonService.country_list[index].dial_code;
      this.defdial_code = this.compForm.dial_code;
      if(!this.compForm.contact_person[0].dial_code) this.compForm.contact_person[0].dial_code = this.defdial_code;
    }
  }

  onDelete() {
    this.btnLoader = true;
    this.api.DELETE_COMPANIES({ _id: this.compForm._id }).subscribe(result => {
      setTimeout(() => { this.btnLoader = false; }, 500);
      if(result.status) {
        document.getElementById('closeModal').click();
        this.router.navigate(['/setting/customers/companies']);
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
}
