import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {OrderService} from "../../../R/sales/orders/order.service";
import {PosConfigState} from "../../../../R/config/config.state";
import {OrdersState} from "../../../R/sales/orders/order.state";
import * as _ from 'lodash';
import {CountryHelper} from "../../../../core/framework/directory/Helper/CountryHelper";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-order-detail',
             templateUrl: 'detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersDetailComponent implements OnInit {
  protected _data = {
    totalPaid: {}, // cache total paid of order
    countryName: {}
  };
  
  protected countryHelper = new CountryHelper();
  
  @Input() configState: PosConfigState;
  @Input() ordersState: OrdersState;
  
  constructor(public orderService: OrderService) { }
  
  ngOnInit() { }
  
  getPayment() {
    let payments = [];
    _.forEach(this.getOrder()['payment'], (payment) => {
      if (_.isObject(payment)) {
        payments.push(payment);
      }
    });
    
    return payments;
  }
  
  getPaymentTitle(payment) {
    return payment['title'] + (payment['data'] && !!payment['data']['ref'] ?
        (": Ref# " + payment['data']['ref']) : "") + (parseInt(payment['is_purchase']) === 0 ? " REFUND" : "");
  }
  
  getOrder() {
    return this.ordersState.detail.order;
  }
  
  getTotalPaidBaseOnPayment() {
    if (!this._data.totalPaid.hasOwnProperty(this.getOrder()['id'])) {
      let paid = 0;
      _.forEach(this.getPayment(), p => {
        if (parseInt(p['is_purchase']) == 1)
          paid += parseFloat(p['amount']);
      });
      this._data.totalPaid[this.getOrder()['id']] = paid;
    }
    return this._data.totalPaid[this.getOrder()['id']];
  }
  
  getCountryNameFromId(country_id: string) {
    return this.countryHelper.getCountryNameFromId(country_id);
  }
  
  getRegionSelectedByCountryId(countryId, regionId) {
    return this.countryHelper.getRegionSelected(countryId, regionId);
  }
}