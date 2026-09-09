import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { OrderService } from '../../order.service';
import { environment } from 'src/environments/environment';
import { ExcelService } from '../../../../../services/excel.service';
import { CommonService } from '../../../../../services/common.service';
import { GridSearchPipe } from '../../../../../shared/pipes/grid-search.pipe';
import { OrderFilterPipe } from './order-filter.pipe';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
    selector: 'app-product-orders',
    templateUrl: './product-orders.component.html',
    styleUrls: ['./product-orders.component.scss'],
    animations: [SharedAnimations],
    providers: [AmazingTimePickerService],
    standalone: false
})

export class ProductOrdersComponent implements OnInit {

  pageLoader: boolean; search_bar: string;
  page = 1; pageSize = 10; exportLoader: boolean;
  params: any = {}; filterForm: any = {}; tempFilter: any = {};
  list: any = []; scrollPos: number = 0;
  orderTypes: any = []; selectedItem: any;
  pickupForm: any = {}; pickupOrders: any = [];
  orders_count: any; selectedList: any = []; allSelected: boolean;
  configData: any = environment.config_data;
  vendorList: any = [];

  constructor(
    private api: OrderService, private activeRoute: ActivatedRoute, private excelService: ExcelService, private datePipe: DatePipe,
    public commonService: CommonService, config: NgbModalConfig, public modalService: NgbModal, private atp: AmazingTimePickerService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
    pdfMake.vfs = (pdfFonts as any).pdfMake.vfs;
  }

