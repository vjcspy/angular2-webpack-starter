import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {ShopManageActions} from "./actions";
import {Observable} from "rxjs/Observable";
import {ShopManageService} from "./service";
import {NotifyManager} from "../../../../services/notify-manager";
import {RouterActions} from "../../../../R/router/router.actions";

@Injectable()
export class ShopManageEffects {
  
  constructor(protected store$: Store<any>,
              protected actions$: Actions,
              protected shopManageService: ShopManageService,
              protected shopManageActions: ShopManageActions,
              protected routerActions: RouterActions,
              protected notify: NotifyManager) { }
  
  @Effect() saveRole = this.actions$
                           .ofType(
                             ShopManageActions.ACTION_SAVE_ROLE
                           )
                           .switchMap((z: any) => {
                             const action = z;
                             return Observable.fromPromise(this.shopManageService.saveRole(action.payload['role']))
                                              .map(() => this.shopManageActions.saveRoleSuccess(false))
                                              .catch((e) => {
                                                const reason = e && e['reason'] ? e['reason'] : e['error'];
                                                this.notify.error(reason);
                                                return Observable.of(this.shopManageActions.saveRoleFail(reason, e, false));
                                              });
                           });
  
  @Effect() deleteRole = this.actions$
                             .ofType(
                               ShopManageActions.ACTION_DELETE_ROLE
                             )
                             .switchMap((z: any) => {
                               const action: Action = z;
                               return Observable.fromPromise(this.shopManageService.deleteRole(action.payload['role']))
                                                .map(() => this.shopManageActions.deleteRoleSuccess(false))
                                                .catch((e) => {
                                                  const reason = e && e['reason'] ? e['reason'] : e['error'];
                                                  this.notify.error(reason);
                                                  return Observable.of(this.shopManageActions.deleteRoleFail(reason, e, false));
                                                });
                             });
  
  @Effect() savePermissions = this.actions$
                                  .ofType(
                                    ShopManageActions.ACTION_SAVE_PERMISSION
                                  )
                                  .switchMap((z: any) => {
                                    const action: Action = z;
    
                                    return Observable.fromPromise(this.shopManageService.savePermissions(action.payload['permissions'], action.payload['code']))
                                                     .map(() => {
                                                       this.notify.success("save_permissions_successfully");
                                                       this.routerActions.go('cloud/default/user-management/roles');
                                                       return this.shopManageActions.savePermissionSuccess(false);
                                                     })
                                                     .catch((e) => {
                                                       const reason = e && e['reason'] ? e['reason'] : e['error'];
                                                       this.notify.error(reason);
                                                       return Observable.of(this.shopManageActions.savePermissionFail(reason, e, false));
                                                     });
                                  });
  
  @Effect() saveCashier = this.actions$
                              .ofType(
                                ShopManageActions.ACTION_SAVE_CASHIER
                              )
                              .switchMap((z: any) => {
                                const action: Action = z;
    
                                return Observable.fromPromise(this.shopManageService.saveCashier(action.payload['cashier']))
                                                 .map(() => {
                                                   this.notify.success("save_cashier_successfully");
                                                   this.routerActions.go('cloud/default/user-management/cashier/list');
                                                   return this.shopManageActions.saveCashierSuccess(false);
                                                 })
                                                 .catch((e) => {
                                                   const reason = e && e['reason'] ? e['reason'] : e['error'];
                                                   this.notify.error(reason);
                                                   return Observable.of(this.shopManageActions.saveCashierFail(reason, e, false));
                                                 });
                              });
}