import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataServicesService } from './data-services.service';
import { ApiService } from './api-services.service';
import { SearchCriteriaService } from '../music/services/search-criteria.service';
import { LoggerService } from './logger.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [DataServicesService, ApiService, SearchCriteriaService, LoggerService],
 
})
export class ServicesModule { }
