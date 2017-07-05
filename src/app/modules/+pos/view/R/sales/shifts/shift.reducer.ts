import {ActionReducer} from "@ngrx/store";
import {shiftStateFactory, ShiftStateRecord} from "./shift.state";
import {mergeSliceReducers} from "../../../../../../R/index";
import {shiftListReducer} from "./list/list.reducer";
import {shiftDetailReducer} from "./detail/detail.reducer";

const shiftMainReducer: ActionReducer<ShiftStateRecord> = (state, action) => {
  return state;
};

export const shiftReducer = mergeSliceReducers(shiftStateFactory(), shiftMainReducer, shiftListReducer, shiftDetailReducer);
