import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../../account/account.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { CommonService } from '../../../../services/common.service';
import { SetupService } from '../../setup/setup.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-vendor-list',
    templateUrl: './vendor-list.component.html',
    styleUrls: ['./vendor-list.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class VendorListComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10; parent_list: any = [];
  pageLoader: boolean; list_type: string = 'all';
  list: any = []; imgBaseUrl = environment.img_baseurl;
  vendorForm: any = {}; pwdForm: any = {}; deleteForm: any = {};
  permissionList: any = [
    { title: "PRODUCT",
      sub_list: [
        { keyword: "add_product", name: "Add Product" },
        { keyword: "remove_product", name: "Remove Product" },
        { keyword: "link_product", name: "Link to Catalog" },
        { keyword: "update_product", name: "Update Product", selected_option: "update_product_overall", options: [
          { keyword: "update_product_overall", name: "Overall" },
          { keyword: "update_product_stock_only", name: "Stock Only" }
        ] }
      ]
    }
  ];
  invForm: any = {}; invoiceNum: string;
  filter_list : any = [
    {name:"All", value:"all"},
    {name:"Active", value:"active"},
    {name:"Inactive", value:"inactive"},
    {name:"New", value:"new"},
    {name:"Declined", value:"declined"}
  ];
  tempFilter : any = {}; popupLoader: boolean;
  vendorAccAmt: number = 0;

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: AccountService, private setupApi: SetupService,
    public commonService: CommonService, private deployService: DeploymentService, private router: Router
    ) {
    config.backdrop = 'static'; config.keyboard = false;
    if(this.commonService.ys_features.indexOf('measurements') != -1)
      this.permissionList.push({ keyword: "measurements", name: "Measurement Sets", sub_list: [] });
    if(this.commonService.ys_features.indexOf('addons') != -1)
      this.permissionList.push({ keyword: "addons", name: "Addons", sub_list: [] });
    if(this.commonService.ys_features.indexOf('product_filters') != -1)
      this.permissionList.push({ keyword: "product_filters", name: "Product Tags", sub_list: [] });
    if(this.commonService.ys_features.indexOf('foot_note') != -1)
      this.permissionList.push({ keyword: "foot_note", name: "Foot Note", sub_list: [] });
    if(this.commonService.ys_features.indexOf('faq') != -1)
      this.permissionList.push({ keyword: "faq", name: "FAQ", sub_list: [] });
    if(this.commonService.ys_features.indexOf('size_chart') != -1)
      this.permissionList.push({ keyword: "size_chart", name: "Size Chart", sub_list: [] });
  }

  onOpenFilterModal(modalName) {
    this.tempFilter = this.list_type;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  ngOnInit() {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/setting/store";
      this.commonService.secondary_header = "Vendors";
    }
    this.pageLoader = true;
    this.api.VENDOR_LIST().subscribe(result => {
      if(result.status) {
        this.parent_list = result.list;
        this.parent_list.forEach(el => {
          el.comp_name = el.company_details?.name;
          el.comp_brand = el.company_details?.brand;
        });
        this.commonService.vendor_list = this.parent_list.filter(el => el.status=='active').map((item: any) => ({
          _id: item._id, email: item.email, mobile: item.email,
          company_details: { name: item.company_details.name, brand: item.company_details.brand },
          pickup_address: item.pickup_address, registered_address: item.registered_address, status: item.status
        }));
        this.commonService.updateLocalData('vendor_list', this.commonService.vendor_list);
        this.onTypeChange(this.list_type);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onSubmit() {
    delete this.vendorForm.errorMsg; delete this.vendorForm.disableSubmit;
    let sendData = { _id: this.vendorForm._id, permission_list: [], form_type: 'edit_permissions' };
    this.permissionList.forEach(obj => {
      if(obj.selected) sendData.permission_list.push(obj.keyword);
      obj.sub_list.forEach(el => {
        if(el.selected) {
          sendData.permission_list.push(el.keyword);
          if(el.selected_option) sendData.permission_list.push(el.selected_option);
        }
      });
    });
    this.vendorForm.submit = true;
    this.api.UPDATE_VENDOR(sendData).subscribe(result => {
      this.vendorForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.vendorForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onOpenModal(type, modalName) {
    this.popupLoader = true;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
    this.invForm = { vendor_subs_status: false, vendor_subs_config: {} };
    if(type==='invoice') this.invForm = { vendor_inv_status: false, vendor_inv_config: {} };
    this.invForm.form_type = type;
    this.deployService.DEPLOY_DETAILS(this.commonService.store_details?._id).subscribe(result => {
      this.popupLoader = false;
      if(result.status) {
        let deployDetails = result.data;
        if(type==='invoice') {
          if(deployDetails?.vendor_inv_status) this.invForm.vendor_inv_status = deployDetails.vendor_inv_status;
          if(deployDetails?.vendor_inv_config) this.invForm.vendor_inv_config = deployDetails.vendor_inv_config;
          this.invoiceNumFormat();
        }
        else {
          if(deployDetails?.vendor_subs_status) this.invForm.vendor_subs_status = deployDetails.vendor_subs_status;
          if(deployDetails?.vendor_subs_config) this.invForm.vendor_subs_config = deployDetails.vendor_subs_config;
        }
      }
      else console.log("response", result);
    });
  }
  onUpdateConfig() {
    this.invForm.submit = true;
    this.invForm.store_id = this.commonService.store_details._id;
    this.deployService.UPDATE_DEPLOY_DETAILS(this.invForm).subscribe(result => {
      this.invForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.commonService.deploy_details = result.data;
        delete this.commonService.deploy_details.deploy_stages;
        this.commonService.updateLocalData('deploy_details', this.commonService.deploy_details);
        this.ngOnInit();
      }
      else {
        this.invForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // EDIT
  onEdit(x, modalName) {
    this.popupLoader = true;
    this.modalService.open(modalName, {size: 'lg', windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.VENDOR_DETAILS(x._id).subscribe(result => {
      this.popupLoader = false;
      if(result.status) {
        this.vendorForm = result.data;
        // for permission
        this.permissionList.forEach(obj => {
          delete obj.selected;
          if(obj.keyword && this.vendorForm.permission_list.indexOf(obj.keyword)!=-1) obj.selected = true;
          obj.sub_list.forEach(el => {
            delete el.selected; delete el.selected_option;
            if(this.vendorForm.permission_list.indexOf(el.keyword)!=-1) el.selected = true;
            if(el.options && el.options.length) {
              el.options.forEach(elem => {
                let optExist;
                if(this.vendorForm.permission_list.indexOf(elem.keyword)!=-1) {
                  optExist = true;
                  el.selected_option = elem.keyword;
                }
                if(!optExist) el.selected_option = el.options[0].keyword;
              });
            }
          });
        });
      }
      else console.log("response", result);
    });
  }

  // DELETE
  onDelete() {
    this.api.DELETE_VENDOR(this.deleteForm).subscribe(result => {
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

  onUpdateStatus() {
    let newStatus = 'active';
    if(this.deleteForm.status=='active') newStatus = 'inactive';
    this.deleteForm.submit = true;
    this.api.UPDATE_VENDOR({ _id: this.deleteForm._id, form_type: 'change_status', status: newStatus }).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

  onResetDoc() {
    this.deleteForm.submit = true;
    this.api.UPDATE_VENDOR({ _id: this.deleteForm._id, form_type: 'reset_doc' }).subscribe((result) => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      } else {
        console.log('response', result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

  // Link to RazorpayX
  onLink() {
    this.deleteForm.submit = true;
    delete this.deleteForm.errorMsg;
    this.api.LINK_VENDOR({ _id: this.deleteForm._id }).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.deleteForm.errorMsg = result.message;
      }
    });
  }

  // UPDATE PWD
  onUpdatePwd() {
    delete this.pwdForm.errorMsg;
    this.api.UPDATE_VENDOR_PWD(this.pwdForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
				this.pwdForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onActivate(x) {
    this.deleteForm.submit = true; delete this.deleteForm.disableSubmit;
    this.api.VENDOR_ACTIVATION({ _id: this.deleteForm._id, type: x }).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        this.ngOnInit();
        if(result.message) {
          this.deleteForm.errorMsg = result.message;
          this.deleteForm.disableSubmit = true;
        }
        else document.getElementById('closeModal').click();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  invoiceNumFormat() {
    if(this.invForm.vendor_inv_config?.next_invoice_no && this.invForm.vendor_inv_config?.min_digit) {
      this.invoiceNum = String(this.invForm.vendor_inv_config.next_invoice_no).padStart(this.invForm.vendor_inv_config.min_digit, '0');
    }
  }

  onTypeChange(x) {
    this.pageLoader = true;
    if(document.getElementById('closeModal')) document.getElementById('closeModal').click();
    if(x=="active") this.list = this.parent_list.filter(obj => obj.status=='active');
    else if(x=="inactive") this.list = this.parent_list.filter(obj => obj.password && obj.status=='inactive');
    else if(x=="new") this.list = this.parent_list.filter(obj => !obj.password && obj.status=='inactive');
    else if(x=="declined") this.list = this.parent_list.filter(obj => obj.status=='declined');
    else this.list = this.parent_list;
    this.list = this.list.sort((a, b) => 0 - (a._id > b._id ? 1 : -1));
    setTimeout(() => { this.pageLoader = false; }, 500);
  }

  addVendor(modalName) {
    this.vendorAccAmt = 0;
    if(this.commonService.deploy_details?.free_ven_acc > this.commonService.vendor_list?.length) {
      // this.router.navigate(['/vendors/list/add']);
      window.open(this.commonService.store_details?.base_url+'/vendor-register', '_blank');
    }
    else {
      this.vendorAccAmt = this.commonService.deploy_details?.ven_acc_amt;
      let taxPercent = 0;
      if(environment.company_details.country==this.commonService.store_details?.country) {
        taxPercent = environment.company_details.igst;
        if(environment.company_details.state==this.commonService.store_details?.company_details?.state) {
          taxPercent = environment.company_details.sgst + environment.company_details.cgst;
        }
      }
      taxPercent = taxPercent/100;
      this.vendorAccAmt += parseFloat((taxPercent*this.vendorAccAmt).toFixed(2));
      if(this.commonService.store_details?.wallet >= this.vendorAccAmt) {
        // this.router.navigate(['/vendors/list/add']);
        window.open(this.commonService.store_details?.base_url+'/vendor-register', '_blank');
      }
      else this.modalService.open(modalName, { centered: true });
    }
  }

  ngOnDestroy() {
    if(!localStorage.getItem("ys_currency_list")) {
      this.setupApi.YS_CURRENCY_LIST().subscribe(result => {
        if(result.status) {
          this.commonService.ys_currency_list = result.list.map((item: any) => ({ name: item.name }));
          this.commonService.updateLocalData('ys_currency_list', this.commonService.ys_currency_list);
        }
      });
    }
  }

}