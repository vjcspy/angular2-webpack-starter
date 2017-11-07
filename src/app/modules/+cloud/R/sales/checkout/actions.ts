import {Injectable} from '@angular/core';
import {Action, Store} from "@ngrx/store";

@Injectable()
export class CheckoutActions {
  static ACTION_CALCULATE_TOTALS = 'ACTION_CALCULATE_TOTALS';
  
  calculateTotal(plan, product_id, dispatch: boolean = true): Action {
    const action = {type: CheckoutActions.ACTION_CALCULATE_TOTALS, payload: {plan, product_id}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_CALCULATE_TOTAL_SUCCESS = 'ACTION_CALCULATE_TOTAL_SUCCESS';
  
  calculateTotalSuccess(totals, dispatch: boolean = true): Action {
    const action = {type: CheckoutActions.ACTION_CALCULATE_TOTAL_SUCCESS, payload: {totals}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_CALCULATE_TOTAL_FAIL = 'ACTION_CALCULATE_TOTAL_FAIL';
  
  calculateTotalFail(mess, e, dispatch: boolean = true): Action {
    const action = {type: CheckoutActions.ACTION_CALCULATE_TOTAL_FAIL, payload: {mess, e}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  constructor(protected store$: Store<any>) { }
}
