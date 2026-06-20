type TocItem = {
  number?: string;
  text?: string;
  anchor?: string;
};

type TocData = {
  label?: string;
  items?: TocItem[];
};

type ButtonData = {
  label?: string;
  url?: string;
  style?: string;
  alignment?: string;
};

type ProductCtaData = {
  sectionLabel?: string;
  sectionSubtext?: string;
  productImage?: string;
  productName?: string;
  originalPrice?: string;
  salePrice?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

type CtaBlockButtonData = {
  label?: string;
  link?: string;
};

type CtaBlockData = {
  text?: string;
  primaryButton?: CtaBlockButtonData;
  secondaryButton?: CtaBlockButtonData;
};

type ProductCarouselData = {
  title?: string;
  subtitle?: string;
  category_id?: string;
  categoryLink?: string;
  productLimit?: number | string;
};

type KeyFeaturesData = {
  title?: string;
  features?: string[];
};

type HeadingData = {
  text?: string;
  level?: number;
  anchor?: string;
};

type IframeData = {
  url?: string;
};

type ImageCardButtonData = {
  label?: string;
  link?: string;
  link_type?: string;
};

type ImageCardItemData = {
  rank?: number;
  image?: string;
  sub_heading?: string;
  heading?: string;
  options?: string[];
  text_color?: string;
  buttons?: ImageCardButtonData[];
};

type ImageCardsData = {
  heading?: string;
  sub_heading?: string;
  cards?: ImageCardItemData[];
};

type ImageCardsToolConfig = {
  uploadImage?: UploadImageFn;
};

type UploadImageFn = (file: File) => Promise<string>;

function createField(labelText: string, input: HTMLElement): HTMLLabelElement {
  const label = document.createElement('label');
  label.className = 'editorjs-custom__field';

  const caption = document.createElement('span');
  caption.className = 'editorjs-custom__caption';
  caption.textContent = labelText;

  label.appendChild(caption);
  label.appendChild(input);
  return label;
}

function createInput(value = '', placeholder = ''): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'text';
  input.value = value;
  input.placeholder = placeholder;
  input.className = 'editorjs-custom__input';
  return input;
}

function createTextarea(value = '', placeholder = ''): HTMLTextAreaElement {
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.placeholder = placeholder;
  textarea.rows = 3;
  textarea.className = 'editorjs-custom__textarea';
  return textarea;
}

function createSelect(options: Array<{ label: string; value: string }>, selected = ''): HTMLSelectElement {
  const select = document.createElement('select');
  select.className = 'editorjs-custom__select';

  options.forEach((option) => {
    const el = document.createElement('option');
    el.value = option.value;
    el.textContent = option.label;
    if (option.value === selected) el.selected = true;
    select.appendChild(el);
  });

  return select;
}

function normalizeAnchor(anchor: string): string {
  const trimmed = (anchor || '').trim();
  if (!trimmed) return '';
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
}

function normalizeImageCardLinkType(value?: string): string {
  if (value === 'external_link' || value === 'external') return 'external_link';
  return 'internal_link';
}

function normalizeImageCardButtonLink(link?: string, linkType?: string): string {
  const trimmed = (link || '').trim();
  if (!trimmed) return '';
  if (normalizeImageCardLinkType(linkType) === 'external_link') return trimmed;
  return trimmed.startsWith('/') ? trimmed : `/${trimmed.replace(/^\/+/, '')}`;
}

export class TableOfContentsTool {
  private data: TocData;
  private wrapper: HTMLDivElement;
  private labelInput: HTMLInputElement;
  private itemsContainer: HTMLDivElement;

  static get toolbox() {
    return {
      title: 'TOC',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5H17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 10H17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 15H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
    };
  }

  constructor({ data }: { data: TocData }) {
    this.data = data || {};
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'editorjs-custom editorjs-custom--toc';

    this.labelInput = createInput(this.data.label || '', 'Section label');
    this.itemsContainer = document.createElement('div');
    this.itemsContainer.className = 'editorjs-custom__stack';

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'editorjs-custom__button editorjs-custom__button--ghost editorjs-custom__button--compact';
    addButton.textContent = 'Add TOC item';
    addButton.addEventListener('click', () => this.addItem());

    this.wrapper.appendChild(createField('Label', this.labelInput));
    this.wrapper.appendChild(this.itemsContainer);
    this.wrapper.appendChild(addButton);

    const items = Array.isArray(this.data.items) && this.data.items.length ? this.data.items : [{}];
    items.forEach((item) => this.addItem(item));

    return this.wrapper;
  }

  save() {
    const rows = Array.from(this.itemsContainer.querySelectorAll('.editorjs-custom__row'));
    const items = rows
      .map((row) => {
        const number = (row.querySelector('[data-key="number"]') as HTMLInputElement)?.value?.trim() || '';
        const text = (row.querySelector('[data-key="text"]') as HTMLInputElement)?.value?.trim() || '';
        const anchor = normalizeAnchor((row.querySelector('[data-key="anchor"]') as HTMLInputElement)?.value || '');
        return { number, text, anchor };
      })
      .filter((item) => item.text || item.anchor || item.number);

    return {
      label: this.labelInput.value.trim(),
      items
    };
  }