  onOpenFilterModal(modalName) {
    this.tempFilter = {};
    for (let key in this.filterForm) {
      if (this.filterForm.hasOwnProperty(key)) this.tempFilter[key] = this.filterForm[key];
    }
    this.selectedItem = "OrderDate";
    if (this.vendorList?.length) this.selectedItem = "Vendor";
    else if (!this.vendorList?.length && this.params?.type == 'live') this.selectedItem = "Orders";
    this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
  }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.list = []; this.vendorList = [];
      if (this.commonService.vendor_list?.length) {
        this.vendorList = this.commonService.vendor_list.map(({ _id, company_details }) => ({
          _id, name: company_details.brand
        }));
      }
      else if (this.commonService.store_branch_list?.length) {
        this.vendorList = this.commonService.store_branch_list.map(({ _id, name }) => ({
          _id, name
        }));
      }
      this.orders_count = { all: 0, placed: 0, confirmed: 0, dispatched: 0 };
      this.params = params; this.page = 1; this.pageSize = 10;
      if (this.params.customer_id != 'all' && this.commonService.selected_customer?.name) {
        if (!this.commonService.desktop_device) {
          this.commonService.redirect = "";
          this.commonService.secondary_header = this.commonService.selected_customer?.name;
          if (this.params?.type == 'live') { this.commonService.secondary_header = this.commonService.secondary_header + " - Live Orders"; }
          else if (this.params?.type == 'delivered') { this.commonService.secondary_header = this.commonService.secondary_header + " - Completed Orders"; }
          else if (this.params?.type == 'cancelled') { this.commonService.secondary_header = this.commonService.secondary_header + " - Cancelled Orders"; }
        }
      }
      if (this.params.type == 'live') { this.orderTypes = ['placed', 'confirmed', 'dispatched']; }
      if (this.params.type == 'delivered') { this.orderTypes = ['delivered']; }
      if (this.params.type == 'cancelled') { this.orderTypes = ['cancelled']; }
      this.filterForm = { from_date: new Date(new Date().setMonth(new Date().getMonth() - 1)), to_date: new Date(), type: this.params.type, table_type: 'all', vendor_id: 'all' };
      if (this.params.type == 'live') { this.filterForm.type = 'all'; }
      if (this.commonService.store_details.login_type == 'vendor') {
        this.filterForm.vendor_id = this.commonService.vendor_details?._id;
      }
      this.filterForm.customer_id = this.params.customer_id;
      if (sessionStorage.getItem(this.params.type + "_order_page")) {
        let pageInfo = JSON.parse(sessionStorage.getItem(this.params.type + "_order_page"));
        sessionStorage.removeItem(this.params.type + "_order_page");
        this.scrollPos = pageInfo.scroll_pos;
        this.page = pageInfo.page_no;
        this.search_bar = pageInfo.search;
        this.filterForm.type = pageInfo.filter_form.type;
        this.filterForm.table_type = pageInfo.filter_form.table_type;
        if (pageInfo.filter_form.vendor_id) { this.filterForm.vendor_id = pageInfo.filter_form.vendor_id; }
        if (pageInfo.filter_form.from_date) { this.filterForm.from_date = new Date(pageInfo.filter_form.from_date); }
        if (pageInfo.filter_form.to_date) { this.filterForm.to_date = new Date(pageInfo.filter_form.to_date); }
      }
      this.getOrderList();
    });
  }

  getOrderList() {
    this.list = [];
    this.orders_count = { all: 0, placed: 0, confirmed: 0, dispatched: 0 };
    if (this.filterForm.from_date && this.filterForm.to_date) {
      this.filterForm.from_date = new Date(new Date(this.filterForm.from_date).setHours(0, 0, 0, 0));
      this.filterForm.to_date = new Date(new Date(this.filterForm.to_date).setHours(23, 59, 59, 999));
      this.pageLoader = true;
      this.filterForm.date_type = 'created_on';
      if (this.filterForm.customer_id.indexOf('@') != -1) {
        this.filterForm.guest_email = this.filterForm.customer_id;
        this.api.GUEST_ORDER_LIST(this.filterForm).subscribe(result => {
          if (result.status) {
            this.selectAll(false);
            let orderList: any = result.list.sort((a, b) => 0 - (a.created_on > b.created_on ? 1 : -1));
            orderList.forEach(obj => {
              if (obj.shipping_address) obj.shipping_customer_name = obj.shipping_address.name;
              if (obj.billing_address) obj.billing_customer_name = obj.billing_address.name;
              if (!obj.customer_name) obj.customer_name = obj.shipping_address.name;
              obj.customer_email = obj.guest_email;
              obj.customer_mobile = obj.shipping_address.dial_code + " " + obj.shipping_address.mobile;
              // delivery time
              if (this.commonService.ys_features.indexOf('time_based_delivery') != -1 && obj.shipping_method.delivery_date && obj.shipping_method.delivery_time) {
                let delDate = obj.shipping_method.delivery_date.split(" (")[0];
                let delTime = obj.shipping_method.delivery_time.split(" - ")[0];
                obj.delivery_time = new Date(delDate + " " + delTime);
              }
              // vendor
              if (obj.vendor_list?.length) {
                let tIndex = obj.vendor_list.findIndex(el => this.orderTypes.indexOf(el.order_status) != -1);
                if (tIndex != -1) {
                  if (this.filterForm.vendor_id != 'all') {
                    let venIndex = obj.vendor_list.findIndex(el => el.vendor_id == this.filterForm.vendor_id);
                    if (venIndex != -1) {
                      let voDetails = obj.vendor_list[venIndex];
                      obj.order_number = voDetails.order_number;
                      obj.order_status = voDetails.order_status;
                      obj.final_price = voDetails.final_price;
                      if (this.orderTypes.indexOf(obj.order_status) != -1) this.list.push(obj);
                    }
                  }
                  else if (this.params.type == 'live') {
                    let vendorLiveOrders = obj.vendor_list.filter(el => el.order_status != 'delivered' && el.order_status != 'cancelled');
                    let confirmedCount = vendorLiveOrders.filter(el => el.confirmed_on).length;
                    if (vendorLiveOrders.findIndex(el => el.order_status == 'placed') != -1) {
                      if (confirmedCount > 0) {
                        obj.order_status = confirmedCount + " of " + vendorLiveOrders.length + " confirmed";
                      }
                    }
                    else if (vendorLiveOrders.findIndex(el => el.order_status == 'confirmed') != -1 && vendorLiveOrders.findIndex(el => el.dispatched_on) == -1) {
                      obj.order_status = 'confirmed';
                      let vCount = vendorLiveOrders.filter(el => el.order_status != 'confirmed').length;
                      if (vCount > 0) obj.order_status = vCount + " of " + vendorLiveOrders.length + " confirmed";
                    }
                    else if (vendorLiveOrders.findIndex(el => el.order_status == 'dispatched') != -1) {
                      obj.order_status = 'dispatched';
                      let vCount = vendorLiveOrders.filter(el => el.order_status != 'dispatched').length;
                      if (vCount > 0) obj.order_status = vCount + " of " + vendorLiveOrders.length + " dispatched";
                    }
                    this.list.push(obj);
                  }
                  else this.list.push(obj);
                }
              }
              else this.list.push(obj);
            });
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos) }, 500);
        });
      }
      else {
        this.api.ORDER_LIST(this.filterForm).subscribe(result => {
          if (result.status) {
            this.selectAll(false);
            let orderList: any = result.list.sort((a, b) => 0 - (a.created_on > b.created_on ? 1 : -1));
            this.orders_count.all = orderList.length;
            orderList.forEach(obj => {
              if (obj.order_status == 'placed') this.orders_count.placed++;
              if (obj.order_status == 'confirmed') this.orders_count.confirmed++;
              if (obj.order_status == 'dispatched') this.orders_count.dispatched++;
              if (obj.billing_address) obj.billing_customer_name = obj.billing_address.name;
              if (obj.shipping_address) {
                obj.shipping_customer_name = obj.shipping_address.name;
                obj.customer_mobile = obj.shipping_address.dial_code + " " + obj.shipping_address.mobile;
              }
              if (obj.customerDetails.length) {
                let custData = obj.customerDetails[0];
                if (!obj.customer_name) obj.customer_name = custData.name;
                obj.customer_email = custData.email;
                if (custData.dial_code && custData.mobile) {
                  obj.customer_mobile = custData.dial_code + " " + custData.mobile;
                }
                else if (obj.order_type == 'pickup') obj.customer_mobile = 'NA';
              }
              else {
                if (!obj.customer_name) obj.customer_name = obj.shipping_address.name;
                obj.customer_email = obj.guest_email;
              }
              // delivery time
              if (this.commonService.ys_features.indexOf('time_based_delivery') != -1 && obj.shipping_method.delivery_date && obj.shipping_method.delivery_time) {
                let delDate = obj.shipping_method.delivery_date.split(" (")[0];
                let delTime = obj.shipping_method.delivery_time.split(" - ")[0];
                obj.delivery_time = new Date(delDate + " " + delTime);
              }
              // vendor
              if (obj.vendor_list?.length) {
                let tIndex = obj.vendor_list.findIndex(el => this.orderTypes.indexOf(el.order_status) != -1);
                if (tIndex != -1) {
                  if (this.filterForm.vendor_id != 'all') {
                    let venIndex = obj.vendor_list.findIndex(el => el.vendor_id == this.filterForm.vendor_id);
                    if (venIndex != -1) {
                      let voDetails = obj.vendor_list[venIndex];
                      obj.order_number = voDetails.order_number;
                      obj.order_status = voDetails.order_status;
                      obj.final_price = voDetails.final_price;
                      if (this.orderTypes.indexOf(obj.order_status) != -1) this.list.push(obj);
                    }
                  }
                  else if (this.params.type == 'live') {
                    let vendorLiveOrders = obj.vendor_list.filter(el => el.order_status != 'delivered' && el.order_status != 'cancelled');
                    let confirmedCount = vendorLiveOrders.filter(el => el.confirmed_on).length;
                    if (vendorLiveOrders.findIndex(el => el.order_status == 'placed') != -1) {
                      if (confirmedCount > 0) {
                        obj.order_status = confirmedCount + " of " + vendorLiveOrders.length + " confirmed";
                      }
                    }
                    else if (vendorLiveOrders.findIndex(el => el.order_status == 'confirmed') != -1 && vendorLiveOrders.findIndex(el => el.dispatched_on) == -1) {
                      obj.order_status = 'confirmed';
                      let vCount = vendorLiveOrders.filter(el => el.order_status != 'confirmed').length;
                      if (vCount > 0) obj.order_status = vCount + " of " + vendorLiveOrders.length + " confirmed";
                    }
                    else if (vendorLiveOrders.findIndex(el => el.order_status == 'dispatched') != -1) {
                      obj.order_status = 'dispatched';
                      let vCount = vendorLiveOrders.filter(el => el.order_status != 'dispatched').length;
                      if (vCount > 0) obj.order_status = vCount + " of " + vendorLiveOrders.length + " dispatched";
                    }
                    this.list.push(obj);
                  }
                  else this.list.push(obj);
                }
              }
              else {
                if (obj.giftcard_amount) obj.final_price += obj.giftcard_amount;
                this.list.push(obj);
              }
            });
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; this.commonService.pageTop(this.scrollPos) }, 500);
        });
      }
      if (document.getElementById('closeModal')) document.getElementById('closeModal').click();
    }
  }

  exportAsXLSX() {
    this.exportLoader = true;
    let fileName = "";
    if (this.params.type == 'live') fileName += "Live Orders from ";
    else if (this.params.type == 'delivered') fileName += "Completed Orders from ";
    else if (this.params.type == 'cancelled') fileName += "Cancelled Orders from ";
    fileName += this.datePipe.transform(this.filterForm.from_date, 'dd MMM y') + " to " + this.datePipe.transform(this.filterForm.to_date, 'dd MMM y');
    let orderList = new OrderFilterPipe().transform(this.list, this.filterForm.table_type);
    orderList = new GridSearchPipe().transform(orderList, { order_number: this.search_bar, customer_name: this.search_bar, customer_email: this.search_bar, customer_mobile: this.search_bar, shipping_customer_name: this.search_bar, billing_customer_name: this.search_bar });
    this.createList(orderList).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, fileName);
      setTimeout(() => { this.exportLoader = false; }, 500);
    });
  }

  async createList(list) {
    let updatedList = [];
    for (let order of list) {
      let sendData = {};
      sendData['Date'] = this.datePipe.transform(order.created_on, 'dd MMM y hh:mm a');
      sendData['Order No.'] = order.order_number;
      sendData['Customer Name'] = order.customer_name;
      sendData['Customer Email'] = order.customer_email;
      sendData['Customer Mobile'] = order.customer_mobile;
      sendData['Address'] = order.shipping_address.address;
      sendData['City'] = order.shipping_address.city;
      sendData['State'] = order.shipping_address.state;
      sendData['Pincode'] = order.shipping_address.pincode;
      sendData['Country'] = order.shipping_address.country;
      // if(this.commonService.ys_features.indexOf('time_based_delivery')!=-1) {
      //   sendData['Delivery Time'] = 'NA';
      //   if(order.delivery_time) sendData['Delivery Time'] = this.datePipe.transform(order.delivery_time, 'dd MMM y hh:mm a');
      // }
      sendData['Shipping'] = order.shipping_cost;
      sendData['COD Charges'] = order.cod_charges;
      sendData['Gift Card'] = order.giftcard_amount;
      sendData['Discount'] = order.discount_amount + order.shipping_discount;
      sendData['Total'] = order.final_price;
      sendData['Payment'] = 'NA';
      if (order.payment_details?.name) sendData['Payment'] = order.payment_details.name;
      let itemsData = await this.processItemList(order.item_list);
      let newSendData = Object.assign(sendData, itemsData);
      updatedList.push(newSendData);
    }
    return updatedList;
  }

  processItemList(list) {
    return new Promise((resolve, reject) => {
      let sendData = {};
      for (let i = 0; i < list.length; i++) {
        sendData['SKU' + (i + 1)] = list[i].sku;
        sendData['HSN Code' + (i + 1)] = 'NA';
        if (list[i].hsn_code) { sendData['HSN Code' + (i + 1)] = list[i].hsn_code; }
        sendData['Item' + (i + 1)] = list[i].name;
        sendData['Qty' + (i + 1)] = list[i].quantity;
        if (list[i].unit) { sendData['Qty' + (i + 1)] = list[i].quantity + " " + list[i].unit; }
        sendData['Price' + (i + 1)] = list[i].final_price * list[i].quantity;
      }
      resolve(sendData);
    });
  }

  getPickupOrders(createReq) {
    delete this.pickupForm.vendor_id; delete this.pickupForm.errorMsg;
    if (this.filterForm.vendor_id != 'all') this.pickupForm.vendor_id = this.filterForm.vendor_id;
    this.pickupForm.order_list = [];
    if (createReq) {
      this.pickupOrders.forEach(obj => {
        if (obj.selected) this.pickupForm.order_list.push(obj);
      });
      if (this.pickupForm.order_list.length) {
        // create request
        this.pickupForm.pickup_date = this.datePipe.transform(new Date(), 'dd-MM-y');
        this.pickupForm.submit = true;
        this.api.CP_ORDER_PICKUP_REQUEST(this.pickupForm).subscribe(result => {
          this.pickupForm.submit = false;
          this.pickupForm.requested = true;
          if (result.status) {
            document.getElementById("closeModal").click();
            this.getOrderList();
          }
          else {
            this.pickupForm.errorMsg = result.message;
            console.log("response", result);
          }
        });
      }
      else this.pickupForm.errorMsg = "Please choose any one order on before submit";
    }
    else {
      // fetch orders
      this.pickupForm.submit = true;
      this.api.CP_ORDER_PICKUP_REQUEST(this.pickupForm).subscribe(result => {
        this.pickupForm.submit = false;
        this.pickupForm.requested = true;
        if (result.status) this.pickupOrders = result.list;
        else {
          this.pickupForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }
  timePicker() {
    const amazingTimePicker = this.atp.open({ theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.pickupForm.pickup_time = this.commonService.timeConversion(time);
    });
  }

  generateInvoice() {
    if (this.selectedList.length) {
      let ids = this.selectedList.map(el => el._id);
      let url = 'https://yourstore.io/invoice/product/' + this.commonService.store_details._id + '/' + ids.join(',');
      if (this.commonService.store_details._id == this.configData.chettinad_id) {
        url = 'https://yourstore.io/invoice/staff-product/' + this.commonService.store_details._id + '/' + ids.join(',');
      }
      window.open(url, '_blank');
    }
  }

  capturePageData() {
    let pageData = { page_no: this.page, search: this.search_bar, filter_form: this.filterForm, scroll_pos: this.commonService.scroll_y_pos };
    sessionStorage.setItem(this.params.type + "_order_page", JSON.stringify(pageData));
  }

  selectAll(x) {
    this.list.forEach(p => {
      p.isSelected = x;
      this.onSelect(p);
    });
  }
  onSelect(x) {
    let index = this.selectedList.findIndex(el => el._id == x._id);
    if (index != -1) {
      if (!x.isSelected) this.selectedList.splice(index, 1);
      this.checkAllSelect();
    }
    else {
      if (x.isSelected) {
        let shipAddr = x.shipping_address;
        x.addrList = [];
        if (shipAddr.city && !shipAddr.pincode) x.addrList.push(shipAddr.city.trim());
        if (!shipAddr.city && shipAddr.pincode) x.addrList.push(shipAddr.pincode.trim())
        if (shipAddr.city && shipAddr.pincode) x.addrList.push(shipAddr.city.trim() + " - " + shipAddr.pincode.trim());
        if (shipAddr.state) x.addrList.push(shipAddr.state.trim());
        x.addrList.push(shipAddr.country);
        this.selectedList.push({ _id: x._id, order_number: x.order_number, shipping_address: shipAddr, addrList: x.addrList });
        this.checkAllSelect();
      }
    }
  }
  checkAllSelect() {
    this.allSelected = true;
    if (this.list.some(el => !el.isSelected)) this.allSelected = false;
  }

  generateCustomLabel() {
    if (this.selectedList.length) {
      let pdfData: any = { content: [] };
      let storeDetails = this.commonService.store_details;
      let shipMobile = '';
      storeDetails.addrList = [];
      if (storeDetails?.company_details?.city && storeDetails?.company_details?.pincode) storeDetails.addrList.push(storeDetails.company_details.city.trim() + ' - ' + storeDetails?.company_details?.pincode.trim());
      if (storeDetails?.company_details?.city && !storeDetails?.company_details?.pincode) storeDetails.addrList.push(storeDetails.company_details.city.trim());
      if (!storeDetails?.company_details?.city && storeDetails?.company_details?.pincode) storeDetails.addrList.push(storeDetails.company_details.pincode.trim());
      if (storeDetails?.company_details?.state) storeDetails.addrList.push(storeDetails.company_details.state.trim());
      storeDetails.addrList.push(storeDetails.country);

      for (let i = 0; i < this.selectedList.length; i++) {
        if (this.selectedList[i].shipping_address?.dial_code) shipMobile = this.selectedList[i].shipping_address?.dial_code + ' ' + this.selectedList[i].shipping_address?.mobile;
        else shipMobile = this.selectedList[i].shipping_address?.mobile;
        let col: any = {
          columns: [
            // Column for "From" address
            {
              width: '45%',
              stack: [
                { text: 'Order #' + this.selectedList[i].order_number, fontSize: 13, bold: true, margin: [0, (i > 0) ? 45 : 5, 0, 0] }, // Order ID
                { text: 'From:', fontSize: 9, bold: true, margin: [0, 15, 0, 0] },
                { text: storeDetails?.company_details?.contact_person, fontSize: 9, bold: true, margin: [0, 15, 0, 0] },
                { text: storeDetails?.name + ',', fontSize: 9, bold: true, margin: [0, 2, 0, 0] },
                { text: storeDetails?.company_details?.address, fontSize: 9, bold: true, margin: [0, 2, 0, 0] },
                { text: storeDetails?.addrList.join(', '), fontSize: 9, bold: true, margin: [0, 2, 0, 0] },
                // { text: storeDetails?.company_details.pincode, fontSize:9, bold: true, margin: [0, 2, 0, 0] },
                [{ text: [{ text: 'Phone: ' + storeDetails?.company_details?.dial_code + ' ' + storeDetails?.company_details?.mobile }], bold: true, fontSize: 9, margin: [0, 4, 0, 0] }],
              ]
            },
            // Column for "To" address
            {
              width: '55%',
              stack: [
                { text: "O", fontSize: 13, bold: true, margin: [10, (i > 0) ? 45 : 5, 0, 0], color: '#FFFFFF' },
                { text: 'To:', fontSize: 13, bold: true, margin: [10, 15, 0, 0] },
                { text: this.selectedList[i].shipping_address?.name, bold: true, fontSize: 13, margin: [10, 10, 0, 0] },
                { text: this.selectedList[i].shipping_address?.address, bold: true, fontSize: 13, margin: [10, 2, 0, 0] },
                { text: this.selectedList[i].addrList.join(', '), bold: true, fontSize: 13, margin: [10, 2, 0, 3] },
                // { text: this.selectedList[i].shipping_address?.pincode, bold: true, fontSize: 13, margin: [10, 2, 0, 3] },
                [{ text: [{ text: 'Phone: ' + shipMobile }], bold: true, fontSize: 13, margin: [10, 3, 0, 3] }],
              ]
            }
          ]
        }
        if (this.selectedList[i].shipping_address?.landmark) {
          col['columns'][1]['stack'] = [
            { text: "O", fontSize: 13, bold: true, margin: [10, (i > 0) ? 45 : 5, 0, 0], color: '#FFFFFF' },
            { text: 'To:', fontSize: 13, bold: true, margin: [10, 15, 0, 0] },
            { text: this.selectedList[i].shipping_address?.name, bold: true, fontSize: 13, margin: [10, 10, 0, 0] },
            { text: this.selectedList[i].shipping_address?.address, bold: true, fontSize: 13, margin: [10, 2, 0, 0] },
            { text: this.selectedList[i].addrList.join(', '), bold: true, fontSize: 13, margin: [10, 2, 0, 3] },
            { text: "Landmark: " + this.selectedList[i].shipping_address.landmark, bold: true, fontSize: 13, margin: [10, 2, 0, 3] },
            [{ text: [{ text: 'Phone: ' + shipMobile }], bold: true, fontSize: 13, margin: [10, 3, 0, 3] }],
          ];
        }
        pdfData.content.push(col);
        // Add a dashed line between labels
        if ((i + 1) % 3 !== 0 && i + 1 !== this.selectedList.length) {
          pdfData.content.push({
            canvas: [
              { type: 'line', x1: 0, y1: 0, x2: 595 - 2 * 40, y2: 0, dash: { length: 5 }, lineWidth: 0.5 }
            ],
            margin: [0, 30, 0, 0]
          });
        }
        // Add a page break after every 3 labels
        if ((i + 1) % 3 === 0 && i + 1 !== this.selectedList.length) {
          pdfData.content.push({ text: '', pageBreak: 'after' });
        }
      }
      pdfMake.createPdf(pdfData).download(`dispatch-list-${this.datePipe.transform(new Date(), 'YYYY-MM-d-hh-mm-ss')}.pdf`);
      setTimeout(() => { this.selectAll(false) }, 1000);
    }
  }

}