import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';
import { CustomerApiService } from 'src/app/services/customer-api.service';
import { ExcelService } from 'src/app/services/excel.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss'],
  animations: [SharedAnimations]
})

export class CompaniesComponent implements OnInit {

  search_bar: string; list: any = [];
  pageLoader: boolean; exportLoader: boolean;
  page = 1; pageSize = 10;
  errorMsg: string; fileName: string; btnLoader: boolean;

  company_list:any=[]; email_list:any=[];

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private excelService: ExcelService,
    private customerApi: CustomerApiService, public commonService: CommonService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/setting";
      this.commonService.secondary_header = "Companies";
    }    
    this.page = 1;
    this.pageLoader = true;
    this.commonService.pageTop(0);
    this.onLoadData();
  }

  onLoadData() {
    this.customerApi.COMPANIES_LIST().subscribe(result => {
      if(result.status) {
        this.list = result.data;
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  exportAsXLSX() {
    this.createList(this.list).then((exportList: any[]) => {
      this.excelService.exportAsExcelFile(exportList, 'company'+' export '+new Date().getTime());
      setTimeout(() => { this.exportLoader = false; }, 500);
    });
  }
  async createList(companyList) {    
    let updatedList = [];
    for(let prod of companyList) {
      let sendData = {};
      sendData['name'] = prod.name;
      sendData['email'] = prod.email;
      sendData['gst_no'] = prod.gst_no? prod.gst_no: 'NA';
      sendData['website'] = prod.website? prod.website: 'NA';
      sendData['address_line_1'] = prod.address_line_1;
      sendData['address_line_2'] = prod.address_line_2? prod.address_line_2: '';
      sendData['country'] = prod.country;
      sendData['state'] = prod.state? prod.state: 'NA';
      sendData['city'] = prod.city? prod.city: 'NA';
      sendData['pincode'] = prod.pincode? prod.pincode: 'NA';
      for(let i=0; i<prod.contact_person.length; i++) {
        let cpData = prod.contact_person[i];
        sendData['cp_name_'+(i+1)] = cpData.name;
        sendData['cp_designation_'+(i+1)] = cpData.designation;
        sendData['cp_dial_code_'+(i+1)] = cpData.dial_code;
        sendData['cp_mobile_'+(i+1)] = cpData.mobile;
        sendData['cp_email_'+(i+1)] = cpData.email;
      }
      for(let i=0; i<prod.designation.length; i++) {     
        sendData['designation_'+(i+1)] = prod.designation[i].name;
      }
      updatedList.push(sendData);
    }
    return updatedList;
  }

  onUpload() {
    delete this.errorMsg; delete this.btnLoader;
    if(this.company_list.length) {
      this.btnLoader = true;
      this.customerApi.COMPANIES_BULK_UPLOAD({company_list: this.company_list, email_list: this.email_list}).subscribe((result) => {
        if(result.status) {
          document.getElementById('closeModal').click();
          this.clearInput();
          this.ngOnInit();
        }
        else{
          console.log("response", result);          
          this.errorMsg = result.message;
        }
      });
    }
    else this.errorMsg = "No companies found";
  }

  onFileChange(ev) {
    delete this.errorMsg;
    const reader = new FileReader();    
    reader.onload = () => {
      let workBook = XLSX.read(reader.result, { type: 'binary' });     
      let jsonData: any = workBook.SheetNames.reduce((initial, name) => {
        const sheet = workBook.Sheets[name];
        initial[name] = XLSX.utils.sheet_to_json(sheet);
        return initial;
      }, {});
      this.findCompanys(jsonData.Sheet1);
    }
    this.fileName = ev.target.files[0]?.name;
    reader.readAsBinaryString(ev.target.files[0]);    
  }
  findCompanys(companyData) {
    let compData: any;
    this.company_list = []; this.email_list = [];
    companyData.forEach((ele) => {
      if(ele.name) {
        compData = {
          name: "", email: "", website: "", gst_no: "", address_line_1: "", address_line_2: "",
          city: "", pincode: "", state: "", country: "", contact_person: [], designation: []
        };
        if(ele.name) compData.name = ele.name.toString().trim();
        if(ele.email) compData.email = ele.email.toString().toLowercase().trim();
        if(ele.website) compData.website = ele.website.toString().trim();
        if(ele.gst_no) compData.gst_no = ele.gst_no.toString().trim();
        if(ele.address_line_1) compData.address_line_1 = ele.address_line_1.toString().trim();
        if(ele.address_line_2) compData.address_line_2 = ele.address_line_2.toString().trim();
        if(ele.country) compData.country = ele.country.toString().trim();
        if(ele.state) compData.state = ele.state.toString().trim();
        if(ele.city) compData.city = ele.city.toString().trim();
        if(ele.pincode) compData.pincode = ele.pincode.toString().trim();
        // contact_person
        for(let i=1; i<=10; i++) {
          if(ele['cp_name_'+i]) {
            let contact = {
              name: ele['cp_name_'+i].trim(),
              designation: ele['cp_designation_'+i].trim(),
              email: ele['cp_email_'+i].trim(),
              mobile: ele['cp_mobile_'+i].trim(),
              dial_code: ele['cp_dial_code_'+i].trim()
            };
            if(contact.name && compData.contact_person.findIndex(el => el.name==contact.name)==-1) {
              compData.contact_person.push(contact);
            }
          }
        }
        // designation
        for(let i=1; i<=10; i++) {
          if(ele['designation_'+i]) {
            let desig = ele['designation_'+i].trim();
            if(desig && compData.designation.findIndex(el => el.name==desig)==-1) {
              compData.designation.push({name: desig});
            }
          }
        }
      }
      this.company_list.push(compData);
      if(this.email_list.indexOf(compData.email) == -1) this.email_list.push(compData.email);
    })
  }

  clearInput() {
    let el: any = document.getElementById('importFile');
    el.value = "";
    this.fileName = null;
    this.company_list = [];
  }
}
