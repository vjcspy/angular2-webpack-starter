import {Action, ActionReducer} from "@ngrx/store";
import {checkoutProductStateFactory, CheckoutProductStateRecord} from "./product.state";
import {CheckoutProductActions} from "./product.actions";
import {NumberHelper} from "../../../../../services/helper/number-helper";
import * as _ from 'lodash';

export const checkoutProductReducer: ActionReducer<CheckoutProductStateRecord> = (state: CheckoutProductStateRecord = checkoutProductStateFactory(), action: Action) => {
  switch (action.type) {
    case CheckoutProductActions.ACTION_SAVE_GRID_WIDTH_HEIGHT:
      let baseWidthProductGrid: number;
      if (action.payload['gridWidth'] < 800) {
        baseWidthProductGrid = 120;
      } else if (action.payload['gridWidth'] < 1200) {
        baseWidthProductGrid = 190;
      } else {
        baseWidthProductGrid = 220;
      }
      return state.set('productGridWidth', action.payload['gridWidth'])
                  .set('productGridHeight', action.payload['gridHeight'])
                  .set('productGridStyleValue', Object.assign({}, state.productGridStyleValue, {baseWidthProductGrid}));
    
    case CheckoutProductActions.ACTION_CALCULATE_GRID_STYLE:
      const gridWidth  = state.productGridWidth;
      const gridHeight = state.productGridHeight;
      
      // Calculate width
      let currentWidth = gridWidth - state.productGridStyleValue['paddingGrid'];
      let viewExtend   = state.productGridStyleValue['baseWidthProductGrid'] + state.productGridStyleValue['marginProductLeftRight'];
      
      // trueColumn never is an integer to calculate resize
      let trueColumn = currentWidth / viewExtend - 0.001;
      let numOfCol   = parseInt(trueColumn + "");
      
      // 1px for rounding
      let resizePercent     = (currentWidth - viewExtend * numOfCol - 1) * 100 / (numOfCol * viewExtend);
      let itemWidth: number = (viewExtend * (100 + resizePercent) / 100) - state.productGridStyleValue['marginProductLeftRight'];
      itemWidth             = NumberHelper.round(itemWidth, 4);
      
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
    
    case CheckoutProductActions.ACTION_RESOLVE_GRID_PRODUCT:
      const totalPage   = action.payload['totalsPage'];
      const currentPage = action.payload['currentPage'];
      
      let pagesView: any[] = [];
      if (_.isNumber(totalPage) && totalPage > 0) {
        if (totalPage <= 6) {
          for (let i = 1; i <= totalPage; i++) {
            pagesView.push(i);
          }
        } else {
          pagesView.push(1);
          // Before
          if ((currentPage - 1) > 3) {
            pagesView.push("...");
            for (let i = (currentPage - 2); i < currentPage; i++) {
              pagesView.push(i);
            }
          } else if (currentPage > 1) {
            for (let i = 2; i < currentPage; i++) {
              pagesView.push(i);
            }
          }
          // current
          if (currentPage !== 1) {
            pagesView.push(currentPage);
          }
          // After
          if ((totalPage - currentPage) > 3) {
            for (let i = (currentPage + 1); i < (currentPage + 3); i++) {
              pagesView.push(i);
            }
            pagesView.push("...");
          } else if (currentPage < totalPage) {
            for (let i = (currentPage + 1); i < totalPage; i++) {
              pagesView.push(i);
            }
          }
          // End
          if (currentPage !== totalPage) {
            pagesView.push(totalPage);
          }
        }
      }
      
      return state.set('productGridProducts', action.payload['productGridProducts'])
                  .set('productGridPagingData', pagesView)
                  .set('productGridCurrentPage', action.payload['currentPage'])
                  .set('productGridTotalsPage', action.payload['totalsPage']);
    
    case CheckoutProductActions.ACTION_UPDATE_GRID_STATE:
      let newState = state;
      _.forEach(action.payload, (v, k) => {
        if (k === 'productGridCurrentPage') {
          if (v <= state.productGridTotalsPage && v > 0) {
            newState = newState.set(k, v);
          }
        } else {
          newState = newState.set(k, v);
        }
      });
      return newState;
    default:
      return state;
  }
};