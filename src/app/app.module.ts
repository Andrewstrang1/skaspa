import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeatureModule } from './feature/feature.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServicesModule } from './services/services.module';
import { ApiIntegrationComponent } from './features/api-integration/api-integration/api-integration.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { MusicModule } from './music/music.module';

@NgModule({
  declarations: [
    AppComponent,
    ApiIntegrationComponent,
    SidebarComponent, NavbarComponent, HomeComponent  // Non-Material component
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FeatureModule, MusicModule,
    BrowserAnimationsModule,
    ServicesModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
