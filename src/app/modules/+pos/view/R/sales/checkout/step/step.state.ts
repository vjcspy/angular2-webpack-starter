import {makeTypedFactory, TypedRecord} from "typed-immutable-record";

export enum CheckoutStep{
  NONE = 0,
  PAYMENT,
  COMPLETE
}

export interface PaymentMethod {
  type: string,
  title: string,
  time: number,
  amount: number,
  isChanging: boolean, // If method is changing so we can edit input
  created_at: string,
  data: Object,
  payment_data: Object,
  allow_amount_tendered: boolean;
}

export interface PosStepState {
  checkoutStep: number;
  totals: {
    grandTotal: number;
    totalPaid: number;
    remain: number;
  },
  paymentMethodCanUse: Object[],
  paymentMethodUsed: PaymentMethod[],
  canSaveOrder: boolean;
  moneySuggestion: number[]
}

export interface PosStepStateRecord extends TypedRecord<any>, PosStepState {}

export const posStepStateFactory = makeTypedFactory<PosStepState, PosStepStateRecord>(
  {
    checkoutStep: CheckoutStep.NONE,
    totals: {totalPaid: 0, remain: null, grandTotal: 0},
    paymentMethodCanUse: [],
    paymentMethodUsed: [],
    canSaveOrder: false,
    moneySuggestion: []
  }
);
