import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { MusicComponent } from './music.component';
import { SearchFormComponent } from './search.form.component/search.form.component';
import { ResultsTableComponent } from './results-table/results-table.component';
import { DetailsTableComponent } from './details-table/details-table.component';
import { ServicesModule } from '../services/services.module';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    {
      path: '',
      component: MusicComponent,
      children: [
        { path: '', redirectTo: 'search', pathMatch: 'full' }, // Default to search
        { path: 'search', component: SearchFormComponent },
        { path: 'results', component: ResultsTableComponent },
        { path: 'details/:id', component: DetailsTableComponent },
      ],
    },
  ];

@NgModule({
  declarations: [
    SearchFormComponent,
    ResultsTableComponent,
    DetailsTableComponent,
    MusicComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ServicesModule,
    FormsModule,
    SharedModule
  ],
})
export class MusicModule {}