  private addItem(item: TocItem = {}) {
    const row = document.createElement('div');
    row.className = 'editorjs-custom__row';

    const numberInput = createInput(item.number || '', '01');
    numberInput.setAttribute('data-key', 'number');

    const textInput = createInput(item.text || '', 'Section text');
    textInput.setAttribute('data-key', 'text');

    const anchorInput = createInput(item.anchor || '', '#section-1');
    anchorInput.setAttribute('data-key', 'anchor');

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'editorjs-custom__button editorjs-custom__button--danger';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      if (this.itemsContainer.children.length > 1) row.remove();
    });

    row.appendChild(createField('No.', numberInput));
    row.appendChild(createField('Text', textInput));
    row.appendChild(createField('Anchor', anchorInput));
    row.appendChild(removeButton);

    this.itemsContainer.appendChild(row);
  }
}

export class AnchorHeaderTool {
  private data: HeadingData;
  private wrapper: HTMLDivElement;
  private textInput: HTMLInputElement;
  private levelSelect: HTMLSelectElement;
  private anchorInput: HTMLInputElement;

  static get toolbox() {
    return {
      title: 'Heading',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 4V16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 4V16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4 10H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
    };
  }

  constructor({ data }: { data: HeadingData }) {
    this.data = data || {};
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'editorjs-custom editorjs-custom--heading';

    this.textInput = createInput(this.data.text || '', 'Heading text');
    this.levelSelect = createSelect([
      { label: 'H2', value: '2' },
      { label: 'H3', value: '3' },
      { label: 'H4', value: '4' }
    ], String(this.data.level || 2));
    this.anchorInput = createInput(this.data.anchor || '', 'section-1');

    const grid = document.createElement('div');
    grid.className = 'editorjs-custom__grid editorjs-custom__grid--two';
    grid.appendChild(createField('Heading', this.textInput));
    grid.appendChild(createField('Level', this.levelSelect));

    const anchorField = createField('Anchor', this.anchorInput);
    const hint = document.createElement('small');
    hint.className = 'editorjs-custom__hint';
    hint.textContent = 'Use anchor only for H2 sections linked from the table of contents. Example: section-1';
    anchorField.appendChild(hint);

    this.wrapper.appendChild(grid);
    this.wrapper.appendChild(anchorField);
    return this.wrapper;
  }

  save() {
    const level = Number(this.levelSelect.value || 2);
    const anchor = (this.anchorInput.value || '').trim().replace(/^#/, '');

    return {
      text: this.textInput.value.trim(),
      level,
      anchor: level === 2 ? anchor : ''
    };
  }
}

export class ButtonTool {
  private data: ButtonData;
  private wrapper: HTMLDivElement;
  private labelInput: HTMLInputElement;
  private urlInput: HTMLInputElement;
  private styleSelect: HTMLSelectElement;
  private alignmentSelect: HTMLSelectElement;

  static get toolbox() {
    return {
      title: 'Button',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="5" width="14" height="10" rx="5" stroke="currentColor" stroke-width="1.8"/><path d="M7 10H13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
    };
  }

  constructor({ data }: { data: ButtonData }) {
    this.data = data || {};
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'editorjs-custom editorjs-custom--button';

    this.labelInput = createInput(this.data.label || '', 'Button label');
    this.urlInput = createInput(this.data.url || '', '/collection');
    this.styleSelect = createSelect([
      { label: 'Dark', value: 'dark' },
      { label: 'Light', value: 'light' },
      { label: 'Outline', value: 'outline' }
    ], this.data.style || 'dark');
    this.alignmentSelect = createSelect([
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' }
    ], this.data.alignment || 'left');

    const grid = document.createElement('div');
    grid.className = 'editorjs-custom__grid editorjs-custom__grid--two';
    grid.appendChild(createField('Label', this.labelInput));
    grid.appendChild(createField('URL', this.urlInput));
    grid.appendChild(createField('Style', this.styleSelect));
    grid.appendChild(createField('Alignment', this.alignmentSelect));

    this.wrapper.appendChild(grid);
    return this.wrapper;
  }

  save() {
    return {
      label: this.labelInput.value.trim(),
      url: this.urlInput.value.trim(),
      style: this.styleSelect.value,
      alignment: this.alignmentSelect.value
    };
  }
}

export class CtaBlockTool {
  private data: CtaBlockData;
  private wrapper: HTMLDivElement;
  private textInput: HTMLTextAreaElement;
  private primaryLabelInput: HTMLInputElement;
  private primaryLinkInput: HTMLInputElement;
  private secondaryLabelInput: HTMLInputElement;
  private secondaryLinkInput: HTMLInputElement;
  private previewText: HTMLParagraphElement;
  private previewPrimaryButton: HTMLAnchorElement;
  private previewSecondaryButton: HTMLAnchorElement;

  static get toolbox() {
    return {
      title: 'CTA Block',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="3.5" width="15" height="13" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M6 8H11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6 11.5H9.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><rect x="12.5" y="7.2" width="3.8" height="2.2" rx="1.1" stroke="currentColor" stroke-width="1.2"/><rect x="12.5" y="11" width="3.8" height="2.2" rx="1.1" stroke="currentColor" stroke-width="1.2"/></svg>'
    };
  }

