import {Routes} from "@angular/router";
import {DefaultContainerComponent} from "./view/default-container.component";
import {CloudComponent} from "./cloud.component";
import {AuthGuard} from "../../services/router-guard/auth-guard";

export const CLOUD_ROUTES: Routes = [
  {
    path: '',
    component: CloudComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'default',
        component: DefaultContainerComponent,
      }
    ]
  }
];
