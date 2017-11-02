import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import {ConfigurationsState} from "../../../../R/index";
import {RouterActions} from "../../../../../../../../R/router/router.actions";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-region-grid',
             templateUrl: 'grid.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosRegionGridComponent {
  configurations$: Observable<ConfigurationsState>;
  
  constructor(private store$: Store<any>,
              private routerActions: RouterActions) {
    this.configurations$ = this.store$.select('configurations');
  }
  
  newRegion() {
    this.routerActions.go('pos/configurations/default/pos/region/edit', 0);
  }
}
