import { Component } from '@angular/core';
import { CommonService } from '../../../../services/common.service';

@Component({
    selector: 'app-branch-profile',
    templateUrl: './branch-profile.component.html',
    styleUrls: ['./branch-profile.component.scss'],
    standalone: false
})

export class BranchProfileComponent {

  constructor(public commonService: CommonService) { }

}