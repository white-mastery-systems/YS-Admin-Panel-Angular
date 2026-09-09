import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductExtrasApiService } from '../../product-extras-api.service';
import { CommonService } from '../../../../../services/common.service';
import { environment } from '../../../../../../environments/environment';

@Component({
    selector: 'app-measurement-events',
    templateUrl: './measurement-events.component.html',
    styleUrls: ['./measurement-events.component.scss'],
    standalone: false
})

export class MeasurementEventsComponent implements OnInit {

  pageLoader: boolean; params: any;
  mmForm: any = {}; maxRank: number = 0;
  vendor_id: string;
  imgBaseUrl = environment.img_baseurl;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private api: ProductExtrasApiService, public commonService: CommonService) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params: Params) => {
      this.commonService.redirect = "/product-extras/measurement-sets";
      this.commonService.secondary_header = "Add Measurement Set";
      this.vendor_id = ""; this.params = params;
      this.maxRank = parseFloat(params.rank);
      if(params.vendor_id) this.vendor_id = params.vendor_id;
      this.mmForm = { form_type: 'add', rank: this.maxRank, units: [{}], list: [{ conditions: [] }] };
      if(params.id!='add') {
        this.pageLoader = true;
        this.commonService.secondary_header = "Update Measurement Set";
        this.api.MEASUREMENT_LIST(this.vendor_id).subscribe(result => {
          if(result.status) {
            let index = result.list.findIndex(obj => obj._id==params.id);
            if(index!=-1) {
              this.mmForm = result.list[index];
              this.mmForm.prev_rank = this.mmForm.rank;
            }
            else console.log("Invalid measurement set");
          }
          else console.log("response", result);
          setTimeout(() => { this.pageLoader = false; }, 500);
        });
      }
    });
  }

  onSubmit() {
    this.mmForm.submit = true;
    if(this.params.vendor_id) this.mmForm.vendor_id = this.params.vendor_id;
    if(this.mmForm.form_type=='add') {
      this.api.ADD_MEASUREMENT(this.mmForm).subscribe(result => {
        if(result.status) this.router.navigate(['/product-extras/measurement-sets']);
        else {
          this.mmForm.errorMsg = result.message;
          console.log("response", result);
        }
        this.mmForm.submit = false;
      });
    }
    else {
      this.api.UPDATE_MEASUREMENT(this.mmForm).subscribe(result => {
        if(result.status) this.router.navigate(['/product-extras/measurement-sets']);
        else {
          this.mmForm.errorMsg = result.message;
          console.log("response", result);
        }
        this.mmForm.submit = false;
      });
    }
  }

  fileChangeListener(event) {
    if(event.target.files && event.target.files[0]) {
      let inFile = event.target.files[0];
      if(["image/jpeg", "image/png"].indexOf(inFile.type) != -1) {
      let reader = new FileReader();
      reader.onload = (event: ProgressEvent) => {
        this.mmForm.image = (<FileReader>event.target).result;
          this.mmForm.img_change = true;
      }
      reader.readAsDataURL(event.target.files[0]);
    }
    else console.log("Invaid file");
    }
  }

  onAddCondition(x) {
    let mmConditionList = [];
    this.mmForm.units.forEach(element => {
      mmConditionList.push({ unit: element.name });
    });
    x.conditions.push({ list: mmConditionList });
  }

}