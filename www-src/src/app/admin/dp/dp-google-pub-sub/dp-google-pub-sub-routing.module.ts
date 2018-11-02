import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationGuard} from '../../../_shared/_guards/authentication.guard';
import {OfflineGuard} from '../../../_shared/_guards/offline.guard';
import {DpGooglePubSubComponent} from './dp-google-pub-sub.component';

const routes: Routes = [
  {
    path: '',
    component: DpGooglePubSubComponent,
    data: {permission: 'Admin'},
    canActivate: [OfflineGuard, AuthenticationGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DpGooglePubSubRoutingModule {
}
