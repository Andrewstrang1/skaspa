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
import { SubFeatureTileViewComponent } from './sub-feature-tile-view/sub-feature-tile-view.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { SubFeatureWithDraggableTableComponent } from './sub-feature-with-draggable-table/sub-feature-with-draggable-table.component';
import { MusictestComponent } from './musictest/musictest.component';
import { ToasterTestComponent } from './toaster-test/toaster-test.component';


const routes: Routes = [
  {
    path: '',
    component: FeatureComponent,
    children: [
      { path: 'sub-feature', component: SubFeatureComponent },
      { path: 'sub-feature-with-datatable', component: SubFeatureWithDatatableComponent },
      { path: 'sub-feature-with-datatable-html', component: SubFeatureWithDatatableComponentHTML },
      { path: 'api-integration', component: ApiIntegrationComponent },
      { path: 'app-sub-feature-tile-view', component: SubFeatureTileViewComponent },
      { path: 'product-details/:id', component: ProductDetailsComponent },
      { path: 'draggable', component: SubFeatureWithDraggableTableComponent},
      { path: 'musictest', component: MusictestComponent},
      { path: 'toaster', component: ToasterTestComponent}
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
    ProductDetailsComponent,
    SubFeatureTileViewComponent,
    SubFeatureWithDraggableTableComponent,
    MusictestComponent,
    ToasterTestComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,  // Import SharedModule to use DataTableComponents
    FormsModule,
    NgbCarouselModule
  ]
})
export class FeatureModule {}
