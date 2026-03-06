import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeaturesApiService } from '../features-api.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-web-stories',
  templateUrl: './web-stories.component.html',
  styleUrls: ['./web-stories.component.scss'],
  animations: [SharedAnimations]
})
export class WebStoriesComponent implements OnInit {

  pageLoader: boolean;
  page = 1; pageSize = 10;
  list: any = []; search_bar: any;
  storyForm: any; deleteForm: any;
  imgBaseUrl = environment.img_baseurl;
  seoForm: any = {}; popupLoader: boolean;
  fileList: FormData = new FormData();
  
  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private api: FeaturesApiService,
    public commonService: CommonService, private storeApi: StoreApiService
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = "/setting";
      this.commonService.secondary_header = "Web Stories";
    }
    this.pageLoader = true;
    this.api.WEB_STORY_LIST().subscribe(result => {
      if(result.status) this.list = result.list;
      else console.log("response", result);
      setTimeout(() => { this.pageLoader = false; }, 500);
    });
  }

  // UPDATE STATUS
  onChangeStatus(x, status, modalName) {
    this.storyForm = x;
    this.storyForm.change_status = status;
    this.storyForm.cisActive = true;
    if(status=='disable') this.storyForm.cisActive = false;
    this.modalService.open(modalName, { centered: true });
  }
  onUpdateStatus() {
    this.fileList = new FormData();
    this.fileList.append('data', JSON.stringify({ _id: this.storyForm._id, isActive: this.storyForm.cisActive })); 
    this.api.UPDATE_WEB_STORY(this.fileList).subscribe(result => {
			if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
			else {
				this.storyForm.errorMsg = result.message;
				console.log("response", result);
      }
		});
  }

  // DELETE
  onDelete() {
    this.api.DELETE_WEB_STORY(this.deleteForm).subscribe(result => {
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

}
