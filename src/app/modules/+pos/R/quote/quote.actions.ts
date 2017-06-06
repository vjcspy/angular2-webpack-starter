import {Injectable} from '@angular/core';
import {Customer} from "../../core/framework/customer/Model/Customer";
import {Store} from "@ngrx/store";
import {CustomerDB} from "../../database/xretail/db/customer";

@Injectable()
export class PosQuoteActions {
  
  static ACTION_ADD_ITEM_TO_QUOTE             = 'ACTION_ADD_ITEM_TO_QUOTE';
  static ACTION_SET_CUSTOMER_TO_QUOTE         = 'ACTION_SET_CUSTOMER_TO_QUOTE';
  static ACTION_INIT_DEFAULT_CUSTOMER_ADDRESS = 'ACTION_INIT_DEFAULT_CUSTOMER_ADDRESS';
  static ACTION_SET_SHIPPING_ADDRESS          = 'ACTION_SET_SHIPPING_ADDRESS';
  static ACTION_SET_BILLING_ADDRESS           = 'ACTION_SET_BILLING_ADDRESS';
  static ACTION_SET_SHIPPING_INFORMATION      = 'ACTION_SET_SHIPPING_INFORMATION';
  
  static ACTION_RESOLVE_QUOTE = 'ACTION_RESOLVE_QUOTE';
  
  static ACTION_UPDATE_QUOTE_INFO = 'ACTION_UPDATE_QUOTE_INFO';
  
  constructor(private store: Store<any>) {}
  
  setCustomerToQuote(customer: Customer | CustomerDB): void {
    this.store.dispatch({type: PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE, payload: {customer}});
  }
  
  updateQuoteInfoState(key: string, state: any) {
    let newState  = {};
    newState[key] = state;
    this.store.dispatch({type: PosQuoteActions.ACTION_UPDATE_QUOTE_INFO, payload: newState})
  }
}
