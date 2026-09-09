import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { environment } from '../../../../../../environments/environment';
import { CommonService } from '../../../../../services/common.service';
import { FeaturesApiService } from '../../features-api.service';

@Component({
    selector: 'app-blog-authors',
    templateUrl: './blog-authors.component.html',
    styleUrls: ['./blog-authors.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})
export class BlogAuthorsComponent implements OnInit {

  page = 1; pageSize = 10; scrollPos = 0;
  list: any[] = [];
  search_bar: string;
  pageLoader = false;
  popupLoader = false;
  authorForm: any = {};
  imgBaseUrl = environment.img_baseurl;

  constructor(
    private fApi: FeaturesApiService,
    public commonService: CommonService,
    public modalService: NgbModal
  ) { }

  ngOnInit() {
    if(!this.commonService.desktop_device) {
      this.commonService.redirect = '/setting/blogs-authors';
      this.commonService.secondary_header = 'Blog Authors';
    }
    this.pageLoader = true;
    this.fApi.BLOG_AUTHOR_LIST().subscribe((result) => {
      if(result.status) {
        this.list = result.list || [];
        this.commonService.blog_author_list = [...this.list].sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
        this.commonService.updateLocalData('blog_author_list', this.commonService.blog_author_list);
      }
      setTimeout(() => { this.pageLoader = false; }, 300);
    });
  }

  openPopup(type, data, modalName) {
    this.popupLoader = false;
    if(type === 'add') {
      this.authorForm = { form_type: 'add', status: 'active', count: 0 };
      this.modalService.open(modalName, { size: 'lg', windowClass: 'scroll-modal-lg', scrollable: true });
      return;
    }

    this.popupLoader = true;
    this.modalService.open(modalName, { size: 'lg', windowClass: 'scroll-modal-lg', scrollable: true });
    this.fApi.BLOG_AUTHOR_DETAILS(data._id).subscribe((result) => {
      if(result.status) {
        this.authorForm = { ...result.data, form_type: 'edit' };
      }
      this.popupLoader = false;
    });
  }

  onSubmit() {
    this.authorForm.errorMsg = '';
    this.authorForm.submit = true;
    const request = this.authorForm.form_type === 'add' ? this.fApi.ADD_BLOG_AUTHOR(this.authorForm) : this.fApi.UPDATE_BLOG_AUTHOR(this.authorForm);
    request.subscribe((result) => {
      this.authorForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal')?.click();
        this.ngOnInit();
      }
      else this.authorForm.errorMsg = result.message;
    });
  }

  onDelete() {
    this.authorForm.submit = true;
    this.fApi.DELETE_BLOG_AUTHOR(this.authorForm).subscribe((result) => {
      this.authorForm.submit = false;
      if(result.status) {
        document.getElementById('closeModal')?.click();
        this.ngOnInit();
      }
      else this.authorForm.errorMsg = result.message;
    });
  }

  uploadAuthorAvatar(event) {
    if(!(event.target.files && event.target.files[0])) return;
    const inFile = event.target.files[0];
    if(["image/jpeg", "image/png", "image/webp"].indexOf(inFile.type) === -1) return;

    const formData = new FormData();
    formData.append('image', inFile);
    this.authorForm.avatarLoader = true;
    this.fApi.BLOG_UPLOAD_IMAGE(formData).subscribe((result) => {
      this.authorForm.avatarLoader = false;
      if(result.status && result.path) {
        this.authorForm.avatar = result.path;
      }
      else this.authorForm.errorMsg = result.message || 'Unable to upload image';
    });
  }
}
