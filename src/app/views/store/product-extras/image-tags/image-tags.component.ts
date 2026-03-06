import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { CommonService } from '../../../../services/common.service';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { ExcelService } from '../../../../services/excel.service';

@Component({
  selector: 'app-image-tags',
  templateUrl: './image-tags.component.html',
  styleUrls: ['./image-tags.component.scss'],
  animations: [SharedAnimations]
})

export class ImageTagsComponent implements OnInit {

  pageLoader: boolean;
  page=1; pageSize = 10; 
  maxRank: any = 0; search_bar: string;
	tagForm: any; deleteForm: any;
  storeAutoTags: any = []; list: any = [];
  defaultTags: any = []; dbList: any = [];

  constructor(
    public modalService: NgbModal, public commonService: CommonService, private api: ProductExtrasApiService,
    private datepipe: DatePipe, private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.commonService.redirect = "/product-sections/extras";
    this.commonService.secondary_header = "Image Tags";
    if(this.commonService.store_details?.additional_features?.disp_all_products) {
      this.defaultTags.push({ type: 'sold_out', display: 'Sold Out', name: 'Sold Out', rank: -2, status: 'inactive' });
    }
    this.defaultTags.push(
      { type: 'new_arrival', display: 'New Arrival', name: 'New Arrival', rank: -1, status: 'inactive' },
      { type: 'on_sale', display: 'On Sale', name: 'On Sale', rank: 0, status: 'inactive' }
    );
    this.pageLoader = true;
    this.api.IMGTAG_LIST().subscribe((result) => {
      setTimeout(() => { this.pageLoader = false; }, 500);
      if(result.status) this.setList(result);
      else console.log("response",result);
		});
  }

  setList(result) {
    this.list = []; this.dbList = result.list;
    this.storeAutoTags = result.auto_tags;
    this.defaultTags.forEach(el => {
      let tIndex = this.storeAutoTags.findIndex(obj => obj.type==el.type);
      if(tIndex!=-1) {
        el.name = this.storeAutoTags[tIndex].name;
        el.status = this.storeAutoTags[tIndex].status;
      }
      this.list.push(el);
    });
    this.dbList.forEach(obj => { this.list.push(obj); });
    this.maxRank = this.dbList.length;
  }

  onSubmit() {
    this.tagForm.submit = true;
    if(this.tagForm.form_type=='add') {
      this.api.ADD_IMGTAG(this.tagForm).subscribe((result) => {
        this.tagForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.setList(result);
        }
        else {
          this.tagForm.errorMsg = result.message;
          console.log("response",result)
        }
      });
    }
    else {
      if(this.tagForm.type) {
        let tIndex = this.storeAutoTags.findIndex(el => el.type==this.tagForm.type);
        if(tIndex!=-1) this.storeAutoTags[tIndex].name = this.tagForm.name;
        else this.storeAutoTags.push({ type: this.tagForm.type, name: this.tagForm.name, status: 'inactive' });
        this.api.UPDATE_AUTO_IMG_TAG({ auto_tags: this.storeAutoTags }).subscribe((result) => {
          this.tagForm.submit = false;
          if(result.status) {
            document.getElementById('closeModal').click();
            this.setList(result);
          }
          else {
            console.log("response", result);
            this.tagForm.errorMsg = result.message;
          }
        });
      }
      else {
        this.api.UPDATE_IMGTAG(this.tagForm).subscribe((result) => {
          this.tagForm.submit = false;
          if(result.status) {
            document.getElementById('closeModal').click();
            this.setList(result);
          }
          else {
            console.log("response", result);
            this.tagForm.errorMsg = result.message;
          }
        });
      }
    }
  }

  onUpdateStatus(x) {
    let newStatus = 'active';
    if(x.status=='active') newStatus = 'inactive';
    if(x.type) {
      let tIndex = this.storeAutoTags.findIndex(el => el.type==x.type);
      if(tIndex!=-1) this.storeAutoTags[tIndex].status = newStatus;
      else this.storeAutoTags.push({ type: x.type, name: x.name, status: newStatus });
      this.api.UPDATE_AUTO_IMG_TAG({ auto_tags: this.storeAutoTags }).subscribe((result) => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.setList(result);
        }
        else {
          console.log("response", result);
          this.tagForm.errorMsg = result.message;
        }
      });
    }
    else {
      let sendData: any = {};
      for(let key in x) {
        if(x.hasOwnProperty(key)) sendData[key] = x[key];
      }
      sendData.status = newStatus;
      this.api.UPDATE_IMGTAG(sendData).subscribe((result) => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.setList(result);
        }
        else {
          console.log("response", result);
          this.tagForm.errorMsg = result.message;
        }
      });
    }
  }

  onEdit(x, modalName) {
    this.tagForm = { form_type: 'edit' };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.tagForm[key] = x[key];
    }
    this.modalService.open(modalName, {windowClass: 'scroll-modal-xl', scrollable : true});
  }

  onDelete() {
    this.deleteForm.submit = true;
    this.api.DELETE_IMGTAG(this.deleteForm).subscribe((result) => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.setList(result);
      }
      else {
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

  exportAsXLSX() {
    let exportList = [];    
    if(this.dbList.length) {
      this.dbList.forEach(el => {
        exportList.push({ "Name": el.name });
      });
      this.excelService.exportAsExcelFile(exportList, 'Image-tags '+this.datepipe.transform(new Date(), 'dd-MM-y'));
    }
  }

}