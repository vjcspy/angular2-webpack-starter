import {Action, ActionReducer} from "@ngrx/store";
import {cartActionBarFactory, CartActionBarRecord} from "./action-bar.state";
import {CartActionBarActions} from "./action-bar.actions";

export const cartActionBarReducer: ActionReducer<CartActionBarRecord> = (state = cartActionBarFactory(), action: Action) => {
  switch (action.type) {
    case CartActionBarActions.CHANGE_STATE_NOTE_POPUP:
      return state.set('isOpeningNote', action.payload['state']);
    
    default:
      return state;
  }
};