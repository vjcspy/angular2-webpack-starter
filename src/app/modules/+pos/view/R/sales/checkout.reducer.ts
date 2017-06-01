import {Action, ActionReducer} from "@ngrx/store";
import {NumberHelper} from "../../../services/helper/number-helper";
import {checkoutStateFactory, CheckoutStateRecord} from "./checkout.state";
import {PosCheckoutActions} from "./checkout.actions";

export const checkoutReducer: ActionReducer<CheckoutStateRecord> = (state: CheckoutStateRecord = checkoutStateFactory(), action: Action) => {
  switch (action.type) {
    case PosCheckoutActions.ACTION_SAVE_GRID_WIDTH_HEIGHT:
      return state.set('productGridWidth', action.payload['gridWidth'])
                  .set('productGridHeight', action.payload['gridHeight']);
    
    case PosCheckoutActions.ACTION_CALCULATE_GRID_STYLE:
      const gridWidth  = state.productGridWidth;
      const gridHeight = state.productGridHeight;
      
      // Calculate width
      let currentWidth = gridWidth - state.productGridStyleValue['paddingGrid'];
      let viewExtend   = state.productGridStyleValue['baseWidthProductGrid'] + state.productGridStyleValue['marginProductLeftRight'];
      
      // trueColumn never is an integer to calculate resize
      let trueColumn = currentWidth / viewExtend - 0.001;
      let numOfCol   = parseInt(trueColumn + "");
      
      // 1px for rounding
      let resizePercent     = (currentWidth - viewExtend * numOfCol) * 100 / (numOfCol * state.productGridStyleValue['baseWidthProductGrid']);
      let itemWidth: string = (state.productGridStyleValue['baseWidthProductGrid'] * (100 + resizePercent) / 100).toFixed(2);
      
      /*------------------------------------------------------------------------------------------------------------*/
      
      // Calculate height and item per page
      let currentHeight   = gridHeight;
      let itemHeight: any = parseFloat(itemWidth + "");
      let trueRow         = currentHeight / (itemHeight + state.productGridStyleValue['marginProductTop']);
      let numOfRow        = parseInt(trueRow + "");
      
      let beautyRow = NumberHelper.round(trueRow, 0);
      if (beautyRow > trueRow) {
        if ((currentHeight / beautyRow) >= (itemHeight * state.productGridStyleValue['stretchAspectRatioAllows'])) {
          numOfRow   = beautyRow;
          itemHeight =
            parseFloat(((currentHeight) / beautyRow).toFixed(2)) - state.productGridStyleValue['marginProductTop'];
        } else {
          let beautyHeight =
                parseFloat((currentHeight / numOfRow).toFixed(2)) - state.productGridStyleValue['marginProductTop'];
          itemHeight       = itemHeight * state.productGridStyleValue['stretchLengthRatioAllows'];
          itemHeight       = Math.min(beautyHeight, itemHeight);
        }
      } else {
        if ((currentHeight / trueRow) <= itemHeight * state.productGridStyleValue['stretchLengthRatioAllows']) {
          itemHeight = parseFloat((currentHeight / trueRow).toFixed(2)) - state.productGridStyleValue['marginProductTop'];
        }
      }
      
      return state.set('productGridStyles', {width: itemWidth + "px", height: itemHeight + "px"})
                  .set('productGridNumOfProductPerPage', numOfCol * numOfRow);
    
    default:
      return state;
  }
};

