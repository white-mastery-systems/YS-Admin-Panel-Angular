import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { FeaturesApiService } from '../../features-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';
import { AnchorHeaderTool, ButtonTool, CtaBlockTool, IframeTool, ImageCardsTool, KeyFeaturesTool, ProductCarouselTool, ProductCtaTool, TableOfContentsTool } from './editorjs-tools';

@Component({
  selector: 'app-blog-event',
  templateUrl: './blog-event.component.html',
  styleUrls: ['./blog-event.component.scss']
})

export class BlogEventComponent implements OnInit, AfterViewChecked, OnDestroy {

  pageLoader: boolean;
  blogForm: any = {};
  currentDate: Date = new Date();
  imgBaseUrl = environment.img_baseurl;
  categoryList: any = [];
  authorList: any = [];
  selectedAuthor: any = null;
  isAdvanced: boolean;
  isLegacyBlog: boolean;
  editor: any;
  editorReady = false;
  pendingEditorInit = false;
  readonly pageTitleMaxLength = 120;

  constructor(
    private router: Router, private activeRoute: ActivatedRoute, private api: FeaturesApiService, public commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.isAdvanced = false;
      this.isLegacyBlog = false;
      if(this.router.url.includes('/setting/advanced-blogs/')) {
        this.isAdvanced = true;
      }
      this.commonService.redirect = "/setting/blogs";
      this.commonService.secondary_header = "Add Blog";
      if(this.isAdvanced) {
        this.commonService.redirect = "/setting/advanced-blogs";
        this.commonService.secondary_header = "Add Advanced Blog";
      }
      this.destroyEditor();
      this.editorReady = false;
      this.pendingEditorInit = false;
      this.blogForm = {
        form_type: 'add', created_on: this.currentDate, seo_details: {}, faqs: [], category_id: [],
        tags_list: [], published: false, content: this.getDefaultContent(), editor_type: 'advanced', description: '',
        eyebrow_heading: ''
      };
      if(params.id!='add') {
        this.pageLoader = true;
        this.commonService.secondary_header = "Update Blog";
        if(this.isAdvanced) this.commonService.secondary_header = "Update Advanced Blog";
        const reqCall = this.isAdvanced ? this.api.BLOG_DETAILS(params.id) : this.api.BLOG_DETAILS_BY_SLUG(params.id);
        reqCall.subscribe(result => {
          if(result.status) {
            this.blogForm = result.data;
            this.blogForm.form_type = 'edit';
            this.blogForm.editor_type = this.normalizeEditorType(this.blogForm.editor_type);
            this.setEditorMode(this.blogForm.editor_type);
            this.blogForm.created_on = new Date(this.blogForm.created_on);
            if(this.blogForm.image) this.blogForm.image = this.normalizeAssetPath(this.blogForm.image);
            if(this.blogForm.thumbnail) this.blogForm.thumbnail = this.normalizeAssetPath(this.blogForm.thumbnail);
            if(this.blogForm.coverImage) this.blogForm.coverImage = this.normalizeAssetPath(this.blogForm.coverImage);
            if(this.blogForm.authorAvatar) this.blogForm.authorAvatar = this.normalizeAssetPath(this.blogForm.authorAvatar);
            if(!this.blogForm.seo_details) this.blogForm.seo_details = {};
            this.blogForm.seo_details.meta_keyword_list = [];
            if(this.blogForm.seo_details.meta_keywords?.length) {
              this.blogForm.seo_details.meta_keywords.forEach(obj => {
              this.blogForm.seo_details.meta_keyword_list.push({display: obj, value: obj});
              });
            }
            if(this.blogForm.faqs?.length) this.blogForm.faq_status = true;
            if(!this.isAdvanced) {
              this.blogForm.tags_list = (this.blogForm.tags || []).map((tag) => ({ display: tag, value: tag }));
              if(this.isEditorJsMode()) {
                this.blogForm.content = this.prepareEditorContentForView(this.blogForm.content || this.getDefaultContent());
              }
              this.syncSelectedAuthor();
            }
          }
          else console.log("response", result);
          setTimeout(() => {
            this.pageLoader = false;
            if(!this.isAdvanced && this.isEditorJsMode()) this.pendingEditorInit = true;
          }, 500);
        });
      }
      else if(!this.isAdvanced) {
        this.pendingEditorInit = this.isEditorJsMode();
      }
      this.getCatalog();
      this.getAuthors();
    });
  }

  async onSubmit() {
    this.blogForm.submit = true;
    this.blogForm.seo_status = true;
    this.blogForm.seo_details.meta_keywords = [];
    if(this.blogForm.seo_details?.meta_keyword_list) {
      this.blogForm.seo_details.meta_keyword_list.forEach(obj => {
        this.blogForm.seo_details.meta_keywords.push(obj.value);
      });
    }
    if(!this.blogForm.faq_status) {
      this.blogForm.faq_title = ''; this.blogForm.faqs = [];
    }
    // category list
    this.blogForm.category_id = []; 
    this.categoryList.forEach(element => {
      if(element.selected) {
        this.blogForm.category_id.push(element._id);
      }
    });
    this.blogForm.type = "basic";
    if(this.isAdvanced) this.blogForm.type = "advanced";
    if(!this.isAdvanced && this.isEditorJsMode()) {
      let content = this.getDefaultContent();
      if(!this.editor) {
        this.blogForm.submit = false;
        this.blogForm.errorMsg = 'Editor is not ready';
        return;
      }
      try {
        content = await this.editor.save();
        content = this.finalizeEditorContent(content);
        const invalidCarouselBlock = this.getInvalidProductCarouselBlockIndex(content);
        if(invalidCarouselBlock !== -1) {
          this.blogForm.submit = false;
          this.blogForm.errorMsg = `Please select one catalog in Product Carousel block #${invalidCarouselBlock + 1}`;
          return;
        }
        const invalidIframeBlock = this.getInvalidIframeBlockIndex(content);
        if(invalidIframeBlock !== -1) {
          this.blogForm.submit = false;
          this.blogForm.errorMsg = `Please enter a valid HTTPS embed URL in Iframe block #${invalidIframeBlock + 1}`;
          return;
        }
      }
      catch (error) {
        this.blogForm.submit = false;
        this.blogForm.errorMsg = 'Unable to read editor content';
        return;
      }
      const payload: any = {
        editor_type: 'advanced',
        slug: this.blogForm.seo_details?.page_url || this.commonService.urlFormat(this.blogForm.name || ''),
        title: this.blogForm.name,
        eyebrow_heading: (this.blogForm.eyebrow_heading || '').trim(),
        author_id: this.blogForm.author_id || null,
        author: this.blogForm.author,
        createdOn: this.blogForm.created_on,
        coverImage: this.blogForm.image || '',
        thumbnail: this.blogForm.thumbnail || '',
        imageAlt: this.blogForm.img_alt || '',
        authorAvatar: this.blogForm.authorAvatar || '',
        authorRole: this.blogForm.authorRole || '',
        authorBio: this.blogForm.authorBio || '',
        authorLink: this.blogForm.authorLink || '',
        readTime: this.blogForm.readTime || '',
        tags: (this.blogForm.tags_list || []).map((obj) => obj.value),
        published: !!this.blogForm.published,
        content,
        seo_status: true,
        seo_details: this.blogForm.seo_details,
        faq_title: this.blogForm.faq_title,
        faqs: this.blogForm.faqs,
        category_id: this.blogForm.category_id
      };
      if(this.blogForm.form_type === 'edit' && this.blogForm._id) {
        payload._id = this.blogForm._id;
      }
      const reqCall = this.blogForm.form_type === 'edit' ? this.api.UPDATE_BLOG(payload) : this.api.ADD_BLOG(payload);
      reqCall.subscribe(result => {
        this.blogForm.submit = false;
        if(result.status) this.router.navigate([this.commonService.redirect]);
        else {
          this.blogForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else if(!this.isAdvanced) {
      this.blogForm.tags = (this.blogForm.tags_list || []).map((obj) => obj.value);
      this.blogForm.type = "basic";
      this.blogForm.editor_type = 'basic';
      this.blogForm.status = this.blogForm.published ? 'enabled' : 'disabled';
      if(!this.isLegacyBlog) this.applySelectedAuthorToForm();
      const reqCall = this.blogForm.form_type=='add' ? this.api.ADD_BLOG(this.blogForm) : this.api.UPDATE_BLOG(this.blogForm);
      reqCall.subscribe(result => {
        this.blogForm.submit = false;
        if(result.status) this.router.navigate([this.commonService.redirect]);
        else {
          this.blogForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else if(this.blogForm.form_type=='add') {
      this.api.ADD_BLOG(this.blogForm).subscribe(result => {
        this.blogForm.submit = false;
        if(result.status) this.router.navigate([this.commonService.redirect]);
        else {
          this.blogForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
    else {
      this.api.UPDATE_BLOG(this.blogForm).subscribe(result => {
        this.blogForm.submit = false;
        if(result.status) this.router.navigate([this.commonService.redirect]);
        else {
          this.blogForm.errorMsg = result.message;
          console.log("response", result);
        }
      });
    }
  }

  getCatalog() {
    if(this.commonService.blog_catalog_list?.length) {
      this.onSetcatId();
    }
    else {
      this.api.BLOG_CATALOG_LIST().subscribe((result) => {
        if(result.status) {
          this.commonService.blog_catalog_list = result.list.sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
          this.commonService.updateLocalData('blog_catalog_list', this.commonService.blog_catalog_list);
          this.onSetcatId();
        }
      })
    }
  }
  getAuthors() {
    if(this.commonService.blog_author_list?.length) {
      this.authorList = this.commonService.blog_author_list;
      this.syncSelectedAuthor();
      return;
    }

    this.api.BLOG_AUTHOR_LIST().subscribe((result) => {
      if(result.status) {
        this.authorList = (result.list || []).sort((a, b) => 0 - (a.name > b.name ? -1 : 1));
        this.commonService.blog_author_list = this.authorList;
        this.commonService.updateLocalData('blog_author_list', this.commonService.blog_author_list);
        this.syncSelectedAuthor();
      }
    });
  }
  onSetcatId() {
    this.categoryList = this.commonService?.blog_catalog_list;
    this.categoryList.forEach(element => {
      element.selected = false;
      if(this.blogForm?.category_id?.length && this.blogForm?.category_id.findIndex(x => x == element._id)!=-1) element.selected = true;
    });
  }
  onAuthorChange() {
    this.syncSelectedAuthor();
    if(!this.isEditorJsMode()) this.applySelectedAuthorToForm();
  }
  syncSelectedAuthor() {
    if(!this.blogForm?.author_id || !this.authorList?.length) {
      this.selectedAuthor = null;
      return;
    }
    this.selectedAuthor = this.authorList.find((author) => author._id === this.blogForm.author_id) || null;
  }
  onChangeTitle() {
    if(this.blogForm.form_type=='add') {
      this.blogForm.seo_details.page_url = this.commonService.urlFormat(this.blogForm.name);
      let tempName = this.blogForm.name.substring(0, 70);
      this.blogForm.seo_details.h1_tag = tempName;
      this.blogForm.seo_details.page_title = ('Blogs - ' + this.blogForm.name).substring(0, this.pageTitleMaxLength);
    }
  }
  onChangeDesc() {
    if(this.blogForm.form_type=='add')
      this.blogForm.seo_details.meta_desc = this.commonService.stripHtml(this.blogForm.description).substring(0, 320);
  }

  onEditorTypeChange() {
    this.blogForm.editor_type = this.normalizeEditorType(this.blogForm.editor_type);
    this.setEditorMode(this.blogForm.editor_type || 'advanced');
    this.destroyEditor();
    this.pendingEditorInit = false;
    if(this.isEditorJsMode()) {
      if(!this.blogForm.content) this.blogForm.content = this.getDefaultContent();
      setTimeout(() => {
        if(!this.pageLoader) this.pendingEditorInit = true;
      }, 0);
    }
    else {
      this.applySelectedAuthorToForm();
    }
  }

  thumbnailChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/webp"].indexOf(inFile.type) != -1) {
      if(!this.isAdvanced && this.isEditorJsMode()) {
        const formData = new FormData();
        formData.append('image', inFile);
        this.blogForm.thumbnailLoader = true;
        this.api.BLOG_UPLOAD_IMAGE(formData).subscribe(result => {
          this.blogForm.thumbnailLoader = false;
          if(result.status && result.path) {
            this.blogForm.thumbnail = result.path;
            this.blogForm.thumbnail_change = false;
          }
          else this.blogForm.errorMsg = result.message || 'Unable to upload thumbnail';
        });
        return;
      }
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.blogForm.thumbnail = (<FileReader>event.target).result;
        this.blogForm.thumbnail_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/webp"].indexOf(inFile.type) != -1) {
      if(!this.isAdvanced && this.isEditorJsMode()) {
        const formData = new FormData();
        formData.append('image', inFile);
        this.blogForm.coverLoader = true;
        this.api.BLOG_UPLOAD_IMAGE(formData).subscribe(result => {
          this.blogForm.coverLoader = false;
          if(result.status && result.path) {
            this.blogForm.image = result.path;
            this.blogForm.img_change = false;
          }
          else this.blogForm.errorMsg = result.message || 'Unable to upload image';
        });
        return;
      }
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.blogForm.image = (<FileReader>event.target).result;
        this.blogForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

  authorAvatarChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png", "image/webp"].indexOf(inFile.type) != -1) {
        const formData = new FormData();
        formData.append('image', inFile);
        this.blogForm.avatarLoader = true;
        this.api.BLOG_UPLOAD_IMAGE(formData).subscribe(result => {
          this.blogForm.avatarLoader = false;
          if(result.status && result.path) this.blogForm.authorAvatar = result.path;
          else this.blogForm.errorMsg = result.message || 'Unable to upload image';
        });
      }
    }
  }

  getDefaultContent() {
    return {
      time: Date.now(),
      version: '2.29.1',
      blocks: []
    };
  }

  ngAfterViewChecked(): void {
    if(this.pendingEditorInit && !this.pageLoader && !this.isAdvanced && this.isEditorJsMode()) {
      this.pendingEditorInit = false;
      this.initializeEditor();
    }
  }

  async initializeEditor() {
    const holder = document.getElementById('blog-editorjs-holder');
    if(!holder) {
      this.pendingEditorInit = true;
      return;
    }
    this.destroyEditor();
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const List = (await import('@editorjs/list')).default;
    const Table = (await import('@editorjs/table')).default;
    const ImageTool = (await import('@editorjs/image')).default;

    this.editor = new EditorJS({
      holder: 'blog-editorjs-holder',
      minHeight: 240,
      data: this.blogForm.content || this.getDefaultContent(),
      tools: {
        header: {
          class: AnchorHeaderTool as any
        },
        list: {
          class: List as any,
          inlineToolbar: true
        },
        table: {
          class: Table as any,
          inlineToolbar: true
        },
        tableOfContents: {
          class: TableOfContentsTool as any
        },
        button: {
          class: ButtonTool as any
        },
        ctaBlock: {
          class: CtaBlockTool as any
        },
        keyFeatures: {
          class: KeyFeaturesTool as any
        },
        productCarousel: {
          class: ProductCarouselTool as any,
          config: {
            catalogs: (this.commonService.catalog_list || []).map((catalog) => ({
              _id: catalog._id,
              name: catalog.name
            }))
          }
        },
        productCta: {
          class: ProductCtaTool as any,
          config: {
            uploadImage: async(file: File) => this.uploadEditorImage(file)
          }
        },
        image: {
          class: ImageTool as any,
          config: {
            uploader: {
              uploadByFile: async(file: File) => this.uploadEditorImageResult(file)
            }
          }
        },
        iframe: {
          class: IframeTool as any
        },
        imageCards: {
          class: ImageCardsTool as any,
          config: {
            uploadImage: async(file: File) => this.uploadEditorImage(file),
            resolveImageUrl: (path: string) => this.toAbsoluteAssetUrl(path)
          }
        }
      },
      onReady: () => {
        this.editorReady = true;
      }
    });
  }

  destroyEditor() {
    if(this.editor && typeof this.editor.destroy === 'function') {
      this.editor.destroy();
    }
    this.editor = null;
    this.editorReady = false;
  }

  ngOnDestroy(): void {
    this.destroyEditor();
  }

  private async uploadEditorImage(file: File) {
    const result = await this.uploadEditorImageResult(file);
    if(result?.file?.url) return result.file.url;
    throw new Error(result?.message || 'Upload failed');
  }

  private async uploadEditorImageResult(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    const result = await firstValueFrom(this.api.BLOG_UPLOAD_IMAGE(formData));
    if(result?.success === 1 && (result?.file?.url || result?.path)) {
      const path = (result?.file?.path || result?.path || '').replace(/^\/+/, '');
      const publicUrl = path ? `${this.imgBaseUrl}${path}` : result?.file?.url;
      return {
        ...result,
        url: publicUrl,
        file: {
          ...(result.file || {}),
          path: result?.file?.path || result?.path || '',
          url: publicUrl
        }
      };
    }
    throw new Error(result?.message || 'Upload failed');
  }

  private finalizeEditorContent(content: any) {
    const normalized = content && typeof content === 'object' ? content : this.getDefaultContent();
    const blocks = Array.isArray(normalized.blocks) ? normalized.blocks : [];
    blocks.forEach((block) => {
      if(block?.type !== 'header') return;
      block.data = block.data || {};
      block.data.text = (block.data.text || '').trim();
      block.data.level = Number(block.data.level || 2);
      block.data.anchor = block.data.level === 2 ? (block.data.anchor || '').trim().replace(/^#/, '') : '';
    });

    blocks.forEach((block) => {
      if(block?.type !== 'tableOfContents' || !Array.isArray(block?.data?.items)) return;
      block.data.items = block.data.items.map((item) => ({
        ...item,
        number: (item?.number || '').trim(),
        text: (item?.text || '').trim(),
        anchor: item?.anchor ? `#${String(item.anchor).trim().replace(/^#/, '')}` : ''
      })).filter((item) => item.text || item.anchor || item.number);
    });

    blocks.forEach((block) => {
      if(block?.type !== 'keyFeatures') return;
      block.data = block.data || {};
      block.data.title = (block.data.title || '').trim() || 'Key features to check before booking:';
      block.data.features = Array.isArray(block.data.features)
        ? block.data.features.map((feature) => (typeof feature === 'string' ? feature.trim() : '')).filter((feature) => !!feature)
        : [];
    });

    blocks.forEach((block) => {
      if(block?.type !== 'iframe') return;
      block.data = block.data || {};
      block.data.url = (block.data.url || '').trim();
      delete block.data.height;
    });

    blocks.forEach((block) => {
      if(block?.type !== 'productCarousel') return;
      block.data = block.data || {};
      block.data.title = (block.data.title || '').trim();
      block.data.subtitle = (block.data.subtitle || '').trim();
      block.data.category_id = (block.data.category_id || '').trim();
      const parsedLimit = Number(block.data.productLimit || 0);
      block.data.productLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 8;
      block.data.buttonLabel = (block.data.buttonLabel || '').trim();
      block.data.buttonLink = this.normalizeCarouselButtonLink(block.data.buttonLink);
      delete block.data.products;
    });

    blocks.forEach((block) => {
      if(block?.type !== 'imageCards') return;
      block.data = block.data || {};
      block.data.heading = (block.data.heading || '').trim();
      block.data.sub_heading = (block.data.sub_heading || '').trim();
      block.data.cards = Array.isArray(block.data.cards)
        ? block.data.cards.map((card, index) => ({
          rank: index + 1,
          image: (card?.image || '').trim(),
          sub_heading: (card?.sub_heading || '').trim(),
          heading: (card?.heading || '').trim(),
          options: Array.isArray(card?.options)
            ? card.options.map((option) => (typeof option === 'string' ? option.trim() : '')).filter((option) => !!option)
            : [],
          text_color: card?.text_color === 'dark' ? 'dark' : 'light',
          buttons: Array.isArray(card?.buttons)
            ? card.buttons.map((button) => ({
              label: (button?.label || '').trim(),
              link_type: this.normalizeImageCardButtonLinkType(button?.link_type),
              link: this.normalizeImageCardButtonLink(button?.link, button?.link_type)
            })).filter((button) => button.label || button.link)
            : []
        })).filter((card) => (
          card.image || card.sub_heading || card.heading || card.options.length || card.buttons.length
        ))
        : [];
    });

    return {
      time: normalized.time || Date.now(),
      version: normalized.version || '2.29.1',
      blocks
    };
  }

  private getInvalidProductCarouselBlockIndex(content: any) {
    const blocks = Array.isArray(content?.blocks) ? content.blocks : [];
    return blocks.findIndex((block) => block?.type === 'productCarousel' && !(block?.data?.category_id || '').trim());
  }

  private getInvalidIframeBlockIndex(content: any) {
    const blocks = Array.isArray(content?.blocks) ? content.blocks : [];
    return blocks.findIndex((block) => {
      if(block?.type !== 'iframe') return false;
      const url = (block?.data?.url || '').trim();
      return !url || !/^https:\/\//i.test(url);
    });
  }

  private normalizeImageCardButtonLinkType(value?: string) {
    if (value === 'external_link' || value === 'external') return 'external_link';
    return 'internal_link';
  }

  private normalizeImageCardButtonLink(link?: string, linkType?: string) {
    const trimmed = (link || '').trim();
    if (!trimmed) return '';
    if (this.normalizeImageCardButtonLinkType(linkType) === 'external_link') return trimmed;
    return trimmed.startsWith('/') ? trimmed : `/${trimmed.replace(/^\/+/, '')}`;
  }

  private normalizeCarouselButtonLink(link?: string) {
    const trimmed = (link || '').trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return trimmed.startsWith('/') ? trimmed : `/${trimmed.replace(/^\/+/, '')}`;
  }

  private prepareEditorContentForView(content: any) {
    const normalized = content && typeof content === 'object' ? JSON.parse(JSON.stringify(content)) : this.getDefaultContent();
    const blocks = Array.isArray(normalized.blocks) ? normalized.blocks : [];

    blocks.forEach((block) => {
      if(block?.type === 'image' && block?.data?.file) {
        if(block.data.file.path) block.data.file.path = this.toAbsoluteAssetUrl(block.data.file.path);
        if(block.data.file.url) block.data.file.url = this.toAbsoluteAssetUrl(block.data.file.url);
      }

      if(block?.type === 'productCta' && block?.data?.productImage) {
        block.data.productImage = this.toAbsoluteAssetUrl(block.data.productImage);
      }

      if(block?.type === 'productCarousel' && Array.isArray(block?.data?.products)) {
        block.data.products = block.data.products.map((item) => ({
          ...item,
          image: item?.image ? this.toAbsoluteAssetUrl(item.image) : ''
        }));
      }

      if(block?.type === 'imageCards' && Array.isArray(block?.data?.cards)) {
        block.data.cards = block.data.cards.map((card) => ({
          ...card,
          image: card?.image ? this.toAbsoluteAssetUrl(card.image) : ''
        }));
      }
    });

    normalized.blocks = blocks;
    return normalized;
  }

  toAbsoluteAssetUrl(value: string) {
    const input = (value || '').trim();
    if(!input) return '';
    if(/^https?:\/\//i.test(input) || /^data:/i.test(input)) return input;
    const base = (this.imgBaseUrl || '').replace(/\/+$/, '');
    const path = input.replace(/^\/+/, '');
    return base ? `${base}/${path}` : `/${path}`;
  }

  private normalizeAssetPath(value: string) {
    const input = (value || '').trim();
    if(!input) return '';
    if(/^data:/i.test(input)) return input;
    if(/^https?:\/\//i.test(input)) {
      const match = input.match(/\/uploads\/.+$/i);
      return match ? match[0] : input;
    }
    if(input.startsWith('uploads/')) return `/${input}`;
    return input;
  }

  private setEditorMode(editorType: string) {
    this.isLegacyBlog = !this.isAdvanced && this.normalizeEditorType(editorType) === 'basic';
  }

  isEditorJsMode() {
    return !this.isAdvanced && !this.isLegacyBlog;
  }

  private normalizeEditorType(editorType: string) {
    return editorType === 'advanced' || editorType === 'editorjs' ? 'advanced' : 'basic';
  }

  private applySelectedAuthorToForm() {
    if(!this.selectedAuthor) return;
    this.blogForm.author_id = this.selectedAuthor._id;
    this.blogForm.author = this.selectedAuthor.name || '';
    this.blogForm.authorAvatar = this.normalizeAssetPath(this.selectedAuthor.avatar || '');
    this.blogForm.authorRole = this.selectedAuthor.role || '';
    this.blogForm.authorBio = this.selectedAuthor.bio || '';
    this.blogForm.authorLink = this.selectedAuthor.link || '';
  }

}
