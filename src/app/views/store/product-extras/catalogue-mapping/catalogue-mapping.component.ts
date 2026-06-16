import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductExtrasApiService } from '../product-extras-api.service';
import { StoreApiService } from '../../../../services/store-api.service';
import { CommonService } from '../../../../services/common.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-catalogue-mapping',
  templateUrl: './catalogue-mapping.component.html',
  styleUrls: ['./catalogue-mapping.component.scss']
})

export class CatalogueMappingComponent implements OnInit {

  pageLoader: boolean;
  search_bar: string;
  page = 1;
  pageSize = 10;
  list: any[] = [];
  catalogList: any[] = [];
  catalogSearch: string = '';
  catalogDropdownOpen: boolean = false;
  ruleForm: any;
  deleteForm: any;
  seedMessage: string;
  seedLoader: boolean;
  relinkLoader: boolean;
  importLoader: boolean;
  deleteAllLoader: boolean;
  importForm: any;
  isTulsiAiStore: boolean = false;
  /** Set true to show Fix catalogue links (kept for future use). */
  showAdvancedMappingActions = false;

  tagFields = [
    { value: 'body_colour', label: 'Body Colour' },
    { value: 'material', label: 'Material' },
    { value: 'design', label: 'Design' },
    { value: 'border', label: 'Border' },
    { value: 'blouse', label: 'Blouse' },
    { value: 'zari_colour', label: 'Zari Colour' },
    { value: 'occasion', label: 'Occasion' },
    { value: 'weave', label: 'Weave' },
    { value: 'pallu_colour', label: 'Pallu Colour' },
    { value: 'blouse_colour', label: 'Blouse Colour' }
  ];

  operatorOptions = [
    { value: 'equals', label: 'equals' },
    { value: 'includes', label: 'includes' }
  ];

