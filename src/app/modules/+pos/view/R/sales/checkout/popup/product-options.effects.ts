import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";
import {Actions, Effect} from "@ngrx/effects";
import {PosQuoteActions} from "../../../../../R/quote/quote.actions";
import {TaxClassDB} from "../../../../../database/xretail/db/tax-class";
import {List} from "immutable";
import {Product} from "../../../../../core/framework/catalog/Model/Product";
import {ProductHelper} from "../../../../../services/helper/product";
import {ProductOptionsActions} from "./product-options.actions";

@Injectable()
export class ProductOptionsEffects {
  
  constructor(private store$: Store<any>, private actions$: Actions, private productHelper: ProductHelper) { }
  
  @Effect() retrieveProductDataForPopup = this.actions$.ofType(PosQuoteActions.ACTION_WAIT_GET_PRODUCT_OPTIONS)
                                              .withLatestFrom(this.store$.select('productOptions'))
                                              .withLatestFrom(this.store$.select('entities'),
                                                              ([action, productOptions], entitiesState) => [action, productOptions, entitiesState])
                                              .map(([action, productOptionsState, entitiesState]) => {
                                                const taxClass: List<TaxClassDB> = entitiesState[TaxClassDB.getCode()]['items'];
                                                const product: Product           = productOptionsState['product'];
                                                product.setTaxClassName(this.productHelper.getProductTaxClass(product.tax_class_id, taxClass));
                                                
                                                return {type: ProductOptionsActions.ACTION_RETRIEVE_PRODUCT_INFORMATION, payload: {product}}
    
                                              })
}
