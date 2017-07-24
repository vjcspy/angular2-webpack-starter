import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {CheckoutPopup, CheckoutPopupState} from "../../../../../R/sales/checkout/popup/popup.state";
import {CountryHelper} from "../../../../../../core/framework/directory/Helper/CountryHelper";
import {PosQuoteState} from "../../../../../../R/quote/quote.state";
import {PosQuoteActions} from "../../../../../../R/quote/quote.actions";
import * as _ from 'lodash';
import {CheckoutPopupActions} from "../../../../../R/sales/checkout/popup/popup.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-checkout-popup-customer-detail-list-address',
             templateUrl: 'list-address.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class PosDefaultSalesCheckoutPopupCustomerDetailListAddressComponent implements OnInit {
  @Input() checkoutPopupState: CheckoutPopupState;
  @Input() quoteState: PosQuoteState;
  
  public currentShippingAddId;
  public shippingAmount;
  
  constructor(protected posQuoteActions: PosQuoteActions,
              protected checkoutPopupActions: CheckoutPopupActions) { }
  
  ngOnInit() {
    if (this.quoteState.shippingAdd && this.quoteState.shippingAdd.hasOwnProperty('id')) {
      this.currentShippingAddId = this.quoteState.shippingAdd['id'];
    }
    this.shippingAmount = this.quoteState.shippingAmount;
  }
  
  getCustomerFullAddress(address) {
    if (address.hasOwnProperty("region") && typeof address['region'] !== "undefined" && address['region'] !== null) {
      return address['street'] + " " + address['region'];
    } else {
      let _add = address['street'];
      
      if (address.hasOwnProperty('country_id')) {
        _add += ` ${CountryHelper.getCountryNameFromId(address['country_id'])}`;
      }
      
      if (address.hasOwnProperty("region_id") && address.hasOwnProperty('country_id')) {
        _add += ` ${CountryHelper.getRegionSelected(address['country_id'], address['region_id'])}`;
      }
      
      return _add;
    }
  }
  
  isShippingPopup() {
    return this.checkoutPopupState.popupOpening === CheckoutPopup.CUSTOMER_SHIPPING;
  }
  
  changeShippingAmount($event) {
    this.posQuoteActions.addShippingAmount($event.target['value']);
  }
  
  addShipment() {
    let shippingAdd = _.find(this.checkoutPopupState.customerPopup.customer['address'], (_add) => parseInt(_add['id']) === parseInt(this.currentShippingAddId));
    this.posQuoteActions.addShippingAmount(this.shippingAmount, shippingAdd);
  }
  
  removeShipping() {
    this.posQuoteActions.removeShipping();
  }
  
  addEditAddress(address = {}) {
    this.checkoutPopupActions.addNewCustomerAddress(address);
  }
}
