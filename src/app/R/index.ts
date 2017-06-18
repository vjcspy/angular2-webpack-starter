import {Action, ActionReducer, combineReducers, StoreModule} from "@ngrx/store";
import {StoreDevtoolsModule} from "@ngrx/store-devtools";
import {RootState} from "./root.state";
import {rootReducer} from "./root.reducer";
import {RootActions} from "./root.actions";
import {routerReducer, RouterState, RouterStoreModule} from "@ngrx/router-store";
import {EffectsModule} from "@ngrx/effects";
import {RootEffects} from "./root.effects";
import * as _ from 'lodash';

export interface AppState {
  rootState: RootState;
  router: RouterState;
  
  [propName: string]: any;
}

const appReducers = {
  rootState: rootReducer,
  router: routerReducer
};

export function createReducer(asyncReducers = {}): ActionReducer<any> {
  return combineReducers(Object.assign(appReducers, asyncReducers));
}

const STORE_DEV_TOOLS_IMPORTS = [];
STORE_DEV_TOOLS_IMPORTS.push(...[
  StoreDevtoolsModule.instrumentOnlyWithExtension({maxAge: 10})
]);

export const R_IMPORTS = [
  StoreModule.provideStore(createReducer()),
  STORE_DEV_TOOLS_IMPORTS,
  StoreDevtoolsModule,
  RouterStoreModule.connectRouter(),
  EffectsModule.run(RootEffects)
];

// if ('production' !== ENV) {
//   R_IMPORTS.push(...STORE_DEV_TOOLS_IMPORTS);
// }
/*
 * Có thể bao gồm service, actions và effects.
 *  - service: Không được phụ thuộc vào action hoặc effects và cũng không được phụ thuộc vào service nằm trong R
 *  - actions: Không được phụ thuộc vào service hoặc effects, đây chỉ là nơi cung cấp các actions trong R
 *  - effects: Được phụ thuộc service của nó và các service khác nằm trong R. Không được phụ thuộc actions.
 */
export const R_PROVIDERS = [
  RootActions,
  RootEffects
];


export const mergeSliceReducers = (initialState: any, ...sliceReducer: ActionReducer<any>[]) => {
  return (state = initialState, action: Action) => {
    _.forEach(sliceReducer, (reducer: ActionReducer<any>) => {state = reducer(state, action)});
    
    return state;
  };
};
