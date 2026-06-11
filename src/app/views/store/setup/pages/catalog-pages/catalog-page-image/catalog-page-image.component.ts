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
          this.maxImgCount = 10;

          if (this.layoutDetails.type === 'amenities') {
            this.maxImgCount = 50;
            if (!this.layoutDetails.text_list || !this.layoutDetails.text_list.length) {
              this.layoutDetails.text_list = [{ image: '', icon_name: '', name: '', description: '' }];
            } else {
              this.layoutDetails.text_list.forEach(item => {
                if (item.icon_name === undefined) item.icon_name = '';
              });
            }
          } else if (this.layoutDetails.type === 'founder_faq_grid') {
            if (!this.layoutDetails.founder_intro) {
              this.layoutDetails.founder_intro = this.getDefaultFounderIntro();
            } else {
              this.layoutDetails.founder_intro = { ...this.getDefaultFounderIntro(), ...this.layoutDetails.founder_intro };
            }
            if (!this.layoutDetails.highlight_points || !this.layoutDetails.highlight_points.length) {
              this.layoutDetails.highlight_points = [this.getDefaultHighlightPoint()];
            } else {
              this.layoutDetails.highlight_points = this.normalizeHighlightPoints(this.layoutDetails.highlight_points);
            }
            if (!this.layoutDetails.founder_faq_list || !this.layoutDetails.founder_faq_list.length) {
              this.layoutDetails.founder_faq_list = [this.getDefaultFounderFaqItem()];
            } else {
              this.layoutDetails.founder_faq_list = this.normalizeFounderFaqList(this.layoutDetails.founder_faq_list);
            }
          } else if (this.layoutDetails.type === 'content_checklist_split') {
            if (!this.layoutDetails.content_split_intro) {
              this.layoutDetails.content_split_intro = this.getDefaultContentSplitIntro();
            } else {
              this.layoutDetails.content_split_intro = { ...this.getDefaultContentSplitIntro(), ...this.layoutDetails.content_split_intro };
            }
            if (!this.layoutDetails.checklist_config) {
              this.layoutDetails.checklist_config = this.getDefaultChecklistConfig();
            } else {
              this.layoutDetails.checklist_config = { ...this.getDefaultChecklistConfig(), ...this.layoutDetails.checklist_config };
            }
            if (!this.layoutDetails.checklist_items || !this.layoutDetails.checklist_items.length) {
              this.layoutDetails.checklist_items = [this.getDefaultChecklistItem()];
            } else {
              this.layoutDetails.checklist_items = this.normalizeChecklistItems(this.layoutDetails.checklist_items);
            }
            if (!this.layoutDetails.theme) {
              this.layoutDetails.theme = 'light';
            }
          } else if (this.layoutDetails.type === 'icon_card_grid') {
            if (!this.layoutDetails.icon_card_list || !this.layoutDetails.icon_card_list.length) {
              this.layoutDetails.icon_card_list = [this.getDefaultIconCardItem()];
            }
            this.layoutDetails.icon_card_list = this.normalizeIconCardList(this.layoutDetails.icon_card_list);
          } else if (this.layoutDetails.type === 'image_icon_grid_split') {
            if (!this.layoutDetails.icon_card_list || !this.layoutDetails.icon_card_list.length) {
              this.layoutDetails.icon_card_list = [this.getDefaultIconCardItem()];
            }
            this.layoutDetails.icon_card_list = this.normalizeIconCardList(this.layoutDetails.icon_card_list);
            if (!this.layoutDetails.footer_banner) {
              this.layoutDetails.footer_banner = this.getDefaultFooterBanner();
            } else {
              this.layoutDetails.footer_banner = { ...this.getDefaultFooterBanner(), ...this.layoutDetails.footer_banner };
            }
            if (this.layoutDetails.cover_img_alt === undefined) {
              this.layoutDetails.cover_img_alt = '';
            }
          } else if (this.layoutDetails.type === 'location_highlights') {
            if (!this.layoutDetails.location_iframe) {
              this.layoutDetails.location_iframe = { iframe_url: '', heading: '', sub_heading: '', description: '' };
            }
            if (!this.layoutDetails.card_list || !this.layoutDetails.card_list.length) {
              this.layoutDetails.card_list = [{ image: '', heading: '', sub_heading: '', description: '' }];
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
              if (el.content_details.review_star === undefined || el.content_details.review_star === null) el.content_details.review_star = null;
            });
            if (!this.layoutDetails.image_list.length)
              this.layoutDetails.image_list.push({ rank: 1, content_details: { review_star: null } });
          } else if (this.layoutDetails.type === 'highlighted_section' || this.layoutDetails.type === 'cta') {
            this.layoutDetails.image_list.forEach(el => {
              if (!el.content_details) el.content_details = {};
              if (this.layoutDetails.type === 'highlighted_section') {
                if (el.highlighted_text === undefined) el.highlighted_text = '';
                if (el.highlighted_text_color === undefined) el.highlighted_text_color = '#000000';
                if (el.tag_line === undefined) el.tag_line = '';
                if (el.heading === undefined) el.heading = '';
                if (el.sub_heading === undefined) el.sub_heading = '';
                if (el.description === undefined) el.description = '';
                if (el.notes === undefined) el.notes = '';
                if (!el.features) el.features = [];
                el.features = el.features.map(feature => ({
                  name: feature?.name || '',
                  detail: feature?.detail || '',
                  icon_name: feature?.icon_name || ''
                }));
                if (el.btn_style === undefined) el.btn_style = 'primary';
                if (el.btn_text_color === undefined) el.btn_text_color = 'light';
                if (el.btn_link_type === undefined) el.btn_link_type = 'internal';
                if (el.btn_link === undefined) el.btn_link = '';
                el.gallery_images = this.normalizeHighlightedGalleryImages(el.gallery_images);
              }
            });
            if (!this.layoutDetails.image_list.length)
              this.layoutDetails.image_list.push(this.getDefaultHighlightedSectionItem(1));
            if (this.layoutDetails.type === 'cta') {
              this.maxImgCount = 1;
              this.layoutDetails.cta_list = this.normalizeCtaList(this.layoutDetails.cta_list);
              if (!this.layoutDetails.cta_list.length) this.layoutDetails.cta_list = [this.getDefaultCtaItem()];
            }
          } else if (this.layoutDetails.type === 'feature_list') {
            if (!this.layoutDetails.feature_list || !this.layoutDetails.feature_list.length) {
              this.layoutDetails.feature_list = [this.getDefaultFeatureListItem()];
            }
            this.layoutDetails.feature_list = this.normalizeFeatureListItems(this.layoutDetails.feature_list);
            // Backward compatibility: migrate segment-level card/button to first item.
            if (this.layoutDetails.features?.length) {
              this.layoutDetails.feature_list[0].features = this.normalizeFeatureCards(this.layoutDetails.features);
            }
            if (this.layoutDetails.btn_status || this.layoutDetails.btn_text || this.layoutDetails.btn_link) {
              this.layoutDetails.feature_list[0].btn_status = !!this.layoutDetails.btn_status;
              this.layoutDetails.feature_list[0].btn_text = this.layoutDetails.btn_text || '';
              this.layoutDetails.feature_list[0].btn_style = this.layoutDetails.btn_style || 'primary';
              this.layoutDetails.feature_list[0].btn_text_color = this.layoutDetails.btn_text_color || 'light';
              this.layoutDetails.feature_list[0].btn_link_type = this.layoutDetails.btn_link_type || 'internal';
              this.layoutDetails.feature_list[0].btn_link = this.layoutDetails.btn_link || '';
            }
          } else if (this.layoutDetails.type === 'featured_cards') {
            if (!this.layoutDetails.image_list?.length) {
              this.layoutDetails.image_list = [{ rank: 1 }];
            }
            if (!this.layoutDetails.cta_list?.length) {
              this.layoutDetails.cta_list = [{ btn_status: false, btn_text: '', btn_style: 'primary', btn_text_color: 'light', btn_link_type: 'internal', btn_link: '' }];
            }
          } else if (this.layoutDetails.type === 'hero_cta') {
            if (!this.layoutDetails.cta_list?.length) {
              this.layoutDetails.cta_list = [
                { heading: '', description: '', icon_name: '', btn_status: true, btn_list: [] },
                { heading: '', description: '', icon_name: '', btn_status: true, btn_list: [] }
              ];
            } else {
              this.layoutDetails.cta_list.forEach(cta => {
                if (!cta.icon_name) cta.icon_name = '';
                if (!cta.btn_list) cta.btn_list = [];
              });
            }
          } else if (this.layoutDetails.type === 'internal_links') {
            this.layoutDetails.group_list = this.normalizeInternalLinkGroups(this.layoutDetails.group_list, this.layoutDetails.cta_list);
            if (!this.layoutDetails.group_list.length) {
              this.layoutDetails.group_list = [this.getDefaultInternalLinkGroup()];
            }
            this.syncInternalLinkGroupRanks();
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
      this.layoutDetails.image_list.push(this.getDefaultHighlightedSectionItem(this.layoutDetails.image_list.length + 1));
    } else {
      this.layoutDetails.image_list.push({ rank: this.layoutDetails.image_list.length + 1 });
    }
  }

  getDefaultHighlightedGalleryItem(rank = 1) {
    return {
      rank,
      image: '',
      img_alt: ''
    };
  }

  normalizeHighlightedGalleryImages(galleryImages: any[] = []) {
    const normalizedGallery = (Array.isArray(galleryImages) ? galleryImages : []).map((item, index) => ({
      rank: Number(item?.rank) > 0 ? Number(item.rank) : index + 1,
      image: item?.image || '',
      img_alt: item?.img_alt || '',
      temp_img: item?.temp_img
    })).sort((a, b) => a.rank - b.rank)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));

    return normalizedGallery.length ? normalizedGallery : [this.getDefaultHighlightedGalleryItem()];
  }

  getDefaultHighlightedSectionItem(rank = 1) {
    return {
      rank,
      content_details: {},
      tag_line: '',
      heading: '',
      sub_heading: '',
      description: '',
      notes: '',
      highlighted_text: '',
      highlighted_text_color: '#000000',
      features: [],
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_link_type: 'internal',
      btn_link: '',
      gallery_images: [this.getDefaultHighlightedGalleryItem()]
    };
  }

  addGalleryImage(cardIndex) {
    if (!Array.isArray(this.layoutDetails.image_list[cardIndex].gallery_images)) {
      this.layoutDetails.image_list[cardIndex].gallery_images = [];
    }
    this.layoutDetails.image_list[cardIndex].gallery_images.push(
      this.getDefaultHighlightedGalleryItem(this.layoutDetails.image_list[cardIndex].gallery_images.length + 1)
    );
    this.syncHighlightedGalleryRanks(cardIndex);
  }

  removeGalleryImage(cardIndex, galleryIndex) {
    this.layoutDetails.image_list[cardIndex].gallery_images.splice(galleryIndex, 1);
    if (!this.layoutDetails.image_list[cardIndex].gallery_images.length) {
      this.layoutDetails.image_list[cardIndex].gallery_images = [this.getDefaultHighlightedGalleryItem()];
    }
    this.syncHighlightedGalleryRanks(cardIndex);
  }

  syncHighlightedGalleryRanks(cardIndex) {
    if (!Array.isArray(this.layoutDetails.image_list[cardIndex].gallery_images)) {
      this.layoutDetails.image_list[cardIndex].gallery_images = [this.getDefaultHighlightedGalleryItem()];
      return;
    }

    this.layoutDetails.image_list[cardIndex].gallery_images = this.layoutDetails.image_list[cardIndex].gallery_images.map((item, index) => ({
      ...item,
      rank: index + 1
    }));
  }

  onHighlightedGalleryRankChange(cardIndex) {
    if (!Array.isArray(this.layoutDetails.image_list[cardIndex].gallery_images)) {
      this.layoutDetails.image_list[cardIndex].gallery_images = [this.getDefaultHighlightedGalleryItem()];
      return;
    }

    this.layoutDetails.image_list[cardIndex].gallery_images = this.layoutDetails.image_list[cardIndex].gallery_images
      .map((item, index) => ({
        ...item,
        rank: Number(item?.rank) > 0 ? Number(item.rank) : index + 1
      }))
      .sort((a, b) => a.rank - b.rank)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }

  addTextItem() {
    this.layoutDetails.text_list.push({ image: '', icon_name: '', name: '', description: '' });
  }

  addFeatureItem() {
    this.layoutDetails.feature_list.push(this.getDefaultFeatureListItem());
  }

  addIconCardItem() {
    this.layoutDetails.icon_card_list.push(this.getDefaultIconCardItem(this.layoutDetails.icon_card_list.length + 1));
  }

  addHighlightPoint() {
    this.layoutDetails.highlight_points.push(this.getDefaultHighlightPoint(this.layoutDetails.highlight_points.length + 1));
  }

  addFounderFaqItem() {
    this.layoutDetails.founder_faq_list.push(this.getDefaultFounderFaqItem(this.layoutDetails.founder_faq_list.length + 1));
  }

  addChecklistItem() {
    this.layoutDetails.checklist_items.push(this.getDefaultChecklistItem(this.layoutDetails.checklist_items.length + 1));
  }

  getDefaultFeatureCard() {
    return {
      icon_name: '',
      name: '',
      detail: ''
    };
  }

  normalizeFeatureCards(features: any[] = []) {
    return (Array.isArray(features) ? features : []).map(item => ({
      ...this.getDefaultFeatureCard(),
      ...item
    }));
  }

  getDefaultFeatureListItem() {
    return {
      image: '',
      heading: '',
      sub_heading: '',
      description: '',
      features: [this.getDefaultFeatureCard()],
      btn_status: false,
      btn_text: '',
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_link_type: 'internal',
      btn_link: ''
    };
  }

  normalizeFeatureListItems(items: any[] = []) {
    return (Array.isArray(items) ? items : []).map(item => ({
      ...this.getDefaultFeatureListItem(),
      ...item,
      features: this.normalizeFeatureCards(item?.features)
    }));
  }

  getDefaultIconCardItem(rank = 1) {
    return {
      rank,
      icon_name: '',
      heading: '',
      description: '',
      btn_status: false,
      btn_text: '',
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_link_type: 'internal',
      btn_link: '',
      active_status: true
    };
  }

  normalizeIconCardList(items: any[] = []) {
    return (Array.isArray(items) ? items : []).map((item, index) => ({
      ...this.getDefaultIconCardItem(index + 1),
      ...item,
      rank: Number(item?.rank) > 0 ? Number(item.rank) : index + 1
    })).sort((a, b) => a.rank - b.rank)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }

  getDefaultFooterBanner() {
    return {
      icon_name: '',
      heading: '',
      description: ''
    };
  }

  getDefaultFounderIntro() {
    return {
      image: '',
      img_alt: '',
      badge_text: '',
      heading: '',
      sub_heading: '',
      description: ''
    };
  }

  getDefaultHighlightPoint(rank = 1) {
    return {
      rank,
      text: ''
    };
  }

  normalizeHighlightPoints(items: any[] = []) {
    return (Array.isArray(items) ? items : []).map((item, index) => ({
      ...this.getDefaultHighlightPoint(index + 1),
      ...item,
      rank: Number(item?.rank) > 0 ? Number(item.rank) : index + 1
    })).sort((a, b) => a.rank - b.rank)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }

  getDefaultFounderFaqItem(rank = 1) {
    return {
      rank,
      question: '',
      answer: '',
      btn_status: false,
      btn_text: '',
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_link_type: 'internal',
      btn_link: '',
      active_status: true
    };
  }

  normalizeFounderFaqList(items: any[] = []) {
    return (Array.isArray(items) ? items : []).map((item, index) => ({
      ...this.getDefaultFounderFaqItem(index + 1),
      ...item,
      rank: Number(item?.rank) > 0 ? Number(item.rank) : index + 1
    })).sort((a, b) => a.rank - b.rank)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }

  getDefaultContentSplitIntro() {
    return {
      label: '',
      heading: '',
      highlighted_text: '',
      description: ''
    };
  }

  getDefaultChecklistConfig() {
    return {
      heading: ''
    };
  }

  getDefaultChecklistItem(rank = 1) {
    return {
      rank,
      icon_name: '',
      heading: '',
      description: '',
      active_status: true
    };
  }

  normalizeChecklistItems(items: any[] = []) {
    return (Array.isArray(items) ? items : []).map((item, index) => ({
      ...this.getDefaultChecklistItem(index + 1),
      ...item,
      rank: Number(item?.rank) > 0 ? Number(item.rank) : index + 1
    })).sort((a, b) => a.rank - b.rank)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }

  addLocationCard() {
    this.layoutDetails.card_list.push({ image: '', heading: '', sub_heading: '', description: '' });
  }

  addInternalLinkGroup() {
    this.layoutDetails.group_list.push(this.getDefaultInternalLinkGroup());
    this.syncInternalLinkGroupRanks();
  }

  removeInternalLinkGroup(groupIndex) {
    this.layoutDetails.group_list.splice(groupIndex, 1);
    this.syncInternalLinkGroupRanks();
  }

  addInternalLinkItem(groupIndex) {
    this.layoutDetails.group_list[groupIndex].link_list.push(this.getDefaultInternalLinkItem());
  }

  onInternalLinkGroupRankChange() {
    this.syncInternalLinkGroupRanks(true);
  }

  getDefaultCtaItem() {
    return {
      heading: '',
      sub_heading: '',
      description: '',
      btn_status: false,
      btn_text: '',
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_link_type: 'internal',
      btn_link: ''
    };
  }

  normalizeCtaList(ctaList: any[] = []) {
    return ctaList.map(item => ({
      ...this.getDefaultCtaItem(),
      ...item
    }));
  }

  getDefaultInternalLinkItem() {
    return {
      btn_status: true,
      btn_style: 'primary',
      btn_text_color: 'light',
      btn_text: '',
      btn_link_type: 'internal',
      btn_link: ''
    };
  }

  getDefaultInternalLinkGroup() {
    return {
      rank: 1,
      icon_name: '',
      heading: '',
      sub_heading: '',
      description: '',
      link_list: [this.getDefaultInternalLinkItem()]
    };
  }

  normalizeInternalLinkGroups(groupList: any[] = [], ctaList: any[] = []) {
    const sourceGroups = groupList?.length ? groupList : (ctaList?.length ? [{
      icon_name: '',
      heading: '',
      sub_heading: '',
      description: '',
      link_list: ctaList
    }] : []);

    return sourceGroups.map(group => ({
      rank: Number(group?.rank) > 0 ? Number(group.rank) : 1,
      icon_name: group?.icon_name || '',
      heading: group?.heading || '',
      sub_heading: group?.sub_heading || '',
      description: group?.description || '',
      link_list: (group?.link_list?.length ? group.link_list : [this.getDefaultInternalLinkItem()]).map(item => ({
        ...this.getDefaultInternalLinkItem(),
        ...item
      }))
    })).sort((a, b) => a.rank - b.rank)
      .map((group, index) => ({
        ...group,
        rank: index + 1
      }));
  }

  syncInternalLinkGroupRanks(sortByRank = false) {
    if (!Array.isArray(this.layoutDetails.group_list)) {
      this.layoutDetails.group_list = [];
      return;
    }

    this.layoutDetails.group_list = this.layoutDetails.group_list.map((group, index) => ({
      ...group,
      rank: Number(group?.rank) > 0 ? Number(group.rank) : index + 1
    }));

    if (sortByRank) {
      this.layoutDetails.group_list.sort((a, b) => a.rank - b.rank);
    }

    this.layoutDetails.group_list = this.layoutDetails.group_list.map((group, index) => ({
      ...group,
      rank: index + 1
    }));
  }

  async onUpdateLayout() {
    this.btnLoader = true;
    let layoutData = structuredClone(this.layoutDetails);

    this.fileList = new FormData();

    if (this.layoutDetails.type === 'founder_faq_grid' && this.layoutDetails.founder_intro) {
      layoutData.founder_intro = { ...layoutData.founder_intro };
      delete layoutData.founder_intro.temp_image;
      if (this.layoutDetails.founder_intro_image_change && this.layoutDetails.founder_intro.image instanceof File) {
        delete layoutData.founder_intro.image;
        layoutData.founder_intro_image_change = true;
        this.fileList.append('attachments', this.layoutDetails.founder_intro.image, 'founder_intro_image');
      } else {
        delete layoutData.founder_intro_image_change;
      }
    }

    // Handle cover image for featured_cards, hero_cta, image_icon_grid_split
    if (this.layoutDetails.cover_img_change && this.layoutDetails.cover_img) {
      delete layoutData.cover_img;
      const coverFieldName = this.layoutDetails.type === 'image_icon_grid_split' ? 'iigs_cover' : 'fc_cover';
      this.fileList.append('attachments', this.layoutDetails.cover_img, coverFieldName);
    }

    if (layoutData.type === 'image_icon_grid_split') {
      layoutData.footer_banner = { ...this.getDefaultFooterBanner(), ...(layoutData.footer_banner || {}) };
      layoutData.icon_card_list = this.normalizeIconCardList(layoutData.icon_card_list);
    }

    let imageList = this.layoutDetails.image_list || [];
    let textList = this.layoutDetails.text_list || [];
    let featureList = this.layoutDetails.feature_list || [];
    let cardList = this.layoutDetails.card_list || [];
    let iconCardList = this.layoutDetails.icon_card_list || [];
    let highlightPoints = this.layoutDetails.highlight_points || [];
    let founderFaqList = this.layoutDetails.founder_faq_list || [];
    let checklistItems = this.layoutDetails.checklist_items || [];

    this.onSetFormData(imageList).then((imgList: any[]) => {
      layoutData.image_list = imgList;
        this.onSetTextFormData(textList).then((txtList: any[]) => {
          layoutData.text_list = txtList;
          this.onSetTextFormData(featureList).then((ftList: any[]) => {
            layoutData.feature_list = ftList;
            this.onSetTextFormData(cardList).then((cdList: any[]) => {
              layoutData.card_list = cdList;
              this.onSetTextFormData(iconCardList).then((icList: any[]) => {
                layoutData.icon_card_list = icList;
                this.onSetTextFormData(highlightPoints).then((hpList: any[]) => {
                  layoutData.highlight_points = hpList;
                  this.onSetTextFormData(founderFaqList).then((ffList: any[]) => {
                    layoutData.founder_faq_list = ffList;
                    this.onSetTextFormData(checklistItems).then((ciList: any[]) => {
                      layoutData.checklist_items = ciList;
                      if (layoutData.type === 'internal_links') {
                        layoutData.group_list = this.normalizeInternalLinkGroups(layoutData.group_list, layoutData.cta_list);
                        delete layoutData.cta_list;
                      }
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
              });
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
        if (this.layoutDetails.type === 'highlighted_section') {
          objData.gallery_images = this.normalizeHighlightedGalleryImages(imgData.gallery_images).map((galleryData, galleryIndex) => {
            let galleryObj = Object.assign({}, galleryData);
            delete galleryObj.temp_img;
            if (galleryData.image && galleryData.image instanceof File) {
              delete galleryObj.image;
              this.fileList.append('attachments', galleryData['image'], `hg_${i}_${galleryIndex}`);
            }
            return galleryObj;
          });
        }
        if (imgData.desktop_img_change || imgData.desktop_img instanceof File) {
          delete objData.desktop_img;
          this.fileList.append('attachments', imgData['desktop_img'], i + '_d');
        }
        if (imgData.mobile_img_change || imgData.mobile_img instanceof File) {
          delete objData.mobile_img;
          this.fileList.append('attachments', imgData['mobile_img'], i + '_m');
        }
        delete objData.desktop_img_change;
        delete objData.mobile_img_change;
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

  fileChangeListener(devType, index, event, subIndex = null) {
    if (devType === 'desktop') delete this.layoutDetails.image_list[index]?.d_err_msg;
    else if (devType === 'mobile') delete this.layoutDetails.image_list[index]?.m_err_msg;
    else if (devType === 'fc_cover' || devType === 'iigs_cover') { /* no err_msg for cover */ }
    else if (devType === 'founder_intro') delete this.layoutDetails.founder_intro?.err_msg;
    else if (devType === 'highlighted_gallery') delete this.layoutDetails.image_list[index]?.gallery_images?.[subIndex]?.err_msg;
    else if (devType === 'feature') delete this.layoutDetails.feature_list[index]?.c_err_msg;
    else if (devType === 'location_card') delete this.layoutDetails.card_list[index]?.c_err_msg;
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
          } else if (devType === 'highlighted_gallery') {
            if (fileInKB <= this.fileLimitInKB) {
              this.layoutDetails.image_list[index].gallery_images[subIndex].temp_img = (<FileReader>e.target).result;
              this.layoutDetails.image_list[index].gallery_images[subIndex].image = fileData;
            } else { this.layoutDetails.image_list[index].gallery_images[subIndex].err_msg = true; }
          } else if (devType === 'fc_cover' || devType === 'iigs_cover') {
            if (fileInKB <= this.fileLimitInKB) {
              this.layoutDetails.temp_cover_img = (<FileReader>e.target).result;
              this.layoutDetails.cover_img = fileData;
              this.layoutDetails.cover_img_change = true;
            } else { this.layoutDetails.cover_img_err = true; }
          } else if (devType === 'founder_intro') {
            if (fileInKB <= this.fileLimitInKB) {
              this.layoutDetails.founder_intro.temp_image = (<FileReader>e.target).result;
              this.layoutDetails.founder_intro.image = fileData;
              this.layoutDetails.founder_intro_image_change = true;
            } else { this.layoutDetails.founder_intro.err_msg = true; }
          } else if (devType === 'feature') {
            if (fileInKB <= this.fileLimitInKB) {
              this.layoutDetails.feature_list[index].temp_img = (<FileReader>e.target).result;
              this.layoutDetails.feature_list[index].image = fileData;
              this.layoutDetails.feature_list[index].img_change = true;
            } else { this.layoutDetails.feature_list[index].c_err_msg = true; }
          } else if (devType === 'location_card') {
            if (fileInKB <= this.fileLimitInKB) {
              this.layoutDetails.card_list[index].temp_img = (<FileReader>e.target).result;
              this.layoutDetails.card_list[index].image = fileData;
              this.layoutDetails.card_list[index].img_change = true;
            } else { this.layoutDetails.card_list[index].c_err_msg = true; }
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
