import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'music', loadChildren: () => import('./music/music.module').then(m => m.MusicModule) },
  { path: 'feature', loadChildren: () => import('./feature/feature.module').then(m => m.FeatureModule) },
  { path: '**', redirectTo: 'home' } // Redirect any unknown routes to home
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
