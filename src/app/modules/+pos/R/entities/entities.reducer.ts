import {Action} from "@ngrx/store";
import {posEntitiesStateFactory, PosEntitiesStateRecord} from "./entities.state";
import {PosEntitiesActions} from "./entities.actions";
import * as _ from 'lodash';
import {ProductDB} from "../../database/xretail/db/product";
import {mergeSliceReducers} from "../../../../R/index";
import {entityOrderReducer} from "./entity/order.reducer";
import {orderCountReducer} from "./entity/order-count.reducer";
import {List} from "immutable";

const entitiesMainReducer = (state: PosEntitiesStateRecord, action: Action) => {
  switch (action.type) {
    
    case  PosEntitiesActions.ACTION_GET_ENTITY_DATA_FROM_DB:
      const data       = action.payload['data'];
      const entityCode = action.payload['entityCode'];
      let mergeData    = {};
      if (!!data['pageSize']) {
        mergeData['pageSize'] = data['pageSize'];
      }
      if (!!data['currentPage']) {
        mergeData['currentPage'] = data['currentPage'];
      }
      if (!!data['isFinished']) {
        mergeData['isFinished'] = data['isFinished'];
      }
      let listItems = List.of();
      listItems     = listItems.push(...data['items']);
      return state.setIn([entityCode, 'items'],
                         // Have one case, Order has been place and pushed to entities and DB, then user go to order list-> pull from DB ->
                         // duplicate because include order has been pushed before
                         listItems)
                  .setIn([entityCode, 'isLoadedFromDB'], true)
                  .mergeIn([entityCode], mergeData);
    
    case PosEntitiesActions.ACTION_PULL_ENTITY_PAGE_SUCCESS:
      return state.updateIn([action.payload['entityCode'], 'currentPage'], (currentPage) => ++currentPage)
                  .updateIn([action.payload['entityCode'], 'items'],
                            (list) => list.push(..._.map(action.payload.items, (p) => (new ProductDB()).addData(p))));
    
    case PosEntitiesActions.ACTION_FILTERED_PRODUCTS:
      return state.setIn([ProductDB.getCode(), 'itemFiltered'], action.payload['productsFiltered']);
    
    case PosEntitiesActions.ACTION_PULL_ENTITY_NEXT_PAGE:
      return state.setIn([action.payload['entityCode'], 'query'], action.payload['query']);
    
    default:
      return state;
  }
};

export const entitiesReducer = mergeSliceReducers(posEntitiesStateFactory(), entitiesMainReducer, entityOrderReducer, orderCountReducer);