  constructor({ data }: { data: CtaBlockData }) {
    this.data = data || {};
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'editorjs-custom editorjs-custom--cta-block';

    this.textInput = createTextarea(this.data.text || '', 'Take the next step-explore drapes that match this guide.');
    this.primaryLabelInput = createInput(this.data.primaryButton?.label || '', 'Explore Collection');
    this.primaryLinkInput = createInput(this.data.primaryButton?.link || '', '/collection');
    this.secondaryLabelInput = createInput(this.data.secondaryButton?.label || '', 'Jump to Shop');
    this.secondaryLinkInput = createInput(this.data.secondaryButton?.link || '', '/shop');

    const previewWrap = document.createElement('div');
    previewWrap.className = 'editorjs-cta-preview';

    const previewContent = document.createElement('div');
    previewContent.className = 'editorjs-cta-preview__content';
    this.previewText = document.createElement('p');
    this.previewText.className = 'editorjs-cta-preview__text';
    previewContent.appendChild(this.previewText);

    const previewActions = document.createElement('div');
    previewActions.className = 'editorjs-cta-preview__actions';
    this.previewPrimaryButton = document.createElement('a');
    this.previewPrimaryButton.className = 'editorjs-cta-preview__button editorjs-cta-preview__button--primary';
    this.previewSecondaryButton = document.createElement('a');
    this.previewSecondaryButton.className = 'editorjs-cta-preview__button editorjs-cta-preview__button--secondary';
    previewActions.appendChild(this.previewPrimaryButton);
    previewActions.appendChild(this.previewSecondaryButton);

    previewWrap.appendChild(previewContent);
    previewWrap.appendChild(previewActions);

    const buttonGrid = document.createElement('div');
    buttonGrid.className = 'editorjs-custom__grid editorjs-custom__grid--two';
    buttonGrid.appendChild(createField('Primary label', this.primaryLabelInput));
    buttonGrid.appendChild(createField('Primary link', this.primaryLinkInput));
    buttonGrid.appendChild(createField('Secondary label', this.secondaryLabelInput));
    buttonGrid.appendChild(createField('Secondary link', this.secondaryLinkInput));

    const updatePreview = () => this.renderPreview();
    this.textInput.addEventListener('input', updatePreview);
    this.primaryLabelInput.addEventListener('input', updatePreview);
    this.primaryLinkInput.addEventListener('input', updatePreview);
    this.secondaryLabelInput.addEventListener('input', updatePreview);
    this.secondaryLinkInput.addEventListener('input', updatePreview);

    this.wrapper.appendChild(createField('Text', this.textInput));
    this.wrapper.appendChild(buttonGrid);
    this.wrapper.appendChild(previewWrap);
    this.renderPreview();
    return this.wrapper;
  }

  save() {
    return {
      text: this.textInput.value.trim(),
      primaryButton: {
        label: this.primaryLabelInput.value.trim(),
        link: this.primaryLinkInput.value.trim()
      },
      secondaryButton: {
        label: this.secondaryLabelInput.value.trim(),
        link: this.secondaryLinkInput.value.trim()
      }
    };
  }

  private renderPreview() {
    const text = this.textInput.value.trim() || 'Take the next step-explore drapes that match this guide.';
    const primaryLabel = this.primaryLabelInput.value.trim() || 'Explore Collection';
    const primaryLink = this.primaryLinkInput.value.trim() || '/collection';
    const secondaryLabel = this.secondaryLabelInput.value.trim() || 'Jump to Shop';
    const secondaryLink = this.secondaryLinkInput.value.trim() || '/shop';

    this.previewText.textContent = text;
    this.previewPrimaryButton.textContent = primaryLabel.toUpperCase();
    this.previewPrimaryButton.setAttribute('href', primaryLink || '#');
    this.previewSecondaryButton.textContent = secondaryLabel.toUpperCase();
    this.previewSecondaryButton.setAttribute('href', secondaryLink || '#');
  }
}

export class ProductCarouselTool {
  private data: ProductCarouselData;
  private config: { catalogs?: Array<{ _id: string; name: string }> };
  private wrapper: HTMLDivElement;
  private titleInput: HTMLInputElement;
  private subtitleInput: HTMLInputElement;
  private categorySearchInput: HTMLInputElement;
  private categoryListWrap: HTMLDivElement;
  private productLimitInput: HTMLInputElement;
  private selectedCategoryId: string;

  static get toolbox() {
    return {
      title: 'Product Carousel',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.6" y="4" width="14.8" height="12" rx="2.2" stroke="currentColor" stroke-width="1.6"/><rect x="5" y="7" width="3.2" height="6.2" rx="1.1" stroke="currentColor" stroke-width="1.2"/><rect x="9.2" y="7" width="3.2" height="6.2" rx="1.1" stroke="currentColor" stroke-width="1.2"/><rect x="13.4" y="7" width="1.8" height="6.2" rx="0.9" stroke="currentColor" stroke-width="1.2"/></svg>'
    };
  }