  constructor(
    config: NgbModalConfig,
    public modalService: NgbModal,
    private api: ProductExtrasApiService,
    private storeApi: StoreApiService,
    public commonService: CommonService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit() {
    this.commonService.redirect = '/product-sections/extras';
    this.commonService.secondary_header = 'AI Catalogue Mapping';
    this.isTulsiAiStore = String(this.commonService.store_details?._id || '') === String(environment.config_data.tulsi_ai_catalog_store_id);
    if (!this.isTulsiAiStore) {
      this.pageLoader = false;
      return;
    }
    this.pageLoader = true;
    this.loadData();
  }

  loadData() {
    this.storeApi.CATALOG_LIST().subscribe(catalogResult => {
      if (catalogResult.status) {
        this.catalogList = catalogResult.list || [];
      }
      this.api.CATALOGUE_MAPPING_LIST().subscribe(result => {
        if (result.status) this.list = result.list || [];
        setTimeout(() => { this.pageLoader = false; }, 300);
      });
    });
  }

  getCatalogName(categoryId) {
    const match = this.catalogList.find(item => item._id === categoryId);
    return match?.name || 'Unknown catalogue';
  }

  getFilteredCatalogList() {
    const term = (this.catalogSearch || '').trim().toLowerCase();
    if (!term) return [];
    return this.catalogList.filter(item => (item.name || '').toLowerCase().includes(term));
  }

  openCatalogDropdown() {
    this.catalogDropdownOpen = true;
  }

  toggleCatalogDropdown() {
    this.catalogDropdownOpen = !this.catalogDropdownOpen;
  }

  selectCatalog(catalog) {
    this.ruleForm.category_id = catalog._id;
    this.catalogSearch = catalog.name;
    this.catalogDropdownOpen = false;
  }

  onCatalogSearchBlur() {
    setTimeout(() => {
      this.catalogDropdownOpen = false;
      if (this.ruleForm.category_id) {
        this.catalogSearch = this.getCatalogName(this.ruleForm.category_id);
      }
    }, 150);
  }

  resetCatalogPicker(categoryId = '') {
    this.catalogDropdownOpen = false;
    this.catalogSearch = categoryId ? this.getCatalogName(categoryId) : '';
  }

  formatConditions(rule) {
    return (rule.conditions || []).map(condition => {
      const field = this.tagFields.find(item => item.value === condition.field);
      const label = field?.label || condition.field;
      return `${label} ${condition.operator} "${condition.value}"`;
    }).join(' AND ');
  }

  onSearchChange() {
    this.page = 1;
  }

  resetListPage() {
    this.page = 1;
  }

  onAddModal(modalName) {
    this.resetCatalogPicker();
    this.ruleForm = {
      formType: 'add',
      name: '',
      category_id: '',
      conditions: [{ field: 'material', operator: 'equals', value: '' }]
    };
    this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
  }

  onEdit(rule, modalName) {
    this.resetCatalogPicker(rule.category_id);
    this.ruleForm = {
      formType: 'edit',
      _id: rule._id,
      name: rule.name,
      category_id: rule.category_id,
      conditions: (rule.conditions || []).map(condition => ({ ...condition }))
    };
    if (!this.ruleForm.conditions.length) {
      this.ruleForm.conditions = [{ field: 'material', operator: 'equals', value: '' }];
    }
    this.modalService.open(modalName, { size: 'xl', windowClass: 'scroll-modal-xl', scrollable: true });
  }

  addCondition() {
    this.ruleForm.conditions.push({ field: 'material', operator: 'equals', value: '' });
  }

  removeCondition(index) {
    if (this.ruleForm.conditions.length > 1) {
      this.ruleForm.conditions.splice(index, 1);
    }
  }

  onSubmit() {
    this.ruleForm.submit = true;
    const request$ = this.ruleForm.formType === 'add'
      ? this.api.ADD_CATALOGUE_MAPPING_RULE(this.ruleForm)
      : this.api.UPDATE_CATALOGUE_MAPPING_RULE(this.ruleForm);

    request$.subscribe(result => {
      this.ruleForm.submit = false;
      if (result.status) {
        document.getElementById('closeCatalogueMappingModal')?.click();
        this.list = result.list || [];
        this.resetListPage();
      }
      else {
        this.ruleForm.errorMsg = result.message || 'Unable to save rule';
      }
    });
  }

  onDelete() {
    this.deleteForm.submit = true;
    this.api.DELETE_CATALOGUE_MAPPING_RULE(this.deleteForm).subscribe(result => {
      this.deleteForm.submit = false;
      if (result.status) {
        document.getElementById('closeCatalogueMappingModal')?.click();
        this.list = result.list || [];
        this.resetListPage();
      }
      else {
        this.deleteForm.errorMsg = result.message || 'Unable to delete rule';
      }
    });
  }

  loadStarterRules() {
    this.seedLoader = true;
    this.seedMessage = null;
    this.api.SEED_CATALOGUE_MAPPING_STARTERS().subscribe(result => {
      this.seedLoader = false;
      if (result.status) {
        this.list = result.list || [];
        this.resetListPage();
        this.seedMessage = result.message || 'Curated rules loaded';
      }
      else {
        this.seedMessage = result.message || 'Unable to load curated rules';
      }
    }, () => {
      this.seedLoader = false;
      this.seedMessage = 'Unable to load curated rules';
    });
  }

  relinkStarterCatalogues() {
    this.relinkLoader = true;
    this.seedMessage = null;
    this.api.RELINK_CATALOGUE_MAPPING_STARTERS().subscribe(result => {
      this.relinkLoader = false;
      if (result.status) {
        this.list = result.list || [];
        this.resetListPage();
        this.seedMessage = result.message;
      }
      else {
        this.seedMessage = result.message || 'Unable to fix catalogue links';
      }
    }, () => {
      this.relinkLoader = false;
      this.seedMessage = 'Unable to fix catalogue links';
    });
  }

  onImportModal(modalName) {
    this.importForm = {
      file: null,
      fileName: '',
      errorMsg: '',
      submit: false
    };
    this.modalService.open(modalName, { size: 'lg', centered: true });
  }

  onImportFileSelected(event) {
    const file = event?.target?.files?.[0];
    this.importForm.file = file || null;
    this.importForm.fileName = file?.name || '';
    this.importForm.errorMsg = '';
  }

  onImportSubmit(modal) {
    if (!this.importForm?.file) {
      this.importForm.errorMsg = 'Choose a JSON or CSV file to import';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.importForm.file);
    this.importLoader = true;
    this.importForm.submit = true;
    this.importForm.errorMsg = '';
    this.seedMessage = null;

    this.api.IMPORT_CATALOGUE_MAPPING_RULES(formData).subscribe(result => {
      this.importLoader = false;
      this.importForm.submit = false;
      if (result.status) {
        this.list = result.list || [];
        this.resetListPage();
        modal.close();
        let message = result.message || 'Import complete';
        if (result.errors?.length) {
          const preview = result.errors.slice(0, 3).map(item => `${item.name}: ${item.message}`).join(' | ');
          message += `. Errors: ${preview}${result.errors.length > 3 ? ' ...' : ''}`;
        }
        this.seedMessage = message;
        return;
      }
      this.importForm.errorMsg = result.message || 'Import failed';
    }, () => {
      this.importLoader = false;
      this.importForm.submit = false;
      this.importForm.errorMsg = 'Import failed';
    });
  }

  deleteAllRules(modal) {
    this.deleteAllLoader = true;
    this.seedMessage = null;
    this.api.DELETE_ALL_CATALOGUE_MAPPING_RULES().subscribe(result => {
      this.deleteAllLoader = false;
      modal.close();
      if (result.status) {
        this.list = result.list || [];
        this.resetListPage();
        this.seedMessage = result.message || 'All rules deleted';
      }
      else {
        this.seedMessage = result.message || 'Unable to delete rules';
      }
    }, () => {
      this.deleteAllLoader = false;
      modal.close();
      this.seedMessage = 'Unable to delete rules';
    });
  }
}
