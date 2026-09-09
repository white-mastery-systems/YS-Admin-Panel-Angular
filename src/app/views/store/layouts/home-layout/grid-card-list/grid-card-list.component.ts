import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { StoreApiService } from '../../../../../services/store-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-grid-card-list',
    templateUrl: './grid-card-list.component.html',
    styleUrls: ['./grid-card-list.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})

export class GridCardListComponent implements OnInit {

  page = 1; pageSize = 10; params: any = {};
  pageLoader: boolean; search_bar: string;
  list: any = []; cardDetails: any = {};
  imgBaseUrl = environment.img_baseurl;
  fileList: FormData;

  constructor(private activeRoute: ActivatedRoute, private api: StoreApiService, public commonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.secondary_header = " ";
      this.pageLoader = true; this.params = params;
      this.commonService.redirect = "/setup/layouts/home";
      // layout details
      this.api.LAYOUT_DETAILS(params.layout_id, false).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if(result.status) {
          this.list = result.data.multigrid_list;
          this.commonService.secondary_header = result.data.name;
          if(params.card_id) {
            this.commonService.redirect = "/setup/layouts/home/grid/"+params.layout_id;
            let cInd = this.list.findIndex(el => el._id==params.card_id);
            if(cInd!=-1) {
              this.cardDetails = this.list[cInd];
              this.commonService.secondary_header = this.cardDetails.name;
              if(!this.cardDetails.cards?.length) this.cardDetails.cards = [{ image_list: [] }];
            }
            else {
              console.log("Invalid card id");
              this.router.navigateByUrl("/setup/layouts/home/grid/"+params.layout_id);
            }
          }
        }
        else {
          console.log("response", result);
          this.router.navigateByUrl("/setup/layouts/home");
        }
      });
    });
  }

  onUpdateLayout() {
    delete this.cardDetails.errorMsg; this.cardDetails.submit = true;
    this.onSetFormData(this.cardDetails.cards).then((list) => {
      let sendData = {
        layout_id: this.params.layout_id, _id: this.cardDetails._id, primary: this.cardDetails.primary, cards: list
      };
      if(sendData.primary > (list.length - 1)) sendData.primary = 0;
      this.fileList.append('data', JSON.stringify(sendData));
      this.api.UPDATE_LAYOUT_MULTI_GRID(this.fileList).subscribe(result => {
        this.cardDetails.submit = false;
        if(result.status) {
          this.router.navigateByUrl("/setup/layouts/home/grid/"+this.params.layout_id);
        }
        else {
          this.cardDetails.errorMsg = result.message;
          console.log("response", result);
        }
      });
    });
  }

  async onSetFormData(cardList) {
    this.fileList = new FormData();
    let updatedList = [];
    for(let i=0; i<cardList.length; i++)
    {
      let imgList = await this.onContSetFormData(i, cardList[i].image_list);
      updatedList.push({ name: cardList[i].name, category_id: cardList[i].category_id, image_list: imgList });
    }
    return updatedList;
  }
  onContSetFormData(parentIndex, imgList) {
    return new Promise((resolve, reject) => {
      let updatedList = [];
      for(let i=0; i<imgList.length; i++)
      {
        let imgData = imgList[i];
        if(imgData.img_change) this.fileList.append('attachments', imgData['temp_image'], parentIndex+'_'+i);
        let objData = { img_change: true };
        if(!imgData.img_change) objData = imgData;
        updatedList.push(objData);
      }
      resolve(updatedList);
    });
  }

  fileChangeListener(imgList, event) {
    if(event.target.files.length) {
      let maxLimit = 10 - imgList.length;
      for(let i=0; i<maxLimit; i++) {
        let fileData = event.target.files[i];
        if(fileData) {
          let fileInKB = Math.round(fileData.size/ 1024);
          if(fileInKB <= 500 && ["image/jpeg", "image/png", "image/webp"].indexOf(fileData.type) != -1) {
            let myReader: FileReader = new FileReader();
            myReader.onload = (event: ProgressEvent) => {
              imgList.push({
                img_change: true, temp_image: fileData, image: (<FileReader>event.target).result
              });
            }
            myReader.readAsDataURL(fileData);
          }
        }
      }
    }
  }

}