  constructor({ data, config }: { data: ProductCarouselData; config?: { catalogs?: Array<{ _id: string; name: string }> } }) {
    this.data = data || {};
    this.config = config || {};
    this.selectedCategoryId = this.data.category_id || '';
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'editorjs-custom editorjs-custom--product-carousel';

    this.titleInput = createInput(this.data.title || '', 'From the cotton collection');
    this.subtitleInput = createInput(this.data.subtitle || '', 'Suggested drapes that pair with this guide');
    this.categorySearchInput = createInput('', 'Search catalog');
    this.categoryListWrap = document.createElement('div');
    this.categoryListWrap.className = 'editorjs-catalog-picker__list';
    this.productLimitInput = createInput(String(this.data.productLimit ?? 8), '8');

    this.categorySearchInput.addEventListener('input', () => this.renderCatalogList());

    const pickerWrap = document.createElement('div');
    pickerWrap.className = 'editorjs-catalog-picker';
    pickerWrap.appendChild(createField('Catalogs (select one)', this.categorySearchInput));
    pickerWrap.appendChild(this.categoryListWrap);

    this.wrapper.appendChild(createField('Title', this.titleInput));
    this.wrapper.appendChild(createField('Subtitle', this.subtitleInput));
    this.wrapper.appendChild(pickerWrap);
    this.wrapper.appendChild(createField('Product limit', this.productLimitInput));
    this.renderCatalogList();

    return this.wrapper;
  }

  save() {
    const parsedLimit = Number(this.productLimitInput.value || 0);
    const productLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 8;

    return {
      title: this.titleInput.value.trim(),
      subtitle: this.subtitleInput.value.trim(),
      category_id: this.selectedCategoryId,
      productLimit
    };
  }

  private renderCatalogList() {
    this.categoryListWrap.innerHTML = '';
    const catalogs = Array.isArray(this.config.catalogs) ? this.config.catalogs : [];
    const search = (this.categorySearchInput.value || '').trim().toLowerCase();
    const filtered = catalogs.filter((catalog) => {
      if (!catalog?.name) return false;
      if (!search) return true;
      return catalog.name.toLowerCase().includes(search);
    });

    filtered.forEach((catalog) => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = `editorjs-catalog-chip ${this.selectedCategoryId === catalog._id ? 'is-selected' : ''}`;
      item.textContent = catalog.name;
      item.addEventListener('click', () => {
        this.selectedCategoryId = this.selectedCategoryId === catalog._id ? '' : catalog._id;
        this.renderCatalogList();
      });
      this.categoryListWrap.appendChild(item);
    });
  }
}

export class ProductCtaTool {
  private data: ProductCtaData;
  private config: { uploadImage?: UploadImageFn };
  private wrapper: HTMLDivElement;
  private imageInput: HTMLInputElement;
  private preview: HTMLDivElement;
  private uploadStatus: HTMLSpanElement;
  private sectionLabelInput: HTMLInputElement;
  private sectionSubtextInput: HTMLTextAreaElement;
  private productNameInput: HTMLInputElement;
  private originalPriceInput: HTMLInputElement;
  private salePriceInput: HTMLInputElement;
  private ctaLabelInput: HTMLInputElement;
  private ctaUrlInput: HTMLInputElement;

  static get toolbox() {
    return {
      title: 'Product CTA',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M6 7H14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6 11H10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6 14H12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
    };
  }

