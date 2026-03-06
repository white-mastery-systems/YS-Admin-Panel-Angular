import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../account.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-sub-users',
  templateUrl: './sub-users.component.html',
  styleUrls: ['./sub-users.component.scss'],
  animations: [SharedAnimations]
})

export class SubUsersComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  pageLoader: boolean;
  list: any = []; roleList: any = [];
  userForm: any = {}; deleteForm: any = {};
  pwdForm: any = {};
  subUserLimit: Number = 0;
  popupLoader: boolean;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: AccountService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit() {
    this.commonService.redirect = "/account";
    this.commonService.secondary_header = "Users";
    if(this.commonService.ys_features.indexOf('1_staff')!=-1) this.subUserLimit = 1;
    if(this.commonService.ys_features.indexOf('5_staff')!=-1) this.subUserLimit = 5;
    if(this.commonService.ys_features.indexOf('10_staff')!=-1) this.subUserLimit = 10;
    if(this.commonService.ys_features.indexOf('20_staff')!=-1) this.subUserLimit = 20;
    if(this.commonService.ys_features.indexOf('20_plus_staff')!=-1) this.subUserLimit = 100;
    this.pageLoader = true;
    this.api.SUBUSER_LIST().subscribe(result => {
      if(result.status) {
        this.roleList = result.roles;
        this.setUserList(result);
      }
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // EDIT
  onEdit(x, modalName) {
    this.userForm = {}; this.popupLoader = true;
    this.modalService.open(modalName, {windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.SUBUSER_LIST().subscribe(result => {
      if(result.status) {
        let userDetails = result.list.find(obj => obj._id==x._id);
        if(userDetails) {
          this.userForm = userDetails;
          this.userForm.form_type = 'edit';
          this.userForm.user_status = false;
          if(this.userForm.status == "active") this.userForm.user_status = true;
          this.popupLoader = false;
        }
        else console.log("invalid user");
      }
      else console.log("response", result);
    });
  }

  onSubmit() {
    this.userForm.submit = true;
    if(this.userForm.form_type=='add') {
      this.userForm.max_limit = this.subUserLimit;
      this.api.ADD_SUBUSER(this.userForm).subscribe((result) => {
        this.userForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.setUserList(result);
        }
        else {
          this.userForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      if(this.userForm.user_status) this.userForm.status = 'active';
      else this.userForm.status = 'inactive';
      this.userForm.session_key = new Date().valueOf();
      this.api.UPDATE_SUBUSER(this.userForm).subscribe(result => {
        this.userForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.setUserList(result);
        }
        else {
          this.userForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // DELETE
  onDelete() {
    this.deleteForm.submit = true;
    this.api.DELETE_SUBUSER(this.deleteForm).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.setUserList(result);
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  setUserList(result) {
    this.list = result.list;
    this.commonService.user_list = [];
    result.list.forEach(obj => {
      let roleData = this.roleList.find(el => el._id==obj.designation);
      obj.designation = "NA";
      if(roleData) obj.designation = roleData.name;
      if(obj.status=='active') this.commonService.user_list.push({ _id: obj._id, name: obj.name });
    });
    this.commonService.updateLocalData('user_list', this.commonService.user_list);
  }

  // UPDATE PWD
  onUpdatePwd() {
    this.api.UPDATE_SUBUSER_PWD(this.pwdForm).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
      }
      else {
				this.pwdForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

}