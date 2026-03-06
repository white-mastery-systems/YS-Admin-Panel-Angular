import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { AccountService } from '../../account.service';
import { CommonService } from '../../../../../services/common.service';

@Component({
  selector: 'app-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss'],
  animations: [SharedAnimations]
})

export class UserRolesComponent implements OnInit {

  search_bar: string;
  page = 1; pageSize = 10;
  pageLoader: boolean;
  list: any = [];
  permForm: any = {}; deleteForm: any = {};
  permissionList: any = [];
  popupLoader: boolean;

  constructor(config: NgbModalConfig, public modalService: NgbModal, private router: Router, private api: AccountService, public commonService: CommonService) {
    config.backdrop = 'static'; config.keyboard = false;
    this.permissionList = this.commonService.user_permission_list;
  }

  ngOnInit() {
    this.commonService.redirect = "/account/users";
    this.commonService.secondary_header = "User Roles";
    this.pageLoader = true;
    this.api.ROLES_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  onAdd(modalName) {
    this.permForm = { form_type: 'add', permission_list: [] };
    this.updatePermList(this.permForm.permission_list);
    this.modalService.open(modalName, {size: 'lg', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  // EDIT
  onEdit(x, modalName) {
    this.permForm = {}; this.popupLoader = true;
    this.modalService.open(modalName, {size: "lg", windowClass: 'scroll-modal-xl', scrollable : true});
    this.api.ROLES_LIST().subscribe(result => {
      if(result.status) {
        let roleList = result.list;
        let roleData = roleList.find(obj => obj._id==x._id);
        if(roleData) {
          this.permForm = roleData;
          this.permForm.form_type = 'edit';
          this.updatePermList(this.permForm.permission_list);
          this.popupLoader = false;
        }
        else console.log("invalid role");
      }
      else console.log("response", result);
    });
  }

  onSubmit() {
    this.permForm.submit = true;
    this.permForm.permission_list = this.createUserAccess();
    if(this.permForm.form_type=='add') {
      this.api.ADD_ROLE(this.permForm).subscribe((result) => {
        this.permForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
        }
        else {
          this.permForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_ROLE(this.permForm).subscribe(result => {
        this.permForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.list = result.list;
        }
        else {
          this.permForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  // DELETE
  onDelete() {
    this.deleteForm.submit = true;
    this.api.DELETE_ROLE(this.deleteForm).subscribe(result => {
      this.deleteForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal').click();
        this.list = result.list;
      }
      else {
				this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
		});
  }

  updatePermList(userPermList) {
    this.permissionList.forEach(elem => {
      if(elem.sub_list.length) {
        elem.sub_list.forEach(obj => {
          obj.checked = false;
          if(userPermList.indexOf(obj.keyword)!=-1) obj.checked = true;
        });
      }
      else {
        elem.checked = false;
        if(userPermList.indexOf(elem.keyword)!=-1) elem.checked = true;
      }
    });
  }

  createUserAccess() {
    let permList = [];
    this.permissionList.forEach(elem => {
      if(elem.sub_list.length) {
        elem.sub_list.forEach(obj => {
          if(obj.checked) permList.push(obj.keyword);
        });
      }
      else {
        if(elem.checked) permList.push(elem.keyword);
      }
    });
    return permList;
  }

}