  constructor({ data, config }: { data: ProductCtaData; config?: { uploadImage?: UploadImageFn } }) {
    this.data = data || {};
    this.config = config || {};
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'editorjs-custom editorjs-custom--product';

    this.sectionLabelInput = createInput(this.data.sectionLabel || '', 'Section label');
    this.sectionSubtextInput = createTextarea(this.data.sectionSubtext || '', 'Optional supporting text');
    this.imageInput = createInput(this.data.productImage || '', '/uploads/product.jpg');
    this.productNameInput = createInput(this.data.productName || '', 'Product name');
    this.originalPriceInput = createInput(this.data.originalPrice || '', '₹5,200');
    this.salePriceInput = createInput(this.data.salePrice || '', '₹4,499');
    this.ctaLabelInput = createInput(this.data.ctaLabel || '', 'ADD TO CART');
    this.ctaUrlInput = createInput(this.data.ctaUrl || '', '/product/TS-001');

    this.uploadStatus = document.createElement('span');
    this.uploadStatus.className = 'editorjs-custom__status';

    this.preview = document.createElement('div');
    this.preview.className = 'editorjs-custom__preview';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg,image/png,image/webp';
    fileInput.className = 'editorjs-custom__file';
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file || !this.config.uploadImage) return;
      this.uploadStatus.textContent = 'Uploading...';
      try {
        const imagePath = await this.config.uploadImage(file);
        this.imageInput.value = imagePath;
        this.uploadStatus.textContent = 'Uploaded';
        this.renderPreview();
      }
      catch (error) {
        this.uploadStatus.textContent = 'Upload failed';
      }
    });

    this.imageInput.addEventListener('input', () => this.renderPreview());

    const imageRow = document.createElement('div');
    imageRow.className = 'editorjs-custom__grid editorjs-custom__grid--two';
    imageRow.appendChild(createField('Image path', this.imageInput));

    const uploadWrap = document.createElement('label');
    uploadWrap.className = 'editorjs-custom__field';
    const uploadCaption = document.createElement('span');
    uploadCaption.className = 'editorjs-custom__caption';
    uploadCaption.textContent = 'Upload image';
    uploadWrap.appendChild(uploadCaption);
    uploadWrap.appendChild(fileInput);
    uploadWrap.appendChild(this.uploadStatus);
    imageRow.appendChild(uploadWrap);

    const pricingGrid = document.createElement('div');
    pricingGrid.className = 'editorjs-custom__grid editorjs-custom__grid--two';
    pricingGrid.appendChild(createField('Section label', this.sectionLabelInput));
    pricingGrid.appendChild(createField('Product name', this.productNameInput));
    pricingGrid.appendChild(createField('Original price', this.originalPriceInput));
    pricingGrid.appendChild(createField('Sale price', this.salePriceInput));
    pricingGrid.appendChild(createField('CTA label', this.ctaLabelInput));
    pricingGrid.appendChild(createField('CTA URL', this.ctaUrlInput));

    this.wrapper.appendChild(pricingGrid);
    this.wrapper.appendChild(createField('Section subtext', this.sectionSubtextInput));
    this.wrapper.appendChild(imageRow);
    this.wrapper.appendChild(this.preview);

    this.renderPreview();
    return this.wrapper;
  }

  save() {
    return {
      sectionLabel: this.sectionLabelInput.value.trim(),
      sectionSubtext: this.sectionSubtextInput.value.trim(),
      productImage: this.imageInput.value.trim(),
      productName: this.productNameInput.value.trim(),
      originalPrice: this.originalPriceInput.value.trim(),
      salePrice: this.salePriceInput.value.trim(),
      ctaLabel: this.ctaLabelInput.value.trim(),
      ctaUrl: this.ctaUrlInput.value.trim()
    };
  }

  private renderPreview() {
    this.preview.innerHTML = '';
    const src = this.imageInput.value.trim();
    if (!src) return;

    const image = document.createElement('img');
    image.src = src;
    image.alt = 'Product CTA preview';
    image.className = 'editorjs-custom__preview-image';
    this.preview.appendChild(image);
  }
}

export class KeyFeaturesTool {
  private data: KeyFeaturesData;
  private wrapper: HTMLDivElement;
  private titleInput: HTMLInputElement;
  private itemsContainer: HTMLDivElement;
  private previewWrap: HTMLDivElement;
  private previewTitle: HTMLHeadingElement;
  private previewList: HTMLUListElement;

  static get toolbox() {
    return {
      title: 'Key Features',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="3" width="15" height="14" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M6.5 8.5L8.5 10.5L13.5 6.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.5 13.5H13.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
    };
  }

  constructor({ data }: { data: KeyFeaturesData }) {
    this.data = data || {};
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'editorjs-custom editorjs-custom--key-features';

    this.titleInput = createInput(
      this.data.title || '',
      'Key features to check before booking:'
    );

    this.itemsContainer = document.createElement('div');
    this.itemsContainer.className = 'editorjs-key-features__list';

    const featuresHeader = document.createElement('div');
    featuresHeader.className = 'editorjs-key-features__header';

    const featuresLabel = document.createElement('span');
    featuresLabel.className = 'editorjs-key-features__label';
    featuresLabel.textContent = 'Features';

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'editorjs-key-features__add-btn';
    addButton.innerHTML = '<span aria-hidden="true">+</span> Add feature';
    addButton.addEventListener('click', () => {
      this.addItem();
      this.renderPreview();
    });

    featuresHeader.appendChild(featuresLabel);
    featuresHeader.appendChild(addButton);

    const featuresPanel = document.createElement('div');
    featuresPanel.className = 'editorjs-key-features__panel';
    featuresPanel.appendChild(this.itemsContainer);

    this.previewWrap = document.createElement('div');
    this.previewWrap.className = 'editorjs-key-features-preview';

    const previewLabel = document.createElement('span');
    previewLabel.className = 'editorjs-key-features-preview__label';
    previewLabel.textContent = 'Preview';

    this.previewTitle = document.createElement('h4');
    this.previewTitle.className = 'editorjs-key-features-preview__title';
    this.previewList = document.createElement('ul');
    this.previewList.className = 'editorjs-key-features-preview__grid';

    this.previewWrap.appendChild(previewLabel);
    this.previewWrap.appendChild(this.previewTitle);
    this.previewWrap.appendChild(this.previewList);

    this.titleInput.addEventListener('input', () => this.renderPreview());

    this.wrapper.appendChild(createField('Title', this.titleInput));
    this.wrapper.appendChild(featuresHeader);
    this.wrapper.appendChild(featuresPanel);
    this.wrapper.appendChild(this.previewWrap);

    const features = Array.isArray(this.data.features) && this.data.features.length
      ? this.data.features
      : [''];
    features.forEach((feature) => this.addItem(feature));

    this.renderPreview();
    return this.wrapper;
  }

