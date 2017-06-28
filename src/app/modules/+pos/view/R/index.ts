import {createReducer} from "../../../../R/index";
import {EffectsModule} from "@ngrx/effects";
import {CheckoutProductEffects} from "./sales/checkout/product/product.effects";
import {CheckoutProductActions} from "./sales/checkout/product/product.actions";
import {CheckoutProductService} from "./sales/checkout/product/product.service";
import {CheckoutProductState} from "./sales/checkout/product/product.state";
import {checkoutProductReducer} from "./sales/checkout/product/product.reducers";
import {cartCustomerReducer} from "./sales/checkout/cart/customer.reducer";
import {CartCustomerState} from "./sales/checkout/cart/customer.state";
import {CartCustomerActions} from "./sales/checkout/cart/customer.actions";
import {CartCustomEffects} from "./sales/checkout/cart/customer.effects";
import {CartCustomerService} from "./sales/checkout/cart/customer.service";
import {cartItemReducer} from "./sales/checkout/cart/item.reducer";
import {CartItemState} from "./sales/checkout/cart/item.state";
import {CartTotalsState} from "./sales/checkout/cart/totals.state";
import {cartTotalsReducer} from "./sales/checkout/cart/totals.reducer";
import {CartItemActions} from "./sales/checkout/cart/item.actions";
import {CartItemEffects} from "./sales/checkout/cart/item.effects";
import {CartItemService} from "./sales/checkout/cart/item.service";
import {CartActionBarState} from "./sales/checkout/cart/action-bar.state";
import {cartActionBarReducer} from "./sales/checkout/cart/action-bar.reducer";
import {productOptionsReducer} from "./sales/checkout/popup/product-options.reducer";
import {ProductOptionsState} from "./sales/checkout/popup/product-options.state";
import {CartActionBarActions} from "./sales/checkout/cart/action-bar.actions";
import {CartTotalsActions} from "./sales/checkout/cart/totals.actions";
import {ProductOptionsEffects} from "./sales/checkout/popup/product-options.effects";
import {ProductOptionsActions} from "./sales/checkout/popup/product-options.actions";
import {ProductOptionsService} from "./sales/checkout/popup/product-options.service";
import {CartActionBarService} from "./sales/checkout/cart/action-bar.service";
import {CartActionBarEffects} from "./sales/checkout/cart/action-bar.effects";
import {PosViewRouterEffects} from "./router/router-effects";
import {posStepReducer} from "./sales/checkout/step/step.reducer";
import {PosStepState} from "./sales/checkout/step/step.state";
import {PosStepActions} from "./sales/checkout/step/step.actions";
import {PosStepEffects} from "./sales/checkout/step/step.effects";
import {PosStepService} from "./sales/checkout/step/step.service";
import {TyroEffects} from "./sales/checkout/step/payment/tyro.effects";
import {TyroActions} from "./sales/checkout/step/payment/tyro.actions";
import {TyroService} from "./sales/checkout/step/payment/tyro.service";
import {ReceiptState} from "./sales/receipts/receipt.state";
import {receiptReducer} from "./sales/receipts/receipt.reducer";
import {ReceiptActions} from "./sales/receipts/receipt.actions";
import {ReceiptEffects} from "./sales/receipts/receipt.effects";
import {ReceiptService} from "./sales/receipts/receipt.service";
import {MenuState} from "./sales/menu/menu.state";
import {menuReducer} from "./sales/menu/menu.reducer";
import {MenuLeftActions} from "./sales/menu/left/left.actions";
import {ordersReducer} from "./sales/orders/order.reducer";
import {ListActions} from "./sales/orders/list/list.actions";
import {ListService} from "./sales/orders/list/list.service";
import {ListEffects} from "./sales/orders/list/list.effects";
import {OrderService} from "./sales/orders/order.service";
import {OrderListAddPaymentActions} from "./sales/checkout/step/order-list-add-payment/add-payment.actions";
import {OrderListAddPaymentService} from "./sales/checkout/step/order-list-add-payment/add-payment.service";
import {OrderListAddPaymentEffects} from "./sales/checkout/step/order-list-add-payment/add-payment.effects";

export const R_POS_VIEW_IMPORTS = [
  EffectsModule.run(PosViewRouterEffects),
  EffectsModule.run(CheckoutProductEffects),
  EffectsModule.run(CartCustomEffects),
  EffectsModule.run(CartItemEffects),
  EffectsModule.run(ProductOptionsEffects),
  EffectsModule.run(PosStepEffects),
  EffectsModule.run(OrderListAddPaymentEffects),
  EffectsModule.run(TyroEffects),
  EffectsModule.run(ReceiptEffects),
  EffectsModule.run(ListEffects),
];

export const R_POS_VIEW_PROVIDERS = [
  PosViewRouterEffects,
  
  CheckoutProductActions,
  CheckoutProductEffects,
  CheckoutProductService,
  
  /*Cart action bar*/
  CartActionBarActions,
  CartActionBarService,
  CartActionBarEffects,
  
  /*Cart customer*/
  CartCustomerActions,
  CartCustomEffects,
  CartCustomerService,
  
  /*Cart items*/
  CartItemActions,
  CartItemEffects,
  CartItemService,
  
  /*Cart totals*/
  CartTotalsActions,
  
  /*Popup*/
  ProductOptionsActions,
  ProductOptionsEffects,
  ProductOptionsService,
  
  /*Checkout Step*/
  PosStepActions,
  PosStepEffects,
  PosStepService,
  OrderListAddPaymentActions,
  OrderListAddPaymentService,
  OrderListAddPaymentEffects,
  
  // 3RD payment
  TyroActions,
  TyroEffects,
  TyroService,
  
  //Receipt
  ReceiptActions,
  ReceiptEffects,
  ReceiptService,
  
  // Menu
  MenuLeftActions,
  
  // Orders
  OrderService,
  ListActions,
  ListService,
  ListEffects,
];

/*Ở đây là interface bởi vì trong component, service... chỉ lấy data chứ không được set*/
export interface SalesState {
  checkoutProduct: CheckoutProductState;
  cartCustomer: CartCustomerState;
  cartItem: CartItemState;
  cartTotals: CartTotalsState;
  cartActionBar: CartActionBarState;
  productOptions: ProductOptionsState;
  step: PosStepState;
  receipt: ReceiptState;
  menu: MenuState;
}

export const salesReducer = createReducer({
                                            checkoutProduct: checkoutProductReducer,
                                            cartCustomer: cartCustomerReducer,
                                            cartItem: cartItemReducer,
                                            cartTotals: cartTotalsReducer,
                                            cartActionBar: cartActionBarReducer,
                                            productOptions: productOptionsReducer,
                                            step: posStepReducer,
                                            receipt: receiptReducer,
                                            menu: menuReducer,
                                            orders: ordersReducer
                                          });
