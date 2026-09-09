import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ShippingService } from '../shipping.service';
import { DeploymentService } from '../../deployment/deployment.service';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-shipping-methods',
    templateUrl: './shipping-methods.component.html',
    styleUrls: ['./shipping-methods.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class ShippingMethodsComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  shippingForm: any; deleteForm: any;
  list: any = []; parentList: any = [];
  pageLoader: boolean;
  deliveryPartners: any = [
    { name: "Delhivery", tracking_link: "https://www.delhivery.com/track/package/" }
  ];
  popupLoader: boolean;
  calcForm: any = {};

  constructor(config: NgbModalConfig, public modalService: NgbModal, private api: ShippingService, public commonService: CommonService, private deployApi: DeploymentService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.commonService.redirect = "/setting";
    if(this.commonService.previous_route && this.commonService.previous_route!='/') this.commonService.redirect = this.commonService.previous_route;
    this.commonService.secondary_header = "Shipping & Delivery Methods";
    if(!this.commonService.desktop_device) this.commonService.secondary_header = "Shipping Methods";
    this.pageLoader = true;
    this.api.SHIPPING_LIST().subscribe(result => {
      if(result.status) {
        this.commonService.shipping_list = result.list.filter(obj => obj.status=='active');
        this.commonService.updateLocalData('shipping_list', this.commonService.shipping_list);
        this.list = result.list.filter(obj => !obj.vendor_id);
        if(this.commonService.store_details?.type == 'multi_vendor') {
          this.parentList = this.commonService.vendor_list.map(({ _id, company_details }) => ({
            _id, name: company_details.brand
          }));
          this.parentList.forEach(el => {
            el.shipping_list = result.list.filter(obj => obj.vendor_id==el._id);
          });
        }
        else if(this.commonService.ys_features.indexOf('branch_stock')!=-1) {
          this.parentList = this.commonService.store_branch_list.map(({ _id, name }) => ({
            _id, name
          }));
          this.parentList.forEach(el => {
            el.shipping_list = result.list.filter(obj => obj.vendor_id==el._id);
          });
        }
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onCalculate() {
    this.calcForm.shipping_price = null;
    let selectedShipping = this.calcForm.shipping_method;
    if(selectedShipping.shipping_type=='Domestic') {
      if(!selectedShipping.domes_zone_status) {
        this.calcForm.shipping_price = selectedShipping.shipping_price;
        if(selectedShipping.free_shipping && selectedShipping.minimum_price <= this.calcForm.amount)
          this.calcForm.shipping_price = 0;
      }
    }
    else if(selectedShipping.shipping_type=='International') {
      if(!selectedShipping.inter_zone_status) {
        this.calcForm.shipping_price = selectedShipping.shipping_price;
        if(selectedShipping.free_shipping && this.calcForm.amount >= selectedShipping.minimum_price)
          this.calcForm.shipping_price = 0;
      }
      else {
        this.calcForm.shipping_price = this.findInternatioanlPrice(selectedShipping.inter_zones, this.calcForm.country, this.calcForm.weight);
        if(selectedShipping.free_shipping && this.calcForm.amount >= selectedShipping.minimum_price)
          this.calcForm.shipping_price = 0;
      }
    }
  }

  findInternatioanlPrice(zones: any[], country: string, cartWeight: number) {
    // zone
    let zonePrice = 0;
    let filterZone = zones.filter(obj => obj.countries.findIndex(x => x == country)!=-1);
    if(filterZone.length && filterZone[0].rate_multiplier.length) {
      // multiplier
      let rateMultiplier = filterZone[0].rate_multiplier;
      rateMultiplier.sort((a, b) => 0 - (a.weight > b.weight ? -1 : 1));  // sort asc
      let shippingMultiplier = rateMultiplier[rateMultiplier.length - 1].multiplier;
      let filterMultiplier = rateMultiplier.filter(obj => obj.weight>=cartWeight);
      if(filterMultiplier.length) shippingMultiplier = filterMultiplier[0].multiplier;
      // find price
      zonePrice = Math.round(filterZone[0].price_per_kg*shippingMultiplier);
    }
    return zonePrice;
  }

  onSubmit() {
    this.shippingForm.submit = true;
    if(this.shippingForm.formType=='add') {
      this.api.ADD_SHIPPING(this.shippingForm).subscribe(result => {
        this.shippingForm.submit = false;
        this.updateDeployStatus();
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.shippingForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_SHIPPING(this.shippingForm).subscribe(result => {
        this.shippingForm.submit = false;
        this.updateDeployStatus();
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.shippingForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // Edit
  onEdit(x, modalName) {
    this.shippingForm = { formType: 'update' }; this.popupLoader = true;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.SHIPPING_DETAILS(x).subscribe(result => {
      this.popupLoader = false;
      if(result.status) {
        this.shippingForm = result.data;
        this.shippingForm.formType = 'update';
      }
      else console.log("response", result);
    });
  }

  onUpdateStatus() {
    this.deleteForm.submit = true;
    if(this.deleteForm.exist_status=='active') this.deleteForm.status='inactive';
    else this.deleteForm.status='active';
    this.api.UPDATE_SHIPPING({ _id: this.deleteForm._id, status: this.deleteForm.status }).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        console.log("response", result);
        this.deleteForm.error_msg = result.message;
      }
    });
  }

  // Delete
  onDelete() {
    this.deleteForm.submit = true;
    this.api.DELETE_SHIPPING(this.deleteForm).subscribe(result => {
      this.deleteForm.submit = false;
      this.updateDeployStatus();
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

  updateDeployStatus() {
    if(!this.commonService.deploy_stages['shipping']) {
      let formData = { store_id: this.commonService.store_details._id, "deploy_stages.shipping": new Date() };
      this.deployApi.UPDATE_DEPLOY_DETAILS(formData).subscribe(result => {
        if(result.status) {
          this.commonService.deploy_stages = result.data.deploy_stages;
          this.commonService.updateLocalData("deploy_stages", this.commonService.deploy_stages);
        }
      });
    }
  }

}