import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {OrderService} from "../../../R/sales/orders/order.service";
import {PosConfigState} from "../../../../R/config/config.state";
import {OrdersState} from "../../../R/sales/orders/order.state";
import * as _ from 'lodash';
import {CountryHelper} from "../../../../core/framework/directory/Helper/CountryHelper";
import {PosQuoteActions} from "../../../../R/quote/quote.actions";
import {RouterActions} from "../../../../../../R/router/router.actions";
import {ReceiptActions} from "../../../R/sales/receipts/receipt.actions";
import {OrderListAddPaymentActions} from "../../../R/sales/checkout/step/order-list-add-payment/add-payment.actions";
import {AuthenticateService} from "../../../../../../services/authenticate";
import {NotifyManager} from "../../../../../../services/notify-manager";
import {QuoteRefundActions} from "../../../../R/quote/refund/refund.actions";
import {OrderDetailActions} from "../../../R/sales/orders/detail/detail.actions";
import {OfflineService} from "../../../../../share/provider/offline";
import {UserCollection} from "../../../../../../services/meteor-collections/users";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-sales-order-detail',
             templateUrl: 'detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultSalesOrdersDetailComponent {
  protected _data = {
    totalPaid: {}, // cache total paid of order
    countryName: {}
  };

  @Input() configState: PosConfigState;
  @Input() ordersState: OrdersState;

  constructor(public orderService: OrderService,
              protected quoteActions: PosQuoteActions,
              protected routerActions: RouterActions,
              protected authService: AuthenticateService,
              private notify: NotifyManager,
              private offline: OfflineService,
              private detailActions: OrderDetailActions,
              protected receiptActions: ReceiptActions,
              protected refundActions: QuoteRefundActions,
              protected userCollection: UserCollection,
              protected addPaymentActions: OrderListAddPaymentActions) { }

  getPayment() {
    let payments = [];
    _.forEach(this.getOrder()['payment'], (payment) => {
      if (_.isObject(payment)) {
        payments.push(payment);
      }
    });
    let roundingPayment = _.filter(payments, (payment) => {
      return payment['type'] === 'rounding_cash';
    });
    _.remove(payments, (payment) => {
      return payment['type'] === 'rounding_cash';
    });
    if (!!roundingPayment && _.isArray(roundingPayment)) {
      _.forEach(_.reverse(roundingPayment), (payment) => {
        if (_.isObject(payment)) {
          payments.unshift(payment);
        }
      });
    }
    return payments;
  }

  getPaymentTitle(payment) {
    return payment['title'] + (payment['data'] && !!payment['data']['ref'] ?
        (": Ref# " + payment['data']['ref']) : "") + (parseInt(payment['is_purchase']) === 0 ? " REFUND" : "");
  }

  addNoteOrder () {
    if(this.ordersState.detail.order['add_note'] === true) {
      let noteData = {
        "order_id": this.ordersState.detail.order['order_id'],
        "retail_note": this.ordersState.detail.order['retail_note']
      };

      this.detailActions.noteOrder(this.getOrder(), noteData);
      this.ordersState.detail.order['add_note'] = false;

    } else {
      this.ordersState.detail.order['add_note'] = true;
    }
  }

  getOrder() {
    return this.ordersState.detail.order;
  }

  getTotalPaidBaseOnPayment() {
    let paid = 0;
    _.forEach(this.getPayment(), (p) => {
      if (parseInt(p['is_purchase']) === 1 || p['is_purchase'] === true) {
        paid += parseFloat(p['amount']);
      }
    });
    if (this.getOrder()['retail_status'] == 51 || this.getOrder()['retail_status'] == 52 || this.getOrder()['retail_status'] == 53) {
      if (_.isArray(this.getOrder()['payment']) && _.size(this.getOrder()['payment']) === 2) {
        paid = this.getOrder()['totals']['grand_total'];
      }
    }

    return paid;
  }

  getCountryNameFromId(country_id: string) {
    return CountryHelper.getCountryNameFromId(country_id);
  }

  getRegionSelectedByCountryId(countryId, regionId) {
    return CountryHelper.getRegionSelected(countryId, regionId);
  }

  reorder() {
    this.routerActions.go('pos/default/sales/checkout');
    setTimeout(() => {
      this.quoteActions.reorder({customer: parseInt(this.getOrder()['customer']['id']), items: this.getOrder()['items']});
    }, 250);
  }

  printReceipt(type: string = 'receipt') {
    this.receiptActions.printSalesReceipt(this.getOrder(), type);
  }

  addPayments() {
    this.addPaymentActions.needAddPayment(this.getOrder());
  }

  refund() {
    if (!this.offline.online) {
      this.notify.warning("sorry_you_can_not_perform_this_action_in_offline");
      return;
    }
    if (this.authService.userCan('make_refund')) {
      if (this.getOrder()['can_creditmemo'] && this.getOrder()['order_id']) {
        const orderId = parseInt(this.getOrder()['order_id']);
        this.routerActions.go('pos/default/sales/checkout');
        setTimeout(() => {
          this.quoteActions.reorder({customer: parseInt(this.getOrder()['customer']['id']), items: []});
          this.refundActions.loadCreditmemo(orderId);
        }, 250);
      }
    } else {
      this.notify.error("not_have_permission_to_make_refund");
    }
  }

  markAsReSynnc() {
    if (!this.getOrder()['id']) {
      delete this.getOrder()['id'];
    }
    this.detailActions.markAsReSync(this.getOrder());
  }

  ship() {
    if (!this.offline.online) {
      this.notify.warning("sorry_you_can_not_perform_this_action_in_offline");
      return;
    }
    this.detailActions.shipOrder(this.getOrder());
  }

  sendEmailReceipt() {
    if (this.offline.online) {
      const email = this.getOrder()['customer']['email'];
      let re      = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(email) === false) {
        return this.notify.warning("email_not_valid");
      }
      let name = this.getOrder()['customer']['name'];
      let settingReceipt = {
        receiptSetting: this.configState.receipt,
        username: this.userCollection.getUserNameById(this.getOrder()['user_id']),
        inclDiscountPerItemInDiscount: this.configState.posRetailConfig.inclDiscountPerItemInDiscount
      };
      this.receiptActions.sendEmailReceipt(this.getOrder(), email, name, settingReceipt);
    } else {
      this.notify.warning("sorry_you_can_not_send_email_in_offline");
    }
  }

  checkoutAsGuest(): boolean {
    if (this.getOrder().hasOwnProperty('customer')) {
      return parseInt(this.getOrder()['customer']['id']) === parseInt(this.configState.setting.customer.getDefaultCustomerId());
    } else {
      return false;
    }
  }
}
