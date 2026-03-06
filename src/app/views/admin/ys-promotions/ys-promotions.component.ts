import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AdminApiService } from 'src/app/services/admin-api.service';
import { CommonService } from 'src/app/services/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ys-promotions',
  templateUrl: './ys-promotions.component.html',
  styleUrls: ['./ys-promotions.component.scss'],
  animations: [SharedAnimations]
})

export class YsPromotionsComponent implements OnInit {
  
  pageLoader: boolean; search_bar: string;
  imgBaseUrl = environment.img_baseurl;
  baseUrl = environment.base_url;
  pageSize = 10; page = 1;
  list:any = [];
  deviceTypes: any = [
    { disp : "All", value:"all" },
    { disp : "Web", value:"web" },
    { disp : "Android", value:"android" },
    { disp : "IOS", value:"ios" }
  ];
  proForm: any = {}; deleteForm: any = {};

  constructor(public modalService: NgbModal, private adminApi: AdminApiService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.pageLoader = true;
    this.adminApi.PROMOTION_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onAdd(modalName) {
    this.proForm = { form_type: 'add', rank: this.list.length+1 }; 
    this.deviceTypes.forEach(element => { delete element.status; });
    this.modalService.open(modalName);
  }

  onSubmit() {
    this.proForm.submit = true;
    this.proForm.device_type = [];
    this.deviceTypes.forEach(element => {
      if(element.status) this.proForm.device_type.push(element.value);
    });
    if(this.proForm.form_type=='add') {    
      this.adminApi.ADD_PROMOTION(this.proForm).subscribe((result) => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.proForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.adminApi.UPDATE_PROMOTION(this.proForm).subscribe((result) => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.proForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // EDIT
  onEdit(x, modalName) {
    this.proForm = { form_type: 'edit', prev_rank: x.rank };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.proForm[key] = x[key];
    }    
    this.deviceTypes.forEach(element => {
      delete element.status;
      if(x.device_type?.indexOf(element.value)!=-1) element.status = true;      
    });
    this.modalService.open(modalName);
  }

  onDelete() {
    this.adminApi.DELETE_PROMOTION(this.deleteForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.proForm.image = (<FileReader>event.target).result;
        this.proForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

}