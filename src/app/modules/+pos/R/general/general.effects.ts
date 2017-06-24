import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosGeneralActions} from "./general.actions";
import {RootActions} from "../../../../R/root.actions";
import {PosGeneralService} from "./general.service";
import {PosPullActions} from "../entities/pull.actions";
import {AccountActions} from "../../../../R/account/account.actions";
import {AccountState} from "../../../../R/account/account.state";
import * as _ from 'lodash';
import {List} from "immutable";
import {PosEntitiesState} from "../entities/entities.state";
import {OutletDB} from "../../database/xretail/db/outlet";
import {Observable} from "rxjs";
import {StoreDB} from "../../database/xretail/db/store";
import {RouterActions} from "../../../../R/router/router.actions";
import {PosGeneralState} from "./general.state";

@Injectable()
export class PosGeneralEffects {
  
  constructor(private store$: Store<any>,
              private actions$: Actions,
              private generalActions: PosGeneralActions,
              private generalService: PosGeneralService,
              private pullActions: PosPullActions,
              private routerActions: RouterActions,
              private rootActions: RootActions) { }
  
  @Effect() pullGeneralDataFromSever = this.actions$.ofType(PosGeneralActions.ACTION_SELECT_WEBSITE)
                                           .map(() => {
                                             return this.pullActions.pullEntities(['stores', 'outlet', 'retailConfig'], false);
                                           });
  
  @Effect() resolveUrls = this.actions$
                              .ofType(
                                AccountActions.SAVE_LICENSE_DATA
                              )
                              .withLatestFrom(this.store$.select('account'))
                              .filter((z) => {
                                const accountState: AccountState = <any>z[1];
                                return !!accountState.license && !!accountState.license.licenseHasPos && _.isArray(accountState.license.licenseHasPos['base_url']);
                              })
                              .map((z) => {
                                const accountState: AccountState = <any>z[1];
                                let listUrl                      = List.of();
                                const urls                       = accountState.license.licenseHasPos['base_url'];
                                _.forEach(urls, (url) => {
                                  if (url['status'] == 1) {
                                    listUrl = listUrl.push({
                                                             url: url['url'],
                                                             is_default: false,
                                                             isMage1: false
                                                           });
                                  }
                                });
    
                                return this.generalActions.resolvedUrls(urls, false);
                              });
  
  @Effect() saveOutletAndRegister = this.actions$
                                        .ofType(PosGeneralActions.ACTION_SELECT_OUTLET_REGISTER)
                                        .withLatestFrom(this.store$.select('entities'))
                                        .map((z) => {
                                          const outletId                   = z[0].payload['outletId'];
                                          const entities: PosEntitiesState = z[1];
                                          const outlets: List<OutletDB>    = entities.outlet.items;
    
                                          const outlet = outlets.find((o) => parseInt(o['id'] + '') === parseInt(outletId + ''));
    
                                          if (!outlet) {
                                            Observable.throw(new Error("Can't find outlet when saveOutletAndRegister"));
                                          }
                                          const storeId               = outlet['store_id'];
                                          const stores: List<StoreDB> = entities.stores.items;
                                          const store                 = stores.find((o) => parseInt(o['id'] + '') === parseInt(storeId + ''));
    
                                          if (!store) {
                                            Observable.throw(new Error("Can't find store when saveOutletAndRegister"));
                                          }
    
                                          const registerId       = z[0].payload['registerId'];
                                          const registers: any[] = outlet['registers'];
    
                                          const register = _.find(registers, (o) => parseInt(o['id'] + '') === parseInt(registerId + ''));
    
                                          if (!register) {
                                            Observable.throw(new Error("Can't find register when saveOutletAndRegister"));
                                          }
    
                                          this.generalService.saveGeneralDataToDB({outlet, store, register});
    
                                          return this.generalActions.saveGeneralData({outlet, store, register}, true, false);
                                        });
  
  @Effect() redirectAfterSaveGeneralData = this.actions$
                                               .ofType(PosGeneralActions.ACTION_SAVE_STATE)
                                               .withLatestFrom(this.store$.select('general'))
                                               .map((z) => {
                                                 const generalState: PosGeneralState = <any>z[1];
    
                                                 if ((z[0] as Action).payload['needRedirect'] === true) {
                                                   this.routerActions.go(generalState.redirect);
                                                 }
    
                                                 return this.rootActions.nothing("Redirect after save state");
                                               });
  
  @Effect() goOutletRegister = this.actions$
                                   .ofType(PosGeneralActions.ACTION_GO_OUTLET_REGISTER_PAGE)
                                   .map(() => {
                                     this.routerActions.go('pos/default/outlet-register');
                                     return this.rootActions.nothing("GO to outlet and register page");
                                   });
  
  @Effect() clearGeneralDataWhenLogout = this.actions$
                                             .ofType(AccountActions.ACTION_LOGOUT)
                                             .map(() => {
                                               this.generalService.removeGeneralDataInStorage();
                                               return this.generalActions.saveGeneralData({
                                                                                            outlet: {},
                                                                                            store: {},
                                                                                            register: {},
                                                                                            baseUrl: null,
                                                                                            urls: List.of()
                                                                                          }, false, false);
                                             })
}
