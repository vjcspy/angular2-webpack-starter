import {Injectable} from '@angular/core';
import {PosGeneralState} from "../general/general.state";
import {OfflineService} from "../../../share/provider/offline";
import * as _ from 'lodash';
import {PosQuoteState} from "../quote/quote.state";
import {PosOrderSync} from "./sync.state";
import {RequestService} from "../../../../services/request";
import {ApiManager} from "../../../../services/api-manager";
import {Observable} from "rxjs";
import {PosConfigState} from "../config/config.state";
import {Quote} from "../../core/framework/quote/Model/Quote";
import {Timezone} from "../../core/framework/General/DateTime/Timezone";
import {Item} from "../../core/framework/quote/Model/Quote/Item";
import {DatabaseManager} from "../../../../services/database-manager";
import {GeneralMessage} from "../../services/general/message";
import {StringHelper} from "../../services/helper/string-helper";

@Injectable()
export class PosSyncService {
  
  constructor(private onlineOffline: OfflineService,
              private requestService: RequestService,
              private apiManager: ApiManager,
              private db: DatabaseManager) { }
  
  prepareOrder(quoteState: PosQuoteState, generalState: PosGeneralState): PosOrderSync {
    const quote = quoteState.quote;
    let order   = {};
    
    order['outlet_id']           = generalState.outlet['id'];
    order['register_id']         = generalState.register['id'];
    order['retail_note']         = quote.getData('retail_note');
    order['user_id']             = generalState.user['id'];
    order['retail_has_shipment'] = quote.getData('retail_has_shipment');
    order['is_offline']          = !this.onlineOffline.online;
    
    order['items'] = [];
    _.forEach(quoteState.items.toArray(), (item) => {
      order['items'].push(Object.assign({}, {...item}, {product: null}));
    });
    
    order['account']              = {
      'group_id': quote.getCustomer().getCustomerGroupId(),
      'email': quote.getCustomer().getData('email')
    };
    order['customer_id']          = quote.getCustomer().getId();
    order['store_id']             = generalState.store['id'];
    order['order']                = {
      'billing_address': quote.getShippingAddress().toJS(),
      'shipping_address': quote.getBillingAddress().toJS(),
      'payment_method': 'retailmultiple',
      'shipping_method': 'retailshipping_retailshipping',
      'shipping_amount': quoteState.shippingAmount
    };
    order['retail_addition_data'] = quote.getRetailAdditionData();
    if (quote.getData('coupon_code')) {
      order['order'] ['coupon'] = {
        'code': quote.getData('coupon_code')
      };
    }
    if (quote.getData('discount_whole_order')) {
      order['order']['whole_order_discount'] = {
        'value': quote.getData('discount_whole_order'),
        'isPercentMode': !quote.getData('is_value_discount_whole_order')
      }
    }
    if (quote.getData('payment_data')) {
      order['order']['payment_data'] = quote.getData('payment_data');
    }
    if (quote.getData('is_exchange')) {
      order['order']['is_exchange'] = quote.getData('is_exchange');
    }
    
    if (quote.getData("reward_point")) {
      order['reward_point'] = quote.getData("reward_point");
    }
    
    return <any>order;
  }
  
  prepareOrderOffline(quoteState: PosQuoteState, generalState: PosGeneralState, configState: PosConfigState) {
    const order        = this.prepareOrder(quoteState, generalState);
    order['retail_id'] = this.getOrderClientId(configState.orderCount);
    
    const quote: Quote = quoteState.quote;
    
    let orderOffline = {
      retail_id: this.getOrderClientId(configState.orderCount),
      retail_status: null,
      retail_note: order['retail_note'],
      customer: {
        id: quote.getCustomer().getId(),
        name: quote.getCustomer().getData('first_name') +
              " " +
              quote.getCustomer().getData('last_name'),
        email: quote.getCustomer().getData('email'),
        phone: quote.getCustomer().getData('telephone')
      },
      items: [],
      billing_address: quote.getBillingAddress().toJS(),
      shipping_address: quote.getShippingAddress().toJS(),
      payment: quote.getData('payment_data'),
      totals: {
        "shipping_incl_tax": quote.getShippingAddress().getData('shipping_incl_tax'),
        "shipping": quote.getShippingAddress().getData('shipping'),
        "subtotal": quote.getShippingAddress().getData('subtotal'),
        "subtotal_incl_tax": quote.getShippingAddress().getData('subtotal_incl_tax'),
        "tax": quote.getShippingAddress().getData('tax_only'),
        "discount": quote.getShippingAddress().getData('discount'),
        'retail_discount_pert_item': quote.getShippingAddress().getData('retail_discount_per_item'),
        "reward_point_discount_amount": (_.isObject(quote.getData('reward_point')) && quote.getData(
          'reward_point')['use_reward_point']) ?
          quote.getData('reward_point')['reward_point_discount_amount'] :
          null,
        "grand_total": quote.getShippingAddress().getData('grand_total')
      },
      sync_data: order,
      pushed: 0,
      has_shipment: order['retail_has_shipment'] == true,
      user_id: generalState.user['id'],
      created_at: Timezone.getCurrentStringTime()
    };
    
    orderOffline['retail_status'] = this.getRetailStatus(quote);
    
    // init item data for order detail
    orderOffline ['items'] = this.prepareOrderItem(quote.getShippingAddress().getItems());
    
    return orderOffline;
  }
  