  save() {
    const rows = Array.from(this.itemsContainer.querySelectorAll('.editorjs-key-features__item'));
    const features = rows
      .map((row) => (row.querySelector('[data-key="feature"]') as HTMLInputElement)?.value?.trim() || '')
      .filter((feature) => !!feature);

    return {
      title: this.titleInput.value.trim() || 'Key features to check before booking:',
      features
    };
  }

  private addItem(value = '') {
    const row = document.createElement('div');
    row.className = 'editorjs-key-features__item';

    const featureInput = createInput(value, 'e.g. Fast, reliable Wi-Fi');
    featureInput.className = 'editorjs-custom__input editorjs-key-features__input';
    featureInput.setAttribute('data-key', 'feature');
    featureInput.addEventListener('input', () => this.renderPreview());

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'editorjs-key-features__remove';
    removeButton.setAttribute('aria-label', 'Remove feature');
    removeButton.title = 'Remove feature';
    removeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    removeButton.addEventListener('click', () => {
      if (this.itemsContainer.children.length > 1) {
        row.remove();
        this.renderPreview();
      }
    });

    row.appendChild(featureInput);
    row.appendChild(removeButton);
    this.itemsContainer.appendChild(row);
  }

  private renderPreview() {
    const title = this.titleInput.value.trim() || 'Key features to check before booking:';
    const rows = Array.from(this.itemsContainer.querySelectorAll('.editorjs-key-features__item'));
    const features = rows
      .map((row) => (row.querySelector('[data-key="feature"]') as HTMLInputElement)?.value?.trim() || '')
      .filter((feature) => !!feature);

    this.previewTitle.textContent = title;
    this.previewList.innerHTML = '';

    if (!features.length) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'editorjs-key-features-preview__item editorjs-key-features-preview__item--empty';
      emptyItem.textContent = 'Add features above to preview the checklist.';
      this.previewList.appendChild(emptyItem);
      return;
    }

    features.forEach((feature) => {
      const item = document.createElement('li');
      item.className = 'editorjs-key-features-preview__item';

      const check = document.createElement('span');
      check.className = 'editorjs-key-features-preview__check';
      check.textContent = '✓';

      const text = document.createElement('span');
      text.className = 'editorjs-key-features-preview__text';
      text.textContent = feature;

      item.appendChild(check);
      item.appendChild(text);
      this.previewList.appendChild(item);
    });
  }
}

export class IframeTool {
  private data: IframeData;
  private wrapper: HTMLDivElement;
  private urlInput: HTMLTextAreaElement;

  static get toolbox() {
    return {
      title: 'Iframe',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="3.5" width="15" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><rect x="5" y="6.5" width="10" height="7" rx="1" stroke="currentColor" stroke-width="1.4"/></svg>'
    };
  }

  constructor({ data }: { data: IframeData }) {
    this.data = data || {};
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'editorjs-custom editorjs-custom--iframe';

    this.urlInput = createTextarea(this.data.url || '', 'https://www.google.com/maps/embed?pb=...');

    const hint = document.createElement('p');
    hint.className = 'editorjs-custom__hint';
    hint.textContent = 'Paste the iframe embed URL (HTTPS only), e.g. Google Maps embed link.';

    this.wrapper.appendChild(createField('Embed URL', this.urlInput));
    this.wrapper.appendChild(hint);
    return this.wrapper;
  }

  save() {
    return {
      url: this.urlInput.value.trim()
    };
  }
}

export class ImageCardsTool {
  private data: ImageCardsData;
  private config: ImageCardsToolConfig;
  private wrapper: HTMLDivElement;
  private headingInput: HTMLInputElement;
  private subHeadingInput: HTMLInputElement;
  private cardsContainer: HTMLDivElement;

  static get toolbox() {
    return {
      title: 'Image Cards',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4" width="7" height="12" rx="1.5" stroke="currentColor" stroke-width="1.6"/><rect x="10.5" y="4" width="7" height="12" rx="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M5 12H7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M13 12H15" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>'
    };
  }

  constructor({ data, config }: { data: ImageCardsData; config?: ImageCardsToolConfig }) {
    this.data = data || {};
    this.config = config || {};
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'editorjs-custom editorjs-custom--image-cards';

    this.headingInput = createInput(this.data.heading || '', 'Choose Your Stay');
    this.subHeadingInput = createInput(this.data.sub_heading || '', 'Accommodation Options');

    const sectionGrid = document.createElement('div');
    sectionGrid.className = 'editorjs-custom__grid editorjs-custom__grid--two';
    sectionGrid.appendChild(createField('Sub heading', this.subHeadingInput));
    sectionGrid.appendChild(createField('Heading', this.headingInput));

    const cardsHeader = document.createElement('div');
    cardsHeader.className = 'editorjs-image-cards__header';

    const cardsLabel = document.createElement('span');
    cardsLabel.className = 'editorjs-image-cards__label';
    cardsLabel.textContent = 'Cards';

    const addCardButton = document.createElement('button');
    addCardButton.type = 'button';
    addCardButton.className = 'editorjs-image-cards__add-btn';
    addCardButton.innerHTML = '<span aria-hidden="true">+</span> Add card';
    addCardButton.addEventListener('click', () => {
      this.addCardPanel();
    });

    cardsHeader.appendChild(cardsLabel);
    cardsHeader.appendChild(addCardButton);

    this.cardsContainer = document.createElement('div');
    this.cardsContainer.className = 'editorjs-image-cards__cards';

    const cards = Array.isArray(this.data.cards) && this.data.cards.length
      ? this.data.cards
      : [{}];
    cards.forEach((card) => this.addCardPanel(card));

    this.wrapper.appendChild(sectionGrid);
    this.wrapper.appendChild(cardsHeader);
    this.wrapper.appendChild(this.cardsContainer);

    return this.wrapper;
  }

