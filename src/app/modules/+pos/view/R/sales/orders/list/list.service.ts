import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {PosGeneralState} from "../../../../../R/general/general.state";
import {RequestService} from "../../../../../../../services/request";
import {ApiManager} from "../../../../../../../services/api-manager";

@Injectable()
export class ListService {
  protected _data = {};
  
  constructor(private requestService: RequestService, private apiUrl: ApiManager) { }
  
  createRequestSearchOrder(string: string, dateFrom: string, dateTo: string, generalState: PosGeneralState) {
    return this.requestService
               .makeGet(this.apiUrl.get('orders', generalState.baseUrl) +
                        "?searchCriteria[searchString]=" +
                        string +
                        "&searchCriteria[dateFrom]=" +
                        dateFrom +
                        "&searchCriteria[dateTo]=" +
                        dateTo +
                        "&searchCriteria[pageSize]=100" +
                        "&searchCriteria[outletId]=0");
  }
}