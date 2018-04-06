import * as _ from 'lodash';

export class ProductHelper {
  protected _skipSaleableCheck = true;

  static isSales(product: Object) {
    let today =  Date.now();
    if (!_.isEmpty(product['tier_prices']) || (product['special_price'] &&
      ((today >= Date.parse( product['special_from_date']) && today <= Date.parse(product['special_to_date'])) || (today >= Date.parse( product['special_from_date']) && product['special_to_date'] === null)))) {
        return true;
    }
    return false;
  }

  static isOutOfStock(product: Object) {
    return !this.isSalesAble(product);
  }

  static isSalesAble(product: Object) {
    // FIX XRT-666 : out of stock chỉ check theo setting product chứ không check theo qty
    return !(product['stock_items'] && // apply on both Configurable/Bundle/Grouped parent product
             (parseInt(product['stock_items']['is_in_stock']) === 0));
  }

  static getProductTaxClass(tax_class_id: number, taxClass: any): string {
    if (tax_class_id == 0) {
      return "NONE";
    } else {
      let _taxClass = taxClass.find((t) => parseInt(t.id) === parseInt(tax_class_id + "") && t.type === 'PRODUCT');
      if (_taxClass) {
        return _taxClass.name;
      }
      else {
        return "NONE";
      }
    }
  }

  getSkipSaleableCheck(): boolean {
    return this._skipSaleableCheck;
  }
}
