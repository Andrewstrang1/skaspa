import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { FeatureComponent } from './feature.component';
import { SubFeatureComponent } from './sub-feature/sub-feature.component';
import { SubFeatureWithDatatableComponent } from './sub-feature-with-datatable/sub-feature-with-datatable.component';
import { SharedModule } from '../shared/shared.module';
import { SubFeatureWithDatatableComponentHTML } from './sub-feature-with-datatable-html/sub-feature-with-datatable-html.component';  // Import SharedModule here
import { ServicesModule } from '../services/services.module';
import { ApiIntegrationComponent } from './api-integration/api-integration.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { MusicComponent } from './music/music.component';

const routes: Routes = [
  {
    path: '',
    component: FeatureComponent,
    children: [
      { path: 'sub-feature', component: SubFeatureComponent },
      { path: 'sub-feature-with-datatable', component: SubFeatureWithDatatableComponent },
      { path: 'sub-feature-with-datatable-html', component: SubFeatureWithDatatableComponentHTML },
      { path: 'api-integration', component: ApiIntegrationComponent },
      { path: 'product-details/:id', component: ProductDetailsComponent },
      { path: 'music', component: MusicComponent },  // Add this line

      ]
  }
];

@NgModule({
  declarations: [
    FeatureComponent,
    SubFeatureComponent,
    SubFeatureWithDatatableComponent,
    SubFeatureWithDatatableComponentHTML,
    ApiIntegrationComponent,
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,  // Import SharedModule to use DataTableComponent
    ServicesModule, FormsModule
  ]
})
export class FeatureModule {}
