import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FeatureComponent } from './feature/feature.component';
import { SubFeatureComponent } from './sub-feature/sub-feature.component';
import { SubFeatureWithDatatableComponent } from './sub-feature-with-datatable/sub-feature-with-datatable.component';
import { SharedModule } from '../shared/shared.module';
import { SubFeatureWithDatatableComponentHTML } from './sub-feature-with-datatable-html/sub-feature-with-datatable-html.component';  // Import SharedModule here

const routes: Routes = [
  {
    path: '',
    component: FeatureComponent,
    children: [
      { path: 'sub-feature', component: SubFeatureComponent },
      { path: 'sub-feature-with-datatable', component: SubFeatureWithDatatableComponent },
      { path: 'sub-feature-with-datatable-html', component: SubFeatureWithDatatableComponentHTML },
      ]
  }
];

@NgModule({
  declarations: [
    FeatureComponent,
    SubFeatureComponent,
    SubFeatureWithDatatableComponent,
    SubFeatureWithDatatableComponentHTML
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule  // Import SharedModule to use DataTableComponent
  ]
})
export class FeatureModule {}
