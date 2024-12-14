import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MusicComponent } from './music.component';
import { SearchFormComponent } from './search.form.component/search.form.component';
import { ResultsTableComponent } from './results-table/results-table.component';
import { DetailsComponent } from './details-table/details.component';
import { ServicesModule } from '../services/services.module';
import { SharedModule } from '../shared/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
    {
      path: '',
      component: MusicComponent,
      children: [
        { path: '', component: SearchFormComponent },
        { path: 'results', component: ResultsTableComponent },
        { path: 'details/:id', component: DetailsComponent },
      ],
    },
  ];

@NgModule({
  declarations: [
    SearchFormComponent,
    ResultsTableComponent,
    DetailsComponent,
    MusicComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    ServicesModule,
    FormsModule,
    SharedModule, MatTabsModule, MatProgressSpinnerModule,  MatFormFieldModule,
    MatInputModule,
    MatButtonModule,  ],
})
export class MusicModule {}
