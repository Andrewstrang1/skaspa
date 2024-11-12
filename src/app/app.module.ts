import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeatureModule } from './feature/feature.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicesModule } from './services/services.module';
import { ApiIntegrationComponent } from './features/api-integration/api-integration/api-integration.component';


@NgModule({
  declarations: [
    AppComponent,
    ApiIntegrationComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FeatureModule,
    BrowserAnimationsModule,
    ServicesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