  save() {
    return {
      heading: this.headingInput.value.trim(),
      sub_heading: this.subHeadingInput.value.trim(),
      cards: this.collectCards()
    };
  }

  private addCardPanel(card: ImageCardItemData = {}) {
    const panel = document.createElement('div');
    panel.className = 'editorjs-image-cards__card';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'editorjs-image-cards__card-header';

    const cardTitle = document.createElement('span');
    cardTitle.className = 'editorjs-image-cards__card-title';
    cardTitle.textContent = `Card ${this.cardsContainer.children.length + 1}`;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'editorjs-image-cards__remove-card';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      if (this.cardsContainer.children.length <= 1) return;
      panel.remove();
      this.renumberCards();
    });

    cardHeader.appendChild(cardTitle);
    cardHeader.appendChild(removeButton);

    const imageInput = document.createElement('input');
    imageInput.type = 'hidden';
    imageInput.value = card.image || '';
    imageInput.setAttribute('data-key', 'image');

    const uploadStatus = document.createElement('span');
    uploadStatus.className = 'editorjs-custom__status';
    uploadStatus.textContent = card.image ? 'Image uploaded' : '';

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/jpeg,image/png,image/webp';
    fileInput.className = 'editorjs-custom__file';
    fileInput.addEventListener('change', async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file || !this.config.uploadImage) return;
      uploadStatus.textContent = 'Uploading...';
      try {
        imageInput.value = await this.config.uploadImage(file);
        uploadStatus.textContent = 'Image uploaded';
      }
      catch (error) {
        uploadStatus.textContent = 'Upload failed';
      }
    });

    const subHeadingInput = createInput(card.sub_heading || '', 'For Business & Leisure');
    subHeadingInput.setAttribute('data-key', 'sub_heading');

    const headingInput = createInput(card.heading || '', 'Hotel Rooms');
    headingInput.setAttribute('data-key', 'heading');

    const textColorSelect = createSelect([
      { label: 'Light text', value: 'light' },
      { label: 'Dark text', value: 'dark' }
    ], card.text_color === 'dark' ? 'dark' : 'light');
    textColorSelect.setAttribute('data-key', 'text_color');

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'editorjs-image-cards__options';
    optionsContainer.setAttribute('data-key', 'options-container');

    const optionsList = document.createElement('div');
    optionsList.className = 'editorjs-image-cards__options-list';

    const optionsHeader = document.createElement('div');
    optionsHeader.className = 'editorjs-image-cards__subheader';
    const optionsLabel = document.createElement('span');
    optionsLabel.textContent = 'Options';
    const addOptionButton = document.createElement('button');
    addOptionButton.type = 'button';
    addOptionButton.className = 'editorjs-image-cards__inline-btn';
    addOptionButton.textContent = '+ Add option';
    addOptionButton.addEventListener('click', () => {
      this.addOptionRow(optionsList);
    });
    optionsHeader.appendChild(optionsLabel);
    optionsHeader.appendChild(addOptionButton);
    optionsContainer.appendChild(optionsHeader);
    optionsContainer.appendChild(optionsList);

    const options = Array.isArray(card.options) && card.options.length ? card.options : [''];
    options.forEach((option) => this.addOptionRow(optionsList, option));

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'editorjs-image-cards__buttons';
    buttonsContainer.setAttribute('data-key', 'buttons-container');

    const buttonsHeader = document.createElement('div');
    buttonsHeader.className = 'editorjs-image-cards__subheader';
    const buttonsLabel = document.createElement('span');
    buttonsLabel.textContent = 'Buttons';
    const addButtonButton = document.createElement('button');
    addButtonButton.type = 'button';
    addButtonButton.className = 'editorjs-image-cards__inline-btn';
    addButtonButton.textContent = '+ Add button';
    addButtonButton.addEventListener('click', () => {
      this.addButtonRow(buttonsContainer);
    });
    buttonsHeader.appendChild(buttonsLabel);
    buttonsHeader.appendChild(addButtonButton);
    buttonsContainer.appendChild(buttonsHeader);

    const buttons = Array.isArray(card.buttons) && card.buttons.length ? card.buttons : [{ label: '', link: '' }];
    buttons.forEach((button) => this.addButtonRow(buttonsContainer, button));

    const uploadWrap = document.createElement('label');
    uploadWrap.className = 'editorjs-custom__field';
    const uploadCaption = document.createElement('span');
    uploadCaption.className = 'editorjs-custom__caption';
    uploadCaption.textContent = 'Upload image';
    uploadWrap.appendChild(uploadCaption);
    uploadWrap.appendChild(fileInput);
    uploadWrap.appendChild(uploadStatus);

    const detailsGrid = document.createElement('div');
    detailsGrid.className = 'editorjs-custom__grid editorjs-custom__grid--two';
    detailsGrid.appendChild(createField('Card heading', headingInput));
    detailsGrid.appendChild(createField('Card sub heading', subHeadingInput));
    detailsGrid.appendChild(createField('Text color', textColorSelect));

    panel.appendChild(cardHeader);
    panel.appendChild(uploadWrap);
    panel.appendChild(imageInput);
    panel.appendChild(detailsGrid);
    panel.appendChild(optionsContainer);
    panel.appendChild(buttonsContainer);
    this.cardsContainer.appendChild(panel);
  }

  private renumberCards() {
    Array.from(this.cardsContainer.querySelectorAll('.editorjs-image-cards__card')).forEach((panel, index) => {
      const title = panel.querySelector('.editorjs-image-cards__card-title');
      if (title) title.textContent = `Card ${index + 1}`;
    });
  }

  private addOptionRow(container: HTMLDivElement, value = '') {
    const row = document.createElement('div');
    row.className = 'editorjs-image-cards__option-row';

    const input = createInput(value, 'Standard');
    input.className = 'editorjs-custom__input editorjs-image-cards__option-input';
    input.setAttribute('data-key', 'option');

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'editorjs-image-cards__remove-option';
    removeButton.setAttribute('aria-label', 'Remove option');
    removeButton.title = 'Remove option';
    removeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
    removeButton.addEventListener('click', () => {
      const rows = container.querySelectorAll('.editorjs-image-cards__option-row');
      if (rows.length <= 1) {
        input.value = '';
        return;
      }
      row.remove();
    });

    row.appendChild(input);
    row.appendChild(removeButton);
    container.appendChild(row);
  }

  private addButtonRow(container: HTMLDivElement, button: ImageCardButtonData = {}) {
    const row = document.createElement('div');
    row.className = 'editorjs-image-cards__button-row';

    const labelInput = createInput(button.label || '', 'T. Nagar');
    labelInput.setAttribute('data-key', 'button-label');

    const linkTypeSelect = createSelect([
      { label: 'Internal link', value: 'internal_link' },
      { label: 'External link', value: 'external_link' }
    ], normalizeImageCardLinkType(button.link_type));
    linkTypeSelect.setAttribute('data-key', 'button-link-type');

    const linkInput = createInput(
      button.link || '',
      normalizeImageCardLinkType(button.link_type) === 'external_link'
        ? 'https://example.com'
        : '/location/hotel-in-t-nagar'
    );
    linkInput.setAttribute('data-key', 'button-link');

    linkTypeSelect.addEventListener('change', () => {
      linkInput.placeholder = linkTypeSelect.value === 'external_link'
        ? 'https://example.com'
        : '/location/hotel-in-t-nagar';
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'editorjs-image-cards__remove-item';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      const rows = container.querySelectorAll('.editorjs-image-cards__button-row');
      if (rows.length <= 1) {
        labelInput.value = '';
        linkInput.value = '';
        linkTypeSelect.value = 'internal_link';
        linkInput.placeholder = '/location/hotel-in-t-nagar';
        return;
      }
      row.remove();
    });

    row.appendChild(createField('Label', labelInput));
    row.appendChild(createField('Link type', linkTypeSelect));
    row.appendChild(createField('Link', linkInput));
    row.appendChild(removeButton);
    container.appendChild(row);
  }

  private collectCards(): ImageCardItemData[] {
    return Array.from(this.cardsContainer.querySelectorAll('.editorjs-image-cards__card')).map((panel, index) => {
      const image = (panel.querySelector('[data-key="image"]') as HTMLInputElement)?.value.trim() || '';
      const sub_heading = (panel.querySelector('[data-key="sub_heading"]') as HTMLInputElement)?.value.trim() || '';
      const heading = (panel.querySelector('[data-key="heading"]') as HTMLInputElement)?.value.trim() || '';
      const text_color = (panel.querySelector('[data-key="text_color"]') as HTMLSelectElement)?.value === 'dark' ? 'dark' : 'light';
      const options = Array.from(panel.querySelectorAll('[data-key="option"]'))
        .map((input) => (input as HTMLInputElement).value.trim())
        .filter((option) => !!option);
      const buttons = Array.from(panel.querySelectorAll('.editorjs-image-cards__button-row'))
        .map((row) => ({
          label: (row.querySelector('[data-key="button-label"]') as HTMLInputElement)?.value.trim() || '',
          link_type: normalizeImageCardLinkType(
            (row.querySelector('[data-key="button-link-type"]') as HTMLSelectElement)?.value
          ),
          link: (row.querySelector('[data-key="button-link"]') as HTMLInputElement)?.value.trim() || ''
        }))
        .filter((button) => button.label || button.link);

      return {
        rank: index + 1,
        image,
        sub_heading,
        heading,
        options,
        text_color,
        buttons
      };
    });
  }
}