  prepareOrderItem(quoteItems: Item[]) {
    let items = [];
    _.forEach(quoteItems, (item: Item) => {
      if (item.getParentItem()) {
        return true;
      }
      let _item = this.initItemData(item);
      //if bundle product will be response children items
      if (item.getHasChildren() && item.getProduct().getTypeId() == 'bundle') {
        _.forEach(item.getChildren(), (child: Item) => {
          _item['children'].push(this.initItemData(child));
        });
      }
      items.push(_item);
    });
    
    return items;
  }
  
  syncOrderOnline(orderData: Object, generalState: PosGeneralState): Observable<any> {
    return this.requestService.makePost(this.apiManager.get('loadOrderData', generalState.baseUrl), orderData);
  }
  
  saveOrderOnline(quoteState: PosQuoteState, generalState: PosGeneralState, configState: PosConfigState): Promise<GeneralMessage> {
    const orderOffline = this.prepareOrderOffline(quoteState, generalState, configState);
    return this.pushOrderOfflineToServer(orderOffline, generalState, false);
  }
  
  saveOrderOffline(quoteState: PosQuoteState, generalState: PosGeneralState, configState: PosConfigState) {
    const orderOffline = this.prepareOrderOffline(quoteState, generalState, configState);
    const db           = this.db.getDbInstance();
    
    return new Promise((resolve, reject) => {
      db.orders.add(<any>orderOffline).then((id) => {
        orderOffline['id'] = id;
        resolve(orderOffline);
      }).catch((e) => reject(e));
    });
  }
  
  autoGetAndPushOrderOffline(generalState: PosGeneralState): Promise<GeneralMessage> {
    return new Promise((resolve, reject) => {
      const db = this.db.getDbInstance();
      db.orders.where("pushed").equals(0).first().then((order) => {
        if (!!order && !!order['id']) {
          return this.pushOrderOfflineToServer(order, generalState)
                     .then(
                       (res) => resolve(res),
                       (rej) => reject(rej)
                     );
        } else {
          return resolve({data: {syncAllOfflineOrder: true, mess: "Nothing to push"}});
        }
      });
    });
  }
  
  protected getRetailStatus(quote: Quote) {
    let paid = 0;
    let retail_status;
    if (_.isArray(quote.getData('payment_data'))) {
      _.forEach(quote.getData('payment_data'), (method) => {
        paid += method['amount'];
      });
    }
    if (quote.getData('is_exchange')) {
      if (quote.getData('retail_has_shipment')) {
        retail_status = 9;
      } else {
        retail_status = 10;
      }
    }
    else if (Math.abs(paid - quote.getShippingAddress().getGrandTotal()) > 0.01) {
      if (quote.getData('retail_has_shipment')) {
        retail_status = 2;
      } else {
        retail_status = 3;
      }
    } else {
      if (quote.getData('retail_has_shipment')) {
        retail_status = 12;
      } else {
        retail_status = 13;
      }
    }
    
    return retail_status;
  }
  
  protected pushOrderOfflineToServer(orderOffline: any, generalState: PosGeneralState, saveDBIfError: boolean = true): Promise<GeneralMessage> {
    const db = this.db.getDbInstance();
    return new Promise((resolve, reject) => {
      this.requestService.makePost(this.apiManager.get("saveOrder", generalState.baseUrl), orderOffline['sync_data'])
          .subscribe(
            () => {
              orderOffline.pushed = 1;
              db.orders.put(<any>orderOffline)
                .then(() => resolve({data: {orderOffline, isPushSuccess: true}}))
                .catch((e) => reject({isError: true, e}));
            },
            (e) => {
              let message;
              if (e.status == 400) {
                let _mess = JSON.parse(e['_body']);
                if (_mess.hasOwnProperty('message')) {
                  message = _mess['message'];
                }
                else {
                  message = "Unknown error when push order to server";
                }
              } else {
                message = "Unknown error when push order to server";
              }
              if (saveDBIfError) {
                orderOffline['retail_note'] = message;
                orderOffline.pushed         = 3;
            
                db.orders.put(<any>orderOffline)
                  .then(() => resolve({data: {orderOffline, isPushSuccess: false}}))
                  .catch((e) => reject({isError: true, e}));
              } else {
                reject({isError: true, e});
              }
            })
    });
  }
  
  protected getOrderClientId(orderCount) {
    return (StringHelper.pad(orderCount.register_id, 3) +
            // StringHelper.pad(this.userDataManagement.getUserId(), 3) +
            StringHelper.pad(parseFloat(orderCount.order_count) + 1, 8)).toString();
  }
  
  protected initItemData(item: Item) {
    let sku;
    if (item.getProduct().getTypeId() === 'configurable') {
      const child = item.getChildren()[0];
      if (child) {
        sku = child.getProduct().getData('sku');
      }
    } else {
      sku = item.getProduct().getData('sku');
    }
    return {
      "name": item.getProduct().getData('name'),
      "id": item.getProduct().getData('id'),
      "type_id": item.getProduct().getTypeId(),
      "sku": sku,
      "qty_ordered": item.getQty(),
      "row_total": item.getData('row_total'),
      "row_total_incl_tax": item.getData('row_total_incl_tax'),
      "product_options": item.getData('product_options'),
      "buy_request": item.getData('buy_request'),
      "origin_image": item.getProduct().getData('origin_image'),
      "children": []
    };
  }
}
