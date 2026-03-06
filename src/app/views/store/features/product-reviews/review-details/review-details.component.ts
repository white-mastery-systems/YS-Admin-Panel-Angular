import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FeaturesApiService } from '../../features-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.scss'],
  animations: [SharedAnimations]
})

export class ReviewDetailsComponent implements OnInit {

  pageLoader: boolean; params: any;
  page = 1; pageSize = 10;
  reviewDetails: any = {}; selectedReview: any = {};
  imgBaseUrl = environment.img_baseurl;
  configData: any= environment.config_data;
  reviewForm: any = {}; deleteForm: any = {};
  currentDate: Date = new Date();

  constructor(
    config: NgbModalConfig, public modalService: NgbModal, private router: Router, private activeRoute: ActivatedRoute,
    private api: FeaturesApiService, public commonService: CommonService, private atp: AmazingTimePickerService,private datepipe: DatePipe
  ) {
    config.backdrop = 'static'; config.keyboard = false;
  }

  ngOnInit(): void {
    this.commonService.redirect = "/product-sections/reviews";
    this.commonService.secondary_header = "Ratings & Reviews";
    this.activeRoute.params.subscribe((params: Params) => {
      this.params = params;
      if(this.router.url.includes("/selected-product-reviews/")) {
        this.commonService.redirect = "/product-sections/products";
        this.pageLoader = true;
        this.api.REVIEWED_PRODUCT_LIST({ product_id: this.params.id }).subscribe(result => {
          setTimeout(() => { this.pageLoader = false; }, 500);
          if(result.status) {
            this.reviewDetails = result.list[0];
            this.reviewDetails.reviews.forEach(obj => {
              obj.description = obj.description.replace(new RegExp('\n', 'g'), "<br />");
            });
          }
          else console.log("response", result);
        });
      }
      else {
        if(localStorage.getItem("review_filter")) {
          let filterForm: any = JSON.parse(localStorage.getItem("review_filter"));
          filterForm.id = this.params.id;
          this.pageLoader = true;
          this.api.REVIEWED_PRODUCT_LIST(filterForm).subscribe(result => {
            setTimeout(() => { this.pageLoader = false; }, 500);
            if(result.status) {
              if(result.list.length) {
                this.reviewDetails = result.list[0];
                this.reviewDetails.reviews.forEach(obj => {
                  obj.description = obj.description.replace(new RegExp('\n', 'g'), "<br />");
                });
              }
              else this.router.navigate(['/product-sections/reviews']);
            }
            else console.log("response", result);
          });
        }
        else this.router.navigate(['/product-sections/reviews']);
      }
    });
  }

  onAdd(modalName) {
    this.reviewForm = {
      form_type: 'add', step_num: 1, rating: 5, image_list: [],
      social_media_links: [], created_on: this.currentDate, created_time: "12:00 AM",
      country: this.commonService.store_details?.country
    };
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }
  onEdit(x, modalName) {
    let imgList = []; let linkList = [];
    x.image_list.forEach(obj => { imgList.push({ image: obj.image }); });
    if(!x.social_media_links) x.social_media_links = [];
    x.social_media_links.forEach(obj => { linkList.push({ type: obj.type, url: obj.url }); });
    this.reviewForm = { form_type: 'edit', step_num: 1 };
    for(let key in x) {
      if(x.hasOwnProperty(key)) this.reviewForm[key] = x[key];
    }
    this.reviewForm.created_on = new Date(this.reviewForm.created_on);
    this.reviewForm.created_time = this.datepipe.transform(new Date(this.reviewForm.created_on), 'hh:mm a');
    this.reviewForm.image_list = imgList;
    this.reviewForm.social_media_links = linkList;
    this.modalService.open(modalName, {size: 'xl', windowClass: 'scroll-modal-xl', scrollable : true});
  }

  onSubmit() {
    this.reviewForm.submit = true;
    this.reviewForm.product_id = this.reviewDetails.productDetails[0]._id;
    this.reviewForm.created_on = new Date(this.datepipe.transform(new Date(this.reviewForm.created_on), 'dd MMM y')+' '+this.reviewForm.created_time);
    if(this.reviewForm.form_type=='add') {
      this.reviewForm.status = "active";
      this.api.ADD_REVIEW(this.reviewForm).subscribe(result => {
        this.reviewForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.reviewForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_REVIEW(this.reviewForm).subscribe(result => {
        this.reviewForm.submit = false;
        if(result.status) {
          document.getElementById('closeModal').click();
          this.ngOnInit();
        }
        else {
          this.reviewForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  updateStatus(x) {
    let formData: any = { product_id: this.reviewDetails.productDetails[0]._id };
    for(let key in x) {
      if(x.hasOwnProperty(key)) formData[key] = x[key];
    }
    formData.status = 'active';
    if(x.status=='active') formData.status = 'inactive';
    this.api.UPDATE_REVIEW(formData).subscribe(result => {
      if(result.status) {
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.selectedReview.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  onDelete() {
    this.api.DELETE_REVIEW({ product_id: this.reviewDetails.productDetails[0]._id, _id: this.deleteForm._id }).subscribe(result => {
      if(result.status) {
        document.getElementById('closeDeleteModal').click();
        document.getElementById('closeModal').click();
        this.ngOnInit();
      }
      else {
        this.deleteForm.errorMsg = result.message;
        console.log("response", result);
      }
    });
  }

  fileChangeListener(index, event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.reviewForm.image_list[index].image = (<FileReader>event.target).result;
        this.reviewForm.image_list[index].img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

  timePicker() {
    const amazingTimePicker = this.atp.open({ time: this.convertTime12to24(this.reviewForm.created_time), theme: 'material-purple' });
    amazingTimePicker.afterClose().subscribe(time => {
      this.reviewForm.created_time = this.commonService.timeConversion(time);
    });
  }

  convertTime12to24 = (time12h: any) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if(hours === '12') hours = '00';
    if(modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return `${hours}:${minutes}`;
  }

}