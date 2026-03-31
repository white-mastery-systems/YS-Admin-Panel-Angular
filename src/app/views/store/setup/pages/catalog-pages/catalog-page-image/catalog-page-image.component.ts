import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../../../../services/common.service';
import { environment } from '../../../../../../../environments/environment';
import { SetupService } from '../../../setup.service';

@Component({
  selector: 'app-catalog-page-image',
  templateUrl: './catalog-page-image.component.html',
  styleUrls: ['./catalog-page-image.component.scss']
})

export class CatalogPageImageComponent implements OnInit {

  layoutDetails: any = {};
  btnLoader: boolean; pageLoader: boolean; params: any;
  imgBaseUrl = environment.img_baseurl;
  positionList: any = [
    { name: 'Top Left', value: 't_l' }, { name: 'Top Center', value: 't_c' }, { name: 'Top Right', value: 't_r' },
    { name: 'Middle Left', value: 'm_l' }, { name: 'Middle Center', value: 'm_c' }, { name: 'Middle Right', value: 'm_r' },
    { name: 'Bottom Left', value: 'b_l' }, { name: 'Bottom Center', value: 'b_c' }, { name: 'Bottom Right', value: 'b_r' }
  ];
  grid_details: any = {};
  fileList: FormData;
  fileLimitInKB = 500;
  maxImgCount = 10;
  constructor(
    private router: Router, private activeRoute: ActivatedRoute,
    public commonService: CommonService, public setup: SetupService
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = '/setup/pages/catalog-pages/modify/' + params.id;
      this.commonService.secondary_header = ' ';
      this.pageLoader = true; this.btnLoader = false; this.params = params;

      this.setup.GET_SEGMENT_CATALOG_PAGE(this.params.id, this.params.seg_id).subscribe(result => {
        setTimeout(() => { this.pageLoader = false; }, 500);
        if (result.status) {
          this.layoutDetails = result.data;
          this.commonService.secondary_header = this.layoutDetails.name;

          if (this.layoutDetails.type === 'amenities') {
            if (!this.layoutDetails.text_list || !this.layoutDetails.text_list.length) {
              this.layoutDetails.text_list = [{ image: '', name: '', description: '' }];
            }
          } else if (this.layoutDetails.type === 'section') {
            this.grid_details = this.commonService.grid_list.find(obj => obj.type === this.layoutDetails.section_grid_type);
            if (this.grid_details) {
              if (!this.layoutDetails.image_list.length) {
                for (let i = 1; i <= this.grid_details.resolutions.length; i++)
                  this.layoutDetails.image_list.push({ rank: i });
              }
            } else if (!this.layoutDetails.image_list.length) {
              this.layoutDetails.image_list.push({ rank: 1 });
            }
          } else if (this.layoutDetails.type === 'testimonial') {
            this.layoutDetails.image_list.forEach(el => {
              if (!el.content_details) el.content_details = {};
            });
            if (!this.layoutDetails.image_list.length)
              this.layoutDetails.image_list.push({ rank: 1, content_details: {} });
          } else if (this.layoutDetails.type === 'highlighted_section' || this.layoutDetails.type === 'cta') {
            this.layoutDetails.image_list.forEach(el => {
              if (!el.content_details) el.content_details = {};
            });
            if (!this.layoutDetails.image_list.length)
              this.layoutDetails.image_list.push({ rank: 1, content_details: {} });
            if (this.layoutDetails.type === 'cta') this.maxImgCount = 1;
          } else if (this.layoutDetails.type === 'grid') {
            if (!this.layoutDetails.text_list || !this.layoutDetails.text_list.length) {
              this.layoutDetails.text_list = [{ image: '', name: '', description: '' }];
            }
          } else if (this.layoutDetails.type === 'featured_cards') {
            if (!this.layoutDetails.card_list?.length) {
              this.layoutDetails.card_list = [this.newFeaturedCard(1)];
            } else {
              this.layoutDetails.card_list.forEach(card => {
                if (!card.nearby_list?.length) card.nearby_list = [''];
                if (!card.gallery_imgs) card.gallery_imgs = ['', '', ''];
                else { while (card.gallery_imgs.length < 3) card.gallery_imgs.push(''); }
              });
            }
          } else if (!this.layoutDetails.image_list.length) {
            this.layoutDetails.image_list.push({ rank: 1 });
          }
        } else {
          console.log('response', result);
          this.router.navigateByUrl('/setup/pages/catalog-pages/modify/' + this.params.id);
        }
      });
    });
  }

  addNewImg() {
    if (this.layoutDetails.type === 'testimonial') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length + 1, content_details: {} });
    } else if (this.layoutDetails.type === 'highlighted_section') {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length + 1, content_details: {} });
    } else {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length + 1 });
    }
  }

  addTextItem() {
    this.layoutDetails.text_list.push({ image: '', name: '', description: '' });
  }

  newFeaturedCard(rank: number) {
    return { rank, main_img: '', gallery_imgs: ['', '', ''], name: '', description: '', nearby_list: [''], btn_text: '', btn_link_type: 'internal', btn_link: '' };
  }

  async onUpdateLayout() {
    this.btnLoader = true;
    let layoutData = structuredClone(this.layoutDetails);

    this.fileList = new FormData();
    let imageList = this.layoutDetails.image_list || [];
    let textList = this.layoutDetails.text_list || [];
    let cardList = this.layoutDetails.card_list || [];

    this.onSetFormData(imageList).then((imgList: any[]) => {
      layoutData.image_list = imgList;
      this.onSetTextFormData(textList).then((txtList: any[]) => {
        layoutData.text_list = txtList;
        this.onSetCardFormData(cardList).then((cardDataList: any[]) => {
          layoutData.card_list = cardDataList;
          layoutData.store_id = this.commonService.store_details._id;
          layoutData.page_id = this.params.id;
          layoutData._id = this.layoutDetails._id;
          this.fileList.append('data', JSON.stringify(layoutData));
          this.setup.SEGMENT_IMAGE_CATALOG_PAGE(this.fileList).subscribe(result => {
            this.btnLoader = false;
            if (result.status) {
              this.router.navigate(['/setup/pages/catalog-pages/modify/' + this.params.id]);
            } else {
              this.layoutDetails.errorMsg = result.message;
              console.log('response', result);
            }
          });
        });
      });
    });
  }

  onSetFormData(imgList) {
    return new Promise((resolve) => {
      let updatedList = [];
      for (let i = 0; i < imgList.length; i++) {
        let imgData = imgList[i];
        let objData = Object.assign({}, imgData);
        delete objData.temp_desktop_img; delete objData.temp_mobile_img;
        if (imgData.desktop_img_change) {
          delete objData.desktop_img;
          this.fileList.append('attachments', imgData['desktop_img'], i + '_d');
        }
        if (imgData.mobile_img_change) {
          delete objData.mobile_img;
          this.fileList.append('attachments', imgData['mobile_img'], i + '_m');
        }
        updatedList.push(objData);
      }
      resolve(updatedList);
    });
  }

  onSetTextFormData(textList) {
    return new Promise((resolve) => {
      let updatedList = [];
      for (let i = 0; i < textList.length; i++) {
        let textData = textList[i];
        let objData = Object.assign({}, textData);
        delete objData.temp_img;
        if (textData.img_change) {
          delete objData.image;
          this.fileList.append('attachments', textData['image'], i + '_c');
        }
        updatedList.push(objData);
      }
      resolve(updatedList);
    });
  }

  onSetCardFormData(cardList) {
    return new Promise((resolve) => {
      let updatedList = [];
      for (let i = 0; i < cardList.length; i++) {
        let card = cardList[i];
        let objCard = Object.assign({}, card);
        delete objCard.temp_main_img;
        if (card.main_img_change) {
          delete objCard.main_img;
          this.fileList.append('attachments', card['main_img'], i + '_main');
        }
        let galleryImgs = [...(card.gallery_imgs || ['', '', ''])];
        for (let j = 0; j < 3; j++) {
          delete objCard['temp_g' + j + '_img'];
          if (card['g' + j + '_img_change'] && card.gallery_imgs[j]) {
            this.fileList.append('attachments', card.gallery_imgs[j], i + '_g' + j);
            galleryImgs[j] = card.gallery_imgs[j];
          }
        }
        objCard.gallery_imgs = galleryImgs;
        updatedList.push(objCard);
      }
      resolve(updatedList);
    });
  }

  fileChangeListener(devType, index, event) {
    if (devType === 'desktop') delete this.layoutDetails.image_list[index]?.d_err_msg;
    else if (devType === 'mobile') delete this.layoutDetails.image_list[index]?.m_err_msg;
    else if (devType === 'card_main' || devType.startsWith('card_g')) { /* no err_msg for cards */ }
    else delete this.layoutDetails.text_list[index]?.c_err_msg;

    if (event.target.files && event.target.files[0]) {
      let fileData = event.target.files[0];
      let fileInKB = Math.round(fileData.size / 1024);
      if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].indexOf(fileData.type) !== -1) {
        let reader = new FileReader();
        reader.onload = (e: ProgressEvent) => {
          if (devType === 'desktop') {
            if (fileInKB <= this.fileLimitInKB) {
              this.layoutDetails.image_list[index].temp_desktop_img = (<FileReader>e.target).result;
              this.layoutDetails.image_list[index].desktop_img = fileData;
              this.layoutDetails.image_list[index].desktop_img_change = true;
            } else { this.layoutDetails.image_list[index].d_err_msg = true; }
          } else if (devType === 'mobile') {
            if (fileInKB <= this.fileLimitInKB) {
              this.layoutDetails.image_list[index].temp_mobile_img = (<FileReader>e.target).result;
              this.layoutDetails.image_list[index].mobile_img = fileData;
              this.layoutDetails.image_list[index].mobile_img_change = true;
            } else { this.layoutDetails.image_list[index].m_err_msg = true; }
          } else if (devType === 'card_main') {
            if (fileInKB <= this.fileLimitInKB) {
              this.layoutDetails.card_list[index].temp_main_img = (<FileReader>e.target).result;
              this.layoutDetails.card_list[index].main_img = fileData;
              this.layoutDetails.card_list[index].main_img_change = true;
            } else { this.layoutDetails.card_list[index].main_img_err = true; }
          } else if (devType.startsWith('card_g')) {
            let gIndex = parseInt(devType.charAt(6));
            if (fileInKB <= this.fileLimitInKB) {
              this.layoutDetails.card_list[index]['temp_g' + gIndex + '_img'] = (<FileReader>e.target).result;
              this.layoutDetails.card_list[index].gallery_imgs[gIndex] = fileData;
              this.layoutDetails.card_list[index]['g' + gIndex + '_img_change'] = true;
            } else { this.layoutDetails.card_list[index]['g' + gIndex + '_img_err'] = true; }
          } else {
            if (fileInKB <= this.fileLimitInKB) {
              this.layoutDetails.text_list[index].temp_img = (<FileReader>e.target).result;
              this.layoutDetails.text_list[index].image = fileData;
              this.layoutDetails.text_list[index].img_change = true;
            } else { this.layoutDetails.text_list[index].c_err_msg = true; }
          }
        };
        reader.readAsDataURL(fileData);
      }
    }
  }

}
