import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataServicesService } from './data-services.service';
import { ApiServicesService } from './api-services.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [DataServicesService, ApiServicesService]
})
export class ServicesModule { }
