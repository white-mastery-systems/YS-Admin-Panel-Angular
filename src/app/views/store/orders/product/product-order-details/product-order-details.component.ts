import { Component, OnInit } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AmazingTimePickerService } from 'amazing-time-picker';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { OrderService } from '../../order.service';
import { AccountService } from '../../../account/account.service';
import { CustomerApiService } from '../../../../../services/customer-api.service';
import { ProductExtrasApiService } from '../../../product-extras/product-extras-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';
import ghanaDomesDestinations from '../../../../../../assets/json/ghana-domes-destinations.json';
import ghanaInterDestinations from '../../../../../../assets/json/ghana-inter-destinations.json';
import * as JsBarcode from 'jsbarcode';

@Component({
    selector: 'app-product-order-details',
    templateUrl: './product-order-details.component.html',
    styleUrls: ['./product-order-details.component.scss'],
    providers: [AmazingTimePickerService],
    standalone: false
})

export class ProductOrderDetailsComponent implements OnInit {

  params: any = {}; order_details: any = {}; courierForm: any;
  customNext: boolean; configData: any = environment.config_data;
  imgBaseUrl = environment.img_baseurl; updateErrorMsg: string;
  btnLoader: boolean; popupLoader: boolean; mailForm: any;
  errorMsg: string; pageLoader: boolean;
  editForm: any = {}; itemIndex: number;
  country_list: any = []; state_list: any = [];
  addressType: string; addressForm: any = {};
  customizationForm: any; mmIndex: number;
  custom_list: any = []; customIndex: number;
  existing_custom_list = []; selected_custom_list = [];
  invoice_details: any; invoice_order_list: any; cpForm: any = {};
  country_details: any; address_fields: any = [];
  vendorInfo: any = {}; selected_vendor: any;
  tax_config: any = { tax: 0 }; itemList: any = [];
  groupForm: any; remaining_items: any = [];
  courierData: any = {}; itemInfo: any = {};
  tax_rates: any = []; addedCourier: any = { name: 'Others' };
  slip_details: any = {}; vendorDetails: any = {};
  ghanaPostDestinations: any = []; currDate: Date = new Date();
  customerContNum: string;
  storeLogo: any; tempImage: any = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAMAAAAKE/YAAAABU1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgL////kjDcZAAAAcHRSTlMAAQIEBQYHCAsMDQ4PEBETFBUWHB0eHyIjJicoKissLS4wMjM0NTg5Oj0+P0BBQ0RGR0hJSktMTVBSU1RVVlhZW1xeYGFkZWZnaWprbW5wcXN0dXZ3eHl6e31+f4CBgoOEhYiJiouOj5CTlJWWl5iZHFKFVwAAAAFiS0dEcNgAbHQAAAJJSURBVHja7d3JUxNBFIDxxyARFRLEgCuKRMSoqHFBiRhAXNgMgkuM4hoQIST9/988kwOjb0I/W77vPDX1O0xNdXe9mhEhIiIibdGZu8/KlQNvdbGYO9YmcvrxpvNWY3moDeRUse789jab1Hxy3XmvMZ7MfO6ns6gUJTAPbjubSnpzb81ZdV39pntvZna7A0r0TWfYuw6VubNmiXbDKvRVU7Mrq9BlW3SzV2E+smOLdmMK9Gljs5tRoK9Zo18r0Hes0Z8V6AlrdE2BfggaNGjQoGMr5PdWDQHdujpbAg0aNGhz9Fhhb/0hoCsx5wygQYMGDRo0aNCgQYMGDRo0aNAJ0Ntx43XHW25UeLl/FQ/oSrtHFfOgQYMGDRo0aNCgQavQn/piap3nPxFz/T12LqBBgwYNGjRo0KBBgwYNGjRo0KBBgwYN+rCiqy1DK79CQLcr0KBBg/aHfmCN/qFA37ZGryvQo9boFQU6a40uKdDRljH6igItL2zN9W4NesgWPS8adMdHS3Mzq0LLJUv0nOjQ8tzOvJXWors+mD0cl0WLlvSGEfqW6NGSqVqQGzckCVpS8wbLu7OSDC0y8s0veWfqqCRGSzT6yt+Hkb9M9Ow3ePjHaBFJnR+fnJk96Kbu5zIx05J/g/5nAg0aNGjQoEGDBn0Y0JM5zw0q0GvWp6KzCvRCiOhiiOhciOjuRoBo9UiDKfpCiGh5EyL6VD1AtPE/OZRoeRIiOpoOEC2S3w0QLQMrAaJFLq42w0OLZPJP175+990jISKi/6LfVnyDpn2nrMsAAAAASUVORK5CYII=";

