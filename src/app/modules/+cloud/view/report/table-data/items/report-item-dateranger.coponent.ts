import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import * as _ from "lodash";
import {SaleReportService} from "../../../../R/report/service";

@Component({
             selector: '[sale-report-dateranger-item]',
             templateUrl: 'report-item-dateranger.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CloudSaleReportDateRangerItemComponent {
  @Input('list_date') list_date       = [];
  @Input('item') item                 = [];
  @Input('colspanFooter') colspanFooter ;
  @Input('firstItem') firstValue = [];
  @Input('rowSpan') rowSpan: number;
  
  constructor(protected service: SaleReportService) {
  }
  
  protected checkReportType(item) {
    if (this.firstValue['name'] == item){
      return true;
    }
  }
  
  protected getRowSpan() {
    let report_type = this.service.viewDataFilter['report_type'];
    if (_.indexOf(['payment_method', 'shipping_method'], report_type) != -1)
      return 2;
    else
      return 8
  }
  
  checkIsNumberDecimals(value){
    if (value == null || value == 'N/A' || isNaN(value)|| typeof value == 'undefined' || value == '--' || typeof value == 'string')
      return false;
    else
      return true;
  }
  
  checkNullValue(value) {
    if (value == null || value == 'N/A' || value == "NaN" || typeof value === 'undefined' || value == NaN)
      return true;
  }
  
  checkShowSymbolCurrency(measureLabel, value){
    if ((measureLabel == "Margin" || measureLabel == "Cart Size" || measureLabel == "Cart Value" ||
        measureLabel == "Cart Value (incl tax)" || measureLabel == "Discount percent" || measureLabel == "Return percent"|| measureLabel == "Customer Count" ||
        measureLabel == "First Sale" || measureLabel == "Item Sold" || measureLabel == "Last Sale"|| measureLabel == "Order Count" ||
        measureLabel == "Return count" || measureLabel == "Item Sold" || measureLabel == "Last Sale"|| measureLabel == "Order Count") ||
        this.checkIsNumberDecimals(value) == false) {
      return false;
    } else
      return true;
  }
}
