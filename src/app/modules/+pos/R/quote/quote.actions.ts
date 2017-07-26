import {Injectable} from '@angular/core';
import {Customer} from "../../core/framework/customer/Model/Customer";
import {Action, Store} from "@ngrx/store";
import {CustomerDB} from "../../database/xretail/db/customer";
import {Product} from "../../core/framework/catalog/Model/Product";
import {DataObject} from "../../core/framework/General/DataObject";

@Injectable()
export class PosQuoteActions {
  
  // push item buy request
  static ACTION_ADD_ITEM_BUY_REQUEST_TO_QUOTE = 'ACTION_ADD_ITEM_BUY_REQUEST_TO_QUOTE';
  // when product has options, we will wait options has been selected
  static ACTION_WAIT_GET_PRODUCT_OPTIONS      = 'ACTION_WAIT_GET_PRODUCT_OPTIONS';
  
  /**
   ** @REDUCER:
   *
   * product has been added so we need update quote state items
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_UPDATE_QUOTE_ITEMS = 'ACTION_UPDATE_QUOTE_ITEMS';
  
  updateQuoteItems(items, dispatch: boolean = true): Action {
    const action = {type: PosQuoteActions.ACTION_UPDATE_QUOTE_ITEMS, payload: {items}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save customer
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Init default customer address
   */
  static ACTION_SET_CUSTOMER_TO_QUOTE = 'ACTION_SET_CUSTOMER_TO_QUOTE';
  
  setCustomerToQuote(customerEntity: Customer | CustomerDB, needResolveBilling = true, needResolveShipping = true, dispatch: boolean = true): Action {
    let customer = new Customer();
    customer.mapWithParent(customerEntity);
    
    let action = {type: PosQuoteActions.ACTION_SET_CUSTOMER_TO_QUOTE, payload: {customer, needResolveBilling, needResolveShipping}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_NEED_RESOLVE_QUOTE = 'ACTION_NEED_RESOLVE_QUOTE';
  static ACTION_RESOLVE_QUOTE      = 'ACTION_RESOLVE_QUOTE'; // after resolve quote, we will save total and update some data
  
  constructor(private store$: Store<any>) {}
  
  static ACTION_INIT_DEFAULT_ADDRESS_OF_CUSTOMER = 'ACTION_INIT_DEFAULT_ADDRESS_OF_CUSTOMER';
  
  setAddressToQuote(shippingAdd, billingAdd, needResolveBilling, needResolveShipping, dispatch: boolean = true): Action {
    const action = {
      type: PosQuoteActions.ACTION_INIT_DEFAULT_ADDRESS_OF_CUSTOMER,
      payload: {shippingAdd, billingAdd, needResolveBilling, needResolveShipping}
    };
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_SELECT_PRODUCT_TO_ADD = 'ACTION_SELECT_PRODUCT_TO_ADD';
  
  selectProductToAdd(productEntity: Product, qty: number = 1, forceProductCustomOptions: boolean = false, config: Object = null, showDetail: boolean = false, dispatch: boolean = true) {
    let product = new Product();
    product.mapWithParent(productEntity);
    
    const action = {
      type: PosQuoteActions.ACTION_SELECT_PRODUCT_TO_ADD,
      payload: {product, qty, forceProductCustomOptions, config, showDetail}
    };
    if (dispatch) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_CLEAR_QUOTE = 'ACTION_CLEAR_QUOTE';
  
  clearQuote(dispatch: boolean = true): Action {
    const action = {type: PosQuoteActions.ACTION_CLEAR_QUOTE, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  editProductOptionBuyRequest(product: Product, buyRequest: DataObject) {
    this.store$.dispatch({type: PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS, payload: {product, buyRequest, currentProcessing: 'EDIT'}});
  }
  
  /**
   ** @REDUCER:
   *
   * Update quote info (shift, refund...)
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   *
   */
  static ACTION_UPDATE_QUOTE_INFO = 'ACTION_UPDATE_QUOTE_INFO';
  
  updateQuoteInfo(info, dispatch: boolean = true): Action {
    const action = {type: PosQuoteActions.ACTION_UPDATE_QUOTE_INFO, payload: {info}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  /**
   ** @REDUCER:
   *
   * Save customer, items
   *-----------------------------------------------------------------
   ** @EFFECTS-ACTION:
   *
   * Resolve quote
   */
  static ACTION_REORDER = 'ACTION_REORDER';
  
  reorder(orderData, dispatch: boolean = true): Action {
    const action = {type: PosQuoteActions.ACTION_REORDER, payload: {orderData}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_QUOTE_ADD_ITEM_ERROR = 'ACTION_QUOTE_ADD_ITEM_ERROR';
  
  quoteAddItemError(item, dispatch: boolean = true): Action {
    const action = {type: PosQuoteActions.ACTION_QUOTE_ADD_ITEM_ERROR, payload: {item}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_ADD_SHIPPING_AMOUNT = 'ACTION_ADD_SHIPPING_AMOUNT';
  
  addShippingAmount(shippingAmount, shippingAdd = null, dispatch: boolean = true): Action {
    const action = {type: PosQuoteActions.ACTION_ADD_SHIPPING_AMOUNT, payload: {shippingAmount, shippingAdd}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
  
  static ACTION_REMOVE_SHIPPING = 'ACTION_REMOVE_SHIPPING';
  
  removeShipping(dispatch: boolean = true): Action {
    const action = {type: PosQuoteActions.ACTION_REMOVE_SHIPPING, payload: {}};
    
    if (dispatch === true) {
      this.store$.dispatch(action);
    }
    
    return action;
  }
}