  constructor(
    private currency: CurrencyPipe, public modalService: NgbModal, private activeRoute: ActivatedRoute, private accApi: AccountService,
    private router: Router, private api: OrderService, public commonService: CommonService, private extrasApi: ProductExtrasApiService,
    private customerApi: CustomerApiService, private atp: AmazingTimePickerService, private datepipe: DatePipe
  ) {
    pdfMake.vfs = (pdfFonts as any).pdfMake.vfs;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.country_list = this.commonService.country_list;
      this.commonService.redirect = "/orders/product/" + params.type + "/" + params.customer_id;
      this.commonService.secondary_header = " ";
      this.params = params; this.courierForm = {}; this.selected_vendor = {};
      this.remaining_items = []; this.pageLoader = true; this.btnLoader = false; this.errorMsg = null;
      // order details
      this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
        if (result.status) {
          this.order_details = result.data;
          if (this.order_details.shipping_address) {
            this.customerContNum = this.order_details.shipping_address.dial_code + this.order_details.shipping_address.mobile;
          }
          if (this.order_details.customerDetails?.length) {
            let custDetails = this.order_details.customerDetails[0];
            this.customerContNum = custDetails?.dial_code + custDetails?.mobile;
            if (!this.order_details?.gst?.number && custDetails?.gst?.number) this.order_details.gst = custDetails.gst;
          }
          if (this.customerContNum) this.customerContNum = this.customerContNum.replace(/[^0-9]/g, "");
          this.order_details.item_list.forEach(el => {
            el.item_price = el.final_price * el.quantity;
            if (el.unit != 'Pcs') el.item_price += el.addon_price;
          });
          if (this.order_details.giftcard_amount) {
            this.order_details.final_price += this.order_details.giftcard_amount;
          }
          this.commonService.secondary_header = "#" + this.order_details.order_number;
          if (this.commonService.store_details?.login_type == 'vendor') {
            this.commonService.secondary_header = "Order Details";
          }
          if (this.params.type == 'inactive' && this.order_details.status != 'inactive') {
            this.commonService.goBack();
          }
          if (!this.order_details.vendor_list?.length) {
            if (this.order_details.item_list.findIndex(el => el.item_status == 'c_confirmed') != -1) {
              this.order_details.cancelExists = true;
            }
            if (!this.order_details.refund_amount) this.order_details.refund_amount = 0;
            if (this.params.type == 'cancelled' && this.order_details.payment_details?.name == 'COD')
              this.order_details.refund_amount = 0;
            if (this.params.type == 'live') {
              if (this.order_details.order_status == 'delivered' || this.order_details.order_status == 'cancelled') {
                this.commonService.goBack();
              }
            }
            else {
              if (this.params.type != 'inactive' && this.order_details.order_status != this.params.type) {
                this.commonService.goBack();
              }
            }
          }
          // item list
          if (this.commonService.store_details._id == environment.config_data.uru_id) {
            this.processItemListExcludeTax(this.order_details.item_list).then((respData) => {
              this.itemList = respData;
            });
          }
          else this.itemList = this.order_details.item_list;
          // address
          if (!this.order_details.billing_address) this.order_details.billing_address = this.order_details.shipping_address;
          if (this.order_details.shipping_address) {
            this.onGetAddrDetails(this.order_details.shipping_address);
            this.ghanaPostDestinations = ghanaInterDestinations;
            if (this.commonService.store_details?.country == this.order_details.shipping_address?.country) {
              this.ghanaPostDestinations = ghanaDomesDestinations;
            }
          }
          if (this.order_details.billing_address) this.onGetAddrDetails(this.order_details.billing_address);
          // order status
          this.order_details.existing_status = this.order_details.order_status;
          if (this.order_details.existing_status == 'placed') this.order_details.order_status = 'confirmed';
          if (this.order_details.existing_status == 'confirmed') {
            if (this.order_details.item_groups.length) this.order_details.order_status = 'delivered';
            else this.order_details.order_status = 'dispatched';
          }
          if (this.order_details.existing_status == 'dispatched') this.order_details.order_status = 'delivered';
          if (this.order_details.cp_status) {
            if (this.order_details.cp_orders.findIndex(el => el.status == 'active') != -1) this.order_details.cp_exists = true;
          }
          // vendor orders
          if (this.order_details.vendor_list?.length) {
            if (this.params.type == 'live') {
              this.order_details.vendor_list = this.order_details.vendor_list.filter(el => el.order_status != 'delivered' && el.order_status != 'cancelled');
            }
            else if (this.params.type == 'delivered' || this.params.type == 'cancelled') {
              this.order_details.vendor_list = this.order_details.vendor_list.filter(el => el.order_status == this.params.type);
            }
            if (this.commonService.store_details.login_type == 'vendor') {
              this.order_details.vendor_list = this.order_details.vendor_list.filter(obj => obj.vendor_id == this.commonService.vendor_details?._id);
            }
            if (!this.order_details.vendor_list?.length) this.commonService.goBack();
            else {
              this.order_details.vendor_list.forEach(element => {
                if (!element.refund_amount) element.refund_amount = 0;
                if (this.params.type == 'cancelled' && this.order_details.payment_details?.name == 'COD') element.refund_amount = 0;
                if (element.cp_status) {
                  if (element.cp_orders.findIndex(el => el.status == 'active') != -1) element.cp_exists = true;
                }
                element.existing_status = element.order_status;
                if (element.existing_status == 'placed') element.order_status = 'confirmed';
                if (element.existing_status == 'confirmed') element.order_status = 'dispatched';
                if (element.existing_status == 'dispatched') element.order_status = 'delivered';
                if (this.commonService.store_details.login_type == 'vendor') {
                  element.vendor_name = this.commonService.vendor_details.company_details.brand;
                  element.vendor_cp = this.commonService.vendor_details.contact_person;
                }
                else if (this.commonService.store_details.login_type == 'branch') {
                  element.vendor_name = this.commonService.vendor_details.name;
                  element.vendor_cp = this.commonService.vendor_details.contact_person;
                }
                else {
                  element.vendor_name = "NA"; element.vendor_cp = "NA";
                  if (this.commonService.ys_features.indexOf("branch_stock") != -1) {
                    let vendorIndex = this.commonService.store_branch_list.findIndex(obj => obj._id == element.vendor_id);
                    if (vendorIndex != -1) {
                      element.vendor_name = this.commonService.store_branch_list[vendorIndex].name;
                      element.vendor_cp = this.commonService.store_branch_list[vendorIndex].contact_person;
                    }
                  }
                  else {
                    let vendorIndex = this.commonService.vendor_list.findIndex(obj => obj._id == element.vendor_id);
                    if (vendorIndex != -1) {
                      element.vendor_name = this.commonService.vendor_list[vendorIndex].company_details.brand;
                      element.vendor_cp = this.commonService.vendor_list[vendorIndex].contact_person;
                    }
                  }
                  if (this.order_details.item_list.findIndex(el => el.vendor_id == element.vendor_id && el.item_status == 'c_confirmed') != -1) {
                    element.cancelExists = true;
                  }
                }
              });
            }
          }
          // partial fulfillment
          else if (this.order_details.order_type == 'delivery' && this.commonService.ys_features.indexOf('partial_fulfillment') != -1) {
            let itemIndexList = [];
            this.order_details.item_groups.forEach(obj => {
              itemIndexList = itemIndexList.concat(obj.items);
              obj.item_list = [];
              obj.items.forEach(index => {
                obj.item_list.push(this.order_details.item_list[index]);
              });
            });
            // find items not in group
            this.order_details.item_list.forEach((elem, index) => {
              if (itemIndexList.indexOf(index) == -1) {
                elem.prod_index = index;
                this.remaining_items.push(elem);
              }
            });
            if (this.commonService.store_details._id == environment.config_data.uru_id) {
              this.processItemListExcludeTax(this.remaining_items).then((respData) => {
                this.itemList = respData;
              });
            }
            else this.itemList = this.remaining_items;
          }
          // store logo
          this.storeLogo = environment.img_baseurl + 'uploads/' + this.commonService.store_details?._id + '/logo.png?v=' + this.params.order_id;
          if (environment.production) {
            this.getBase64FromImage(this.storeLogo)
              .then(result => this.storeLogo = result)
              .catch(err => console.error(err));
          }
          else this.storeLogo = environment.temp_logo;
        }
        else console.log("response", result);
        setTimeout(() => { this.pageLoader = false; }, 500);
      });
    });
  }

  processItemListExcludeTax(itemList) {
    let countryInr = this.order_details.currency_type.country_inr_value;
    return new Promise((resolve, reject) => {
      let newItemList: any = [];
      for (let item of itemList) {
        let itemData: any = {};
        for (let key in item) {
          if (item.hasOwnProperty(key)) itemData[key] = item[key];
        }
        itemData.final_price = Math.round(this.findBaseAmount(item.final_price, item.tax_details) / countryInr);
        itemData.addon_price = Math.round(this.findBaseAmount(item.addon_price, item.tax_details) / countryInr);
        newItemList.push(itemData);
      }
      resolve(newItemList);
    });
  }

  onGetAddrDetails(address) {
    address.address_fields = [];
    let index = this.country_list.findIndex(object => object.name == address.country);
    if (index != -1) {
      this.country_list[index].address_fields.forEach(element => {
        if (address[element.keyword]) address.address_fields.push({ label: element.label, value: address[element.keyword], keyword: element.keyword });
      });
    }
  }

  // courier partner
  createCpOrder(formData) {
    formData.submit = true; delete formData.errorMsg;
    formData.order_id = this.order_details._id;
    if (formData.pickup_date && formData.pickup_time) {
      formData.pick_date = this.datepipe.transform(new Date(formData.pickup_date), "yyyy-MM-dd");
      formData.pick_date_time = this.datepipe.transform(new Date(formData.pick_date + ' ' + formData.pickup_time), "yyyy-MM-dd'T'HH:mm:sszzzz");
    }
    formData.base_url = this.commonService.store_details.base_url;
    if (formData.selected_cp == 'Shippo' && formData.selected_rate) {
      formData.shippo_price = formData.selected_rate.amount_local;
    }
    this.api.CREATE_CP_ORDER(formData).subscribe(result => {
      formData.submit = false;
      if (result.status) {
        if (formData.selected_cp == 'Shippo') {
          if (result.rates) {
            formData.ratesList = result.rates.sort((a, b) => 0 - (a.amount_local > b.amount_local ? -1 : 1));
            formData.rate_id = formData.ratesList[0].object_id;
          }
          else {
            document.getElementById('closeModal').click();
            this.ngOnInit();
          }
        }
        else {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
      }
      else {
        formData.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  getCpOrderDetails(formData, modalName) {
    this.popupLoader = true;
    this.modalService.open(modalName, { size: 'lg', windowClass: 'scroll-modal-xl', scrollable: true });
    this.api.CP_ORDER_DETAILS(formData.type, formData.wbn).subscribe(result => {
      if (result.status) {
        this.popupLoader = false;
        this.slip_details = result.data.packages[0];
        this.slip_details.order_number = formData.order_number;
        if (formData.invoice_number) this.slip_details.invoice_number = formData.invoice_number;
        if (!this.slip_details.snm) this.slip_details.snm = this.commonService.store_details?.company_details?.name;
        if (!this.slip_details.sadd) this.slip_details.sadd = this.commonService.store_details?.company_details?.address;
        if (!this.slip_details.radd) this.slip_details.radd = this.commonService.store_details?.company_details?.address;
      }
      else console.log("response", result);
    });
  }
  updateCpOrder() {
    this.courierForm.submit = true;
    this.courierForm.order_id = this.order_details._id;
    this.api.UPDATE_CP_ORDER(this.courierForm).subscribe(result => {
      this.courierForm.submit = false;
      if (result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.courierForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  cancelCpOrder() {
    this.courierForm.submit = true;
    this.courierForm.order_id = this.order_details._id;
    this.api.CANCEL_CP_ORDER(this.courierForm).subscribe(result => {
      this.courierForm.submit = false;
      if (result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.courierForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  getPackingDetails(vendorId, orderData, modalName) {
    let countryInr = this.order_details.currency_type.country_inr_value;
    this.slip_details = {
      order_number: orderData.order_number, item_list: [], addrList: [], invoice_number: orderData.invoice_number,
      currency_code: this.order_details.currency_type.country_code, payment_success: orderData.payment_success
    };
    this.slip_details.final_price = (orderData.final_price / countryInr).toFixed(2);
    this.slip_details.seller_info = {
      name: this.commonService.store_details?.company_details?.name,
      address: this.commonService.store_details?.company_details?.address
    };
    // shipping address
    let shipAddr = orderData.shipping_address;
    this.slip_details.shipping_address = shipAddr;
    if (shipAddr.city) this.slip_details.addrList.push(shipAddr.city.trim());
    if (shipAddr.state) this.slip_details.addrList.push(shipAddr.state.trim());
    this.slip_details.addrList.push(shipAddr.country);
    // item list
    let itemList = orderData.item_list.filter(obj => obj.item_status != 'c_confirmed');
    if (vendorId) {
      itemList = orderData.item_list.filter(obj => obj.vendor_id == vendorId && obj.item_status != 'c_confirmed');
      let vendorOrderDetails = orderData.vendor_list.filter(obj => obj.vendor_id == vendorId)[0];
      this.slip_details.barcode = this.textToBase64Barcode(vendorOrderDetails.shipping_method?.tracking_number);
      this.slip_details.order_number = vendorOrderDetails.order_number;
      this.slip_details.invoice_number = vendorOrderDetails.invoice_number;
      this.slip_details.final_price = ((vendorOrderDetails.final_price - vendorOrderDetails.refund_amount) / countryInr).toFixed(2);
      if (orderData.payment_details?.name == 'COD') {
        if (!vendorOrderDetails.payment_success) { vendorOrderDetails.payment_success = false; }
        this.slip_details.payment_success = vendorOrderDetails.payment_success;
      }
      // vendor details
      let vIndex = this.commonService.vendor_list.findIndex(v => v._id == vendorId);
      if (vIndex != -1) {
        this.slip_details.seller_info.name = this.commonService.vendor_list[vIndex].company_details.brand;
        this.slip_details.seller_info.address = this.commonService.vendor_list[vIndex].pickup_address.address;
      }
    }
    else {
      this.slip_details.barcode = this.textToBase64Barcode(orderData.shipping_method?.tracking_number);
    }
    itemList.filter(obj => obj.item_status != 'c_confirmed').forEach(el => {
      let prodName = el.name + ' - ' + el.sku;
      let vdList = [];
      el.variant_types.forEach(vd => { vdList.push(vd.name + ': ' + vd.value); });
      if (vdList.length) prodName += ' (' + vdList.join(', ') + ')';
      this.slip_details.item_list.push(prodName);
    });
    this.modalService.open(modalName, { size: 'lg', windowClass: 'scroll-modal-xl', scrollable: true });
  }

  // Update order status
  updateOrderStatus() {
    this.btnLoader = true;
    if (this.commonService.store_details.login_type == 'vendor') {
      let sendData = {
        _id: this.order_details._id,
        vendor_id: this.vendorInfo.vendor_id,
        shipping_method: this.vendorInfo.shipping_method,
        order_status: this.vendorInfo.order_status
      }
      this.updateVendorOrderStatus(sendData);
    }
    else {
      let sendData: any = {
        _id: this.order_details._id,
        shipping_method: this.order_details.shipping_method,
        order_status: this.order_details.order_status
      };
      if (this.vendorInfo?.vendor_id) {
        sendData.vendor_id = this.vendorInfo.vendor_id;
        sendData.shipping_method = this.vendorInfo.shipping_method;
        sendData.order_status = this.vendorInfo.order_status;
      }
      this.api.UPDATE_ORDER_STATUS(sendData).subscribe(result => {
        this.btnLoader = false;
        if (result.status) {
          if (result.order_completed) {
            if (this.commonService.ys_features.indexOf('product_reviews') != -1) {
              this.btnLoader = true; let customerEmail = "";
              if (this.order_details.order_by == 'guest') customerEmail = this.order_details.guest_email;
              else customerEmail = this.order_details.customerDetails[0].email;
              this.api.RESEND_ORDER_MAIL({ _id: this.order_details._id, type: 'review', email: customerEmail }).subscribe(result => {
                this.btnLoader = false;
                if (result.status) {
                  document.getElementById('closeModal').click();
                  this.router.navigate(["/orders/product/delivered/" + this.params.customer_id]);
                }
                else {
                  this.errorMsg = result.message;
                  console.log("response", result);
                }
              });
            }
            else {
              document.getElementById('closeModal').click();
              this.router.navigate(["/orders/product/delivered/" + this.params.customer_id]);
            }
          }
          else {
            document.getElementById('closeModal').click();
            this.commonService.goBack();
          }
        }
        else {
          this.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }
  // for vendor login
  updateVendorOrderStatus(formData) {
    this.api.UPDATE_ORDER_STATUS(formData).subscribe(result => {
      this.btnLoader = false;
      if (result.status) {
        if (formData.order_status == 'delivered') {
          document.getElementById('closeModal').click();
          this.router.navigate(["/orders/product/delivered/" + this.params.customer_id]);
        }
        else {
          document.getElementById('closeModal').click();
          this.commonService.goBack();
        }
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // mark as paid
  onMarkPaid() {
    this.editForm.submit = true;
    let sendData: any = { _id: this.order_details._id, payment_success: true };
    if (this.editForm.payment_success) sendData.payment_success = false;
    if (this.editForm.vendor_id) sendData.vendor_id = this.editForm.vendor_id;
    this.api.UPDATE_ORDER_DETAILS(sendData).subscribe(result => {
      this.editForm.submit = false;
      if (result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // cancel order
  cancelOrder(x, modalName, formType) {
    this.vendorInfo = x;
    this.vendorInfo.form_type = formType;
    this.vendorInfo.request_type = 'approve';
    delete this.vendorInfo.submit;
    delete this.vendorInfo.errorMsg;
    delete this.vendorInfo.cancel_reason;
    this.vendorInfo.new_shipping_cost = x.shipping_cost;
    this.vendorInfo.item_list = this.itemList;
    if (x.vendor_id) this.vendorInfo.item_list = this.itemList.filter(obj => obj.vendor_id == x.vendor_id);
    this.vendorInfo.item_list.forEach(obj => { delete obj.item_checked; });
    this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
  }
  onCancelOrder(modalName) {
    delete this.vendorInfo.errorMsg;
    if (this.vendorInfo.item_list.findIndex(obj => obj.item_checked) != -1) {
      if (this.vendorInfo.request_type == 'approve') this.modalService.open(modalName, { centered: true });
      else this.onConfirmCancelOrder();
    }
    else this.vendorInfo.errorMsg = "Please select minimum one item to proceed";
  }
  onConfirmCancelOrder() {
    let formData: any = {
      _id: this.order_details._id, selected_items: [], type: this.vendorInfo.request_type,
      form_type: this.vendorInfo.form_type, shipping_cost: 0
    };
    if (this.vendorInfo.vendor_id) formData.vendor_id = this.vendorInfo.vendor_id;
    this.vendorInfo.item_list.forEach(obj => {
      if (obj.item_checked) formData.selected_items.push(obj._id);
    });
    if (this.vendorInfo.cancel_reason) formData.cancel_reason = this.vendorInfo.cancel_reason;
    if (this.vendorInfo.cancel_desc) formData.cancel_desc = this.vendorInfo.cancel_desc;
    if (formData.selected_items.length) {
      this.vendorInfo.submit = true;
      if (this.vendorInfo.new_shipping_cost) formData.shipping_cost = this.vendorInfo.new_shipping_cost;
      if (this.vendorInfo.form_type == 'cancel') {
        this.api.CANCEL_ORDER(formData).subscribe(result => {
          this.vendorInfo.submit = false;
          if (result.status) {
            if (document.getElementById('closeConfirmModal')) document.getElementById('closeConfirmModal').click();
            document.getElementById('closeModal').click();
            this.ngOnInit();
          }
          else {
            this.vendorInfo.errorMsg = result.message;
            console.log("response", result);
          }
        });
      }
      else if (this.vendorInfo.form_type == 'undo') {
        this.api.UNDO_CANCEL_ORDER(formData).subscribe(result => {
          this.vendorInfo.submit = false;
          if (result.status) {
            if (document.getElementById('closeConfirmModal')) document.getElementById('closeConfirmModal').click();
            document.getElementById('closeModal').click();
            this.ngOnInit();
          }
          else {
            this.vendorInfo.errorMsg = result.message;
            console.log("response", result);
          }
        });
      }
      else console.log("Invalid form");
    }
    else this.vendorInfo.errorMsg = "Please select minimum one item to proceed";
  }

  onEdit(type, modalName) {
    this.popupLoader = true;
    if (type == 'address') this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
    else this.modalService.open(modalName, { windowClass: 'scroll-modal-xl', scrollable: true });
    this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
      if (result.status) {
        this.popupLoader = false;
        if (type == 'address') {
          this.addressForm = result.data.shipping_address;
          if (this.addressType == 'billing') this.addressForm = result.data.billing_address;
          if (this.addressType != 'pickup') {
            this.onCountryChange(this.addressForm.country);
            this.address_fields.forEach(element => {
              element.value = this.addressForm[element.keyword];
            });
          }
        }
        else this.editForm = result.data;
      }
      else console.log("response", result);
    });
  }
  onEditCustomization(customization, modalName) {
    this.updateErrorMsg = null; this.popupLoader = true;
    this.customizationForm = customization;
    this.existing_custom_list = customization.custom_list;
    this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
    this.extrasApi.ADDON_DETAILS(this.order_details.item_list[this.itemIndex].selected_addon._id, '').subscribe(result => {
      if (result.status) {
        this.customIndex = 0;
        this.custom_list = result.data.custom_list;
        this.selected_custom_list = [];
        this.onSelectOption(this.existing_custom_list[this.customIndex].value);
        this.popupLoader = false;
      }
      else {
        this.updateErrorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onEditMeasurement(modalName) {
    this.updateErrorMsg = null;
    this.mmIndex = 0; this.popupLoader = true;
    this.customizationForm = {};
    this.modalService.open(modalName, { windowClass: 'scroll-modal-xl', scrollable: true });
    this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
      if (result.status) {
        this.customizationForm = result.data.item_list[this.itemIndex].customized_model;
        this.popupLoader = false;
      }
      else {
        this.updateErrorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onEditNotes(modalName) {
    this.updateErrorMsg = null;
    this.customizationForm = {};
    this.popupLoader = true;
    this.modalService.open(modalName, { windowClass: 'scroll-modal-xl', scrollable: true });
    this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
      if (result.status) {
        this.customizationForm = result.data.item_list[this.itemIndex].customized_model;
        this.popupLoader = false;
      }
      else {
        this.updateErrorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onEditVendorShipping(vendorId, modalName) {
    this.api.ORDER_DETAILS(this.params.order_id).subscribe(result => {
      if (result.status) {
        let orderData = result.data;
        let vIndex = orderData.vendor_list.findIndex(obj => obj.vendor_id == vendorId);
        if (vIndex != -1) {
          this.editForm = orderData.vendor_list[vIndex];
          this.editForm.formType = 'vendor';
          this.modalService.open(modalName);
        }
        else console.log("Invalid vendor");
      }
      else console.log("response", result);
    });
  }

  onUpdateShippingDetails() {
    let sendData: any = { _id: this.order_details._id, shipping_method: this.editForm.shipping_method };
    if (this.editForm.formType == 'vendor') sendData.vendor_id = this.editForm.vendor_id;
    this.onUpdate(sendData);
  }
  onUpdateAddress() {
    if (this.addressType != 'pickup') {
      this.address_fields.forEach(element => {
        if (element.value) this.addressForm[element.keyword] = element.value;
      });
    }
    let formData: any = { _id: this.order_details._id, shipping_address: this.addressForm };
    if (this.addressType == 'billing') formData = { _id: this.order_details._id, billing_address: this.addressForm };
    this.onUpdate(formData);
  }
  onUpdateCustomization() {
    let reqInput = this.validateForm();
    if (reqInput === undefined) {
      this.customizationForm.custom_list = this.selected_custom_list;
      let fieldName = "item_list." + this.itemIndex + ".customized_model";
      let formData: any = { _id: this.order_details._id, [fieldName]: this.customizationForm };
      this.onUpdate(formData);
    }
    else document.getElementById(reqInput).focus();
  }
  onUpdateMeasurement() {
    let reqInput = this.validateForm();
    if (reqInput === undefined) {
      let fieldName = "item_list." + this.itemIndex + ".customized_model";
      let formData: any = { _id: this.order_details._id, [fieldName]: this.customizationForm };
      this.onUpdate(formData);
    }
    else document.getElementById(reqInput).focus();
  }
  onUpdateNotes() {
    let reqInput = this.validateForm();
    if (reqInput === undefined) {
      let fieldName = "item_list." + this.itemIndex + ".customized_model";
      let formData: any = { _id: this.order_details._id, [fieldName]: this.customizationForm };
      this.onUpdate(formData);
    }
    else document.getElementById(reqInput).focus();
  }
  // update
  onUpdate(x) {
    this.api.UPDATE_ORDER_DETAILS(x).subscribe(result => {
      if (result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.addressForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onViewCustomization(x, orderNum, modalName) {
    this.commonService.custom_model = x.customized_model;
    this.commonService.custom_model.order_number = orderNum;
    this.commonService.custom_model.product_sku = x.sku;
    let productInfo = x.sku;
    if (x.variant_status) {
      productInfo += ' (';
      x.variant_types.forEach(el => { productInfo += el.name + ': ' + el.value + ', '; });
      productInfo = productInfo.substring(0, productInfo.length - 2);
      productInfo += ')';
    }
    this.commonService.custom_model.product_info = productInfo;
    // customization
    if (this.commonService.custom_model.custom_list?.length) {
      for (let custom of this.commonService.custom_model.custom_list) {
        for (let cValue of custom.value) {
          cValue.temp_image = this.tempImage;
          if (cValue.image) {
            if (environment.production) {
              this.getBase64FromImage(this.imgBaseUrl + cValue.image)
                .then(result => cValue.temp_image = result)
                .catch(err => console.error(err));
            }
          }
        }
      }
    }
    // measurement
    if (this.commonService.custom_model.mm_sets?.length) {
      for (let mmSet of this.commonService.custom_model.mm_sets) {
        mmSet.temp_image = this.tempImage;
        if (mmSet.image) {
          if (environment.production) {
            this.getBase64FromImage(this.imgBaseUrl + mmSet.image)
              .then(result => mmSet.temp_image = result)
              .catch(err => console.error(err));
          }
        }
      }
    }
    this.modalService.open(modalName, { size: 'lg', scrollable: true });
  }

  findBaseAmount(amount, taxDetails) {
    if (taxDetails) {
      if (this.invoice_details.billing_address.country == taxDetails.home_country && this.invoice_details.billing_address.state == taxDetails.home_state) {
        let totalPercentage = 100 + parseFloat(taxDetails.sgst) + parseFloat(taxDetails.cgst);
        let onePercentAmount = amount / totalPercentage;
        return (onePercentAmount * 100);
      }
      else {
        let totalPercentage = 100 + parseFloat(taxDetails.igst);
        let onePercentAmount = amount / totalPercentage;
        return (onePercentAmount * 100);
      }
    }
    else return amount;
  }

  onPlaceOrder(x) {
    this.api.PLACE_INACTIVE_ORDER(x).subscribe(result => {
      if (result.status) {
        document.getElementById('closeModal').click();
        this.commonService.goBack();
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onResendMail(modalName) {
    this.errorMsg = null; this.btnLoader = false;
    // let customStatus = false;
    // let index = this.order_details.item_list.findIndex(object => object.customization_status);
    // if(index!=-1) customStatus = true;
    let customerEmail = "";
    if (this.order_details.order_by == 'guest') customerEmail = this.order_details.guest_email;
    else customerEmail = this.order_details.customerDetails[0].email;
    // this.mailForm = { email: customerEmail, custom_status: customStatus };
    this.mailForm = { email: customerEmail };
    this.modalService.open(modalName, { windowClass: 'scroll-modal-xl', scrollable: true });
  }
  onResendVendorMail(modalName) {
    this.errorMsg = null; this.btnLoader = false;
    // let customStatus = false;
    // let index = this.vendorInfo.item_list.findIndex(object => object.customization_status);
    // if(index!=-1) customStatus = true;
    let customerEmail = "";
    if (this.order_details.order_by == 'guest') customerEmail = this.order_details.guest_email;
    else customerEmail = this.order_details.customerDetails[0].email;
    // this.mailForm = { email: customerEmail, custom_status: customStatus };
    this.mailForm = { email: customerEmail, vendor_id: this.vendorInfo.vendor_id };
    this.modalService.open(modalName);
  }

  sendMail() {
    this.btnLoader = true;
    this.mailForm._id = this.order_details._id;
    this.api.RESEND_ORDER_MAIL(this.mailForm).subscribe(result => {
      this.btnLoader = false;
      if (result.status) {
        document.getElementById('closeModal').click();
      }
      else {
        this.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  openUpdateItemGroupModal(modalName) {
    if (!this.order_details.shipping_method.delivery_method) {
      if (!this.groupForm.carrier_name) this.groupForm.carrier_name = this.order_details.shipping_method.name;
      if (!this.groupForm.tracking_link) this.groupForm.tracking_link = this.order_details.shipping_method.tracking_link;
    }
    this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
  }
  onCreateNewGroup() {
    let selectedItems = [];
    this.remaining_items.forEach(obj => {
      if (obj.checked) selectedItems.push(obj.prod_index);
    });
    if (selectedItems.length) {
      this.groupForm.submit = true;
      this.groupForm.items = selectedItems;
      this.groupForm.order_id = this.order_details._id;
      this.api.CREATE_ITEM_GROUP(this.groupForm).subscribe(result => {
        if (result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.groupForm.submit = false;
          this.groupForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else this.groupForm.errorMsg = "Please select any item from list";
  }
  onUpdateNewGroup() {
    this.groupForm.submit = true;
    this.groupForm.order_id = this.order_details._id;
    this.api.UPDATE_ITEM_GROUP(this.groupForm).subscribe(result => {
      if (result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.groupForm.submit = false;
        this.groupForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }
  onRemoveNewGroup() {
    this.groupForm.submit = true;
    this.groupForm.order_id = this.order_details._id;
    this.api.DELETE_ITEM_GROUP(this.groupForm).subscribe(result => {
      if (result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.groupForm.submit = false;
        this.groupForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onUpdateCustomerNote() {
    this.editForm.submit = true;
    this.customerApi.UPDATE_CUSTOMER(this.editForm).subscribe(result => {
      this.editForm.submit = false;
      if (result.status) {
        document.getElementById("closeModal").click();
        this.ngOnInit();
      }
      else {
        this.editForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  // add-on functions
  onMmNext() {
    let reqInput = this.validateForm();
    if (reqInput === undefined) this.mmIndex = this.mmIndex + 1;
    else document.getElementById(reqInput).focus();
  }

  onCustomNext() {
    let reqInput = this.validateForm();
    if (reqInput === undefined) {
      this.customIndex = this.customIndex + 1;
      if (this.existing_custom_list[this.customIndex]?.value) {
        let initialCustomOption = this.existing_custom_list[this.customIndex].value;
        if (this.selected_custom_list[this.customIndex]) {
          initialCustomOption = this.selected_custom_list[this.customIndex].value;
        }
        this.onSelectOption(initialCustomOption);
      }
    }
    else document.getElementById(reqInput).focus();
  }

  onSelectOption(x) {
    let selectedCustom = this.custom_list[this.customIndex];
    this.selected_custom_list[this.customIndex] = { name: selectedCustom.name, value: x };
  }

  onSelectCheckbox(x) {
    if (!this.selected_custom_list[this.customIndex]) {
      this.selected_custom_list[this.customIndex] = { name: this.custom_list[this.customIndex].name, value: [] };
    }
    let index = this.selected_custom_list[this.customIndex].value.findIndex(obj => obj.name == x.name);
    if (index != -1) this.selected_custom_list[this.customIndex].value.splice(index, 1);
    else this.selected_custom_list[this.customIndex].value.push(x);
  }

  checkboxStatus(x) {
    if (this.selected_custom_list[this.customIndex]?.value) {
      if (this.selected_custom_list[this.customIndex].value.findIndex(obj => obj.name == x.name) != -1) return true;
    }
  }

  validateForm() {
    let form: any = document.getElementById('addon-form');
    for (let i = 0; i < form.elements.length; i++) {
      if (form.elements[i].value === '' && form.elements[i].hasAttribute('required')) return form.elements[i].id;
    }
  }

  onCountryChange(x) {
    this.state_list = [];
    let index = this.country_list.findIndex(object => object.name == x);
    if (index != -1) {
      this.country_details = this.country_list[index];
      this.state_list = this.country_details.states;
      this.addressForm.dial_code = this.country_details.dial_code;
      this.address_fields = this.country_details.address_fields;
    }
  }

  onChangeUnit() {
    if (this.customizationForm.mm_unit == 'cms') {
      // convert inch -> cm
      this.customizationForm.mm_sets.forEach(set => {
        set.list.forEach(element => {
          if (element.value) element.value = (element.value * 2.54).toFixed(1);
        });
      });
    }
    else {
      // convert cm -> inch
      this.customizationForm.mm_sets.forEach(set => {
        set.list.forEach(element => {
          if (element.value) element.value = (element.value * 0.393701).toFixed(1);
        });
      });
    }
  }

  transformHtml(string) {
    return string.replace(new RegExp('\n', 'g'), "<br />");
  }

  timePicker(obj, variable) {
    const amazingTimePicker = this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      obj[variable] = this.commonService.timeConversion(time);
    });
  }

  generatePackingSlip() {
    let delhiveryLogo = "data:image/png;base64,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";
    let pdfData: any = {
      content: [
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                { fit: [70, 40], margin: [0, 5, 0, 5], alignment: 'center', image: this.storeLogo },
                { height: 40, width: 100, margin: [0, 5, 0, 5], alignment: 'center', image: delhiveryLogo }
              ]
            ]
          }, style: 'head'
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{ image: this.slip_details.barcode, fit: [150, 50], alignment: 'center', border: [true, false, true, false], margin: [0, 5, 0, 0] }]
            ],
          }, style: 'head'
        },
        {
          table: {
            widths: ['*', '*'],
            body: [
              [
                { text: this.slip_details.pin, border: [true, false, false, true], margin: [5, 1, 0, 1], style: 'subhead', fontSize: 10 },
                { text: 'DWL/WHT', bold: true, alignment: 'right', border: [false, false, true, true], fontSize: 10, margin: [5, 1, 0, 1], style: 'subhead' }
              ]
            ],
          }, style: 'head'
        },
        {
          table: {
            widths: [180, '*'],
            body: [
              [
                {
                  stack: [
                    { text: 'Shipping Address:', bold: true, style: 'head', margin: [0, 1, 0, 1] },
                    { text: this.slip_details.name, style: 'subhead', margin: [0, 0, 0, 1], bold: true, fontSize: 10 },
                    { text: this.slip_details.address, style: 'subhead', margin: [0, 0, 0, 1], fontSize: 10 },
                    { text: this.slip_details.destination, style: 'subhead', margin: [0, 0, 0, 1], fontSize: 10 },
                    { text: 'PIN: ' + this.slip_details.pin, style: 'subhead', margin: [0, 0, 0, 1], bold: true, fontSize: 10 }
                  ],
                  margin: [1, 1, 0, 0], border: [true, false, true, true], style: 'subhead'
                },
                {
                  stack: [
                    { text: this.slip_details.pt, style: 'subhead', margin: [0, 1, 0, 1], bold: true, fontSize: 10 },
                    { text: this.currency.transform(this.slip_details.rs, this.commonService.store_currency?.country_code), style: 'subhead', margin: [0, 0, 0, 1], bold: true, fontSize: 10 },
                    { text: (this.slip_details?.mot == 'E') ? 'Express' : 'Surface', style: 'subhead', margin: [0, 0, 0, 1], bold: true, fontSize: 10 }
                  ],
                  margin: [0, 15, 0, 15], border: [true, false, true, true], alignment: 'center', style: 'subhead'
                }
              ]
            ]
          }, style: 'head'
        },
        {
          table: {
            widths: [130, '*'],
            body: [
              [
                {
                  stack: [
                    { text: 'Seller: ' + this.slip_details.snm, style: 'head', margin: [0, 0, 0, 1], fontSize: 10 },
                    { text: 'Address: ' + this.slip_details.sadd, style: 'subhead', margin: [0, 0, 0, 1], fontSize: 10 }
                  ],
                  margin: [1, 1, 0, 0], border: [true, false, false, false], style: 'subhead'
                },
                {
                  stack: [], margin: [0, 20, 0, 0], border: [true, false, true, false], alignment: 'center', style: 'subhead'
                }
              ]
            ],
          }, border: [false, false, false, false], style: 'head'
        },
        {
          table: {
            widths: [130, '*', '*'],
            headerRows: 2,
            body: [
              [
                { text: 'Product', border: [true, true, true, true], style: 'subhead', fontSize: 10, margin: [5, 2, 0, 2], bold: true },
                { text: 'Price', border: [false, true, true, false], style: 'subhead', fontSize: 10, margin: [5, 2, 0, 2], bold: true },
                { text: 'Total', border: [true, true, true, false], style: 'subhead', fontSize: 10, margin: [5, 2, 0, 2], bold: true }
              ],
              [
                { text: this.slip_details.prd, border: [true, true, true, true], fontSize: 10, style: 'subhead', margin: [5, 15, 0, 15] },
                { text: this.currency.transform(this.slip_details.rs, this.commonService.store_currency?.country_code), border: [false, true, true, false], style: 'subhead', fontSize: 10, margin: [5, 15, 0, 15] },
                { text: this.currency.transform(this.slip_details.rs, this.commonService.store_currency?.country_code), border: [true, true, true, false], style: 'subhead', fontSize: 10, margin: [5, 15, 0, 15] }
              ],
              [
                { text: 'Total', border: [true, true, true, true], style: 'subhead', margin: [5, 5, 0, 5], bold: true, fontSize: 10 },
                { text: this.currency.transform(this.slip_details.rs, this.commonService.store_currency?.country_code), border: [false, true, true, true], style: 'subhead', margin: [5, 5, 0, 5], bold: true, fontSize: 10 },
                { text: this.currency.transform(this.slip_details.rs, this.commonService.store_currency?.country_code), border: [true, true, true, true], style: 'subhead', margin: [5, 5, 0, 5], bold: true, fontSize: 10 }
              ]
            ]
          }, style: 'head'
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{ image: this.slip_details.oid_barcode, fit: [150, 50], alignment: 'center', border: [true, false, true, true], margin: [0, 5, 0, 5] }],
            ],
          }, style: 'head'
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{ text: 'Return Address: ' + this.slip_details.radd, width: 200, border: [true, false, true, true], fontSize: 10, margin: [5, 2, 0, 2], style: 'subhead' }],
            ],
          }, style: 'head'
        },
      ],
      styles: {
        subhead: { fontSize: 11, characterSpacing: 0.5 },
        head: { margin: [0, 0, 230, 0], fontSize: 10, characterSpacing: 0.5 }
      }
    };
    let fileName = this.slip_details.order_number;
    if (this.slip_details.invoice_number) fileName = this.slip_details.invoice_number;
    pdfMake.createPdf(pdfData).download(fileName + '-packing-slip.pdf');
  }

  generateCustomPackingSlip() {
    let payInfo: any = [
      { text: this.slip_details.payment_success ? 'Pre-Paid' : 'COD', bold: true, alignment: 'center', margin: [0, 5, 0, 0] }
    ];
    if (!this.slip_details.payment_success) {
      payInfo.push({ text: this.currency.transform(this.slip_details?.final_price, this.slip_details.currency_code), bold: true, margin: [0, 3, 0, 5] });
    }
    let pdfData: any = {
      content: [
        {
          table: {
            widths: ['*'],
            body: [
              [{ fit: [70, 40], margin: [10, 10, 10, 10], alignment: 'center', image: this.storeLogo }],
            ],
          }, style: 'head'
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{ text: [{ text: 'Order No: ', bold: true }, this.slip_details?.order_number], border: [true, false, true, true], margin: [5, 10, 0, 10] }]
            ],
          }, style: 'head'
        },
        {
          table: {
            widths: ['*', 80],
            body: [
              [{
                stack: [
                  { text: 'Shipping Address:', bold: true, margin: [0, 0, 0, 5] },
                  { text: this.slip_details.shipping_address?.name, bold: true, margin: [0, 0, 0, 3] },
                  [{ text: [{ text: this.slip_details.shipping_address?.dial_code + ' ' + this.slip_details.shipping_address?.mobile }], margin: [0, 0, 0, 3] }],
                  { text: this.slip_details.shipping_address?.address, margin: [0, 0, 0, 3] },
                  { text: this.slip_details.addrList.join(', '), margin: [0, 0, 0, 3] },
                  { text: this.slip_details.shipping_address?.pincode, margin: [0, 0, 0, 3] }
                ],
                alignment: 'left', margin: [5, 10, 0, 10], border: [true, false, true, true]
              },
              {
                stack: payInfo,
                alignment: 'center', margin: [0, 30, 0, 0], border: [true, false, true, true]
              }]
            ]
          }, style: 'head'
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{
                stack: [
                  { text: 'Products:', bold: true, margin: [5, 5, 0, 5] },
                  { text: this.slip_details.item_list.join(', '), margin: [5, 0, 0, 5] }
                ],
                border: [true, false, true, true]
              }]
            ]
          }, style: 'head'
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{ height: 40, width: 100, margin: [5, 5, 0, 5], alignment: 'center', border: [true, false, true, true], image: this.slip_details.barcode }]
            ],
          }, style: 'head'
        },
        {
          table: {
            widths: ['*'],
            body: [
              [{
                stack: [
                  { text: this.slip_details.seller_info?.name, bold: true, alignment: 'center', margin: [0, 5, 0, 0] },
                  { text: this.slip_details.seller_info?.address, margin: [0, 3, 0, 5] }
                ],
                border: [true, false, true, true], alignment: 'center'
              }]
            ]
          }, style: 'head'
        }
      ],
      styles: {
        subhead: { fontSize: 11, characterSpacing: 0.5 },
        head: { margin: [0, 0, 230, 0], fontSize: 10, characterSpacing: 0.5 }
      }
    }
    let fileName = this.slip_details.order_number;
    if (this.slip_details.invoice_number) fileName = this.slip_details.invoice_number;
    pdfMake.createPdf(pdfData).download(fileName + '-packing-slip.pdf');
  }

  generateCustomizatioPdf() {
    let pdfContent: any = [{
      stack: [
        { text: 'Order Number: ' + this.commonService.custom_model?.order_number, bold: true, fontSize: 11, characterSpacing: 0.5 },
        { text: 'Product SKU: ' + this.commonService.custom_model?.product_info, bold: true, fontSize: 11, characterSpacing: 0.5, margin: [0, 10, 0, 0] }
      ]
    }];
    // customization
    if (this.commonService.custom_model?.custom_list?.length) {
      pdfContent.push({
        stack: [
          { text: 'Customization', decoration: 'underline', bold: true, fontSize: 11, characterSpacing: 0.5 }
        ], margin: [0, 20, 0, 10]
      });
      let customList = [];
      this.commonService.custom_model.custom_list.forEach((el: any) => {
        el.value.forEach((obj: any) => {
          obj.custom_name = el.name;
          customList.push(obj);
        });
      });
      for (let i = 0; i < customList.length / 3; i++) {
        let widthList: any = [];
        let bodyList: any = [];
        for (let j = 0; j < 3; j++) {
          let cIndex = (i * 3) + j;
          if (customList[cIndex]) {
            widthList.push('*');
            bodyList.push({
              stack: [
                { width: 70, height: 70, alignment: 'center', image: customList[cIndex].temp_image },
                { text: customList[cIndex].custom_name, fontSize: 11, margin: [0, 5, 0, 0], alignment: 'center' },
                { text: customList[cIndex].name, fontSize: 11, margin: [0, 5, 0, 0], alignment: 'center' }
              ], border: [false, false, false, false]
            });
          }
        }
        pdfContent.push({
          table: {
            widths: widthList,
            body: [bodyList]
          }, style: 'head', margin: [0, 10, 0, 0]
        });
      }
    }
    // measurement
    if (this.commonService.custom_model?.mm_sets.length) {
      pdfContent.push({
        stack: [
          { text: 'Measurements', decoration: 'underline', bold: true, fontSize: 11, characterSpacing: 0.5 }
        ], margin: [0, 20, 0, 10]
      });
      let mmSets = this.commonService.custom_model.mm_sets;
      for (let i = 0; i < mmSets.length / 2; i++) {
        let widthList: any = [];
        let bodyList: any = [];
        for (let j = 0; j < 2; j++) {
          let mIndex = (i * 2) + j;
          if (mmSets[mIndex]) {
            let itemsList = [];
            let mmData = mmSets[mIndex];
            for (let val of mmData.list) {
              itemsList.push({ text: [val.name + ': ', { text: val.value + ' ' + this.commonService.custom_model?.mm_unit, bold: true }], margin: [0, 5, 0, 10], style: 'head', alignment: 'center' });
            }
            widthList.push('*');
            bodyList.push([
              [{ text: mmData.name, alignment: 'center', fillColor: '#e1e1e1', margin: [0, 5, 0, 5] }],
              [
                {
                  stack: [
                    { width: 100, height: 100, alignment: 'center', image: mmSets[mIndex].temp_image, margin: [0, 10, 0, 5] },
                    itemsList
                  ]
                }
              ]
            ]);
          }
        }
        pdfContent.push({
          table: {
            widths: widthList,
            body: [bodyList]
          }, style: 'head', margin: [0, 10, 0, 0]
        });
      }
    }
    // notes
    if (this.commonService.custom_model?.notes_list?.length) {
      pdfContent.push({
        stack: [
          { text: 'Notes', decoration: 'underline', bold: true, fontSize: 11, characterSpacing: 0.5 },
        ], margin: [0, 20, 0, 10]
      })
      for (let i = 0; i < this.commonService.custom_model.notes_list.length / 2; i++) {
        let widthList: any = [];
        let bodyList: any = [];
        for (let j = 0; j < 2; j++) {
          let nIndex = (i * 2) + j;
          if (this.commonService.custom_model.notes_list[nIndex]) {
            widthList.push('*');
            bodyList.push([{
              stack: [
                { text: this.commonService.custom_model.notes_list[nIndex].name, fontSize: 11, margin: [10, 0, 10, 0] },
                { text: this.commonService.custom_model.notes_list[nIndex].value, fontSize: 11, margin: [10, 2, 10, 0] }
              ], margin: [0, 10, 0, 10]
            }])
          }
        }
        pdfContent.push({
          table: {
            widths: widthList,
            body: [bodyList]
          }, style: 'tableExample', margin: [0, 0, 0, 0]
        });
      }
    }
    let pdfData = {
      content: pdfContent,
      styles: { head: { fontSize: 11, characterSpacing: 0.5 } }
    }
    pdfMake.createPdf(pdfData).download(this.commonService.custom_model?.order_number + '-' + this.commonService.custom_model?.product_sku + '-customization.pdf');
  }

  async getBase64FromImage(imageUrl: any) {
    let res = await fetch(imageUrl);
    let blob = await res.blob();
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.addEventListener("load", function () {
        resolve(reader.result);
      }, false);
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }

  textToBase64Barcode(text) {
    var canvas = document.createElement("canvas");
    JsBarcode(canvas, text, { format: "CODE128" });
    return canvas.toDataURL("image/png");
  }

}