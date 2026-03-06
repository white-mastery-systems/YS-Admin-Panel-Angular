import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../shared/shared.module';

import { RecipeRoutingModule } from './recipe-routing.module';
import { RecipeComponent } from './recipe.component';

@NgModule({
  declarations: [
    RecipeComponent
  ],
  imports: [
    TagInputModule,
    SharedModule,
    RecipeRoutingModule
  ]
})

export class RecipeModule { }