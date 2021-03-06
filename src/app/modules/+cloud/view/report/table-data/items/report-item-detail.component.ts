import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {SaleReportService} from "../../../../R/report/service";

@Component({
             selector: '[sale-report-item-detail]',
             templateUrl: 'report-item-detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CloudSaleReportItemDetailComponent {
  @Input('list_date') list_date       = [];
  @Input('data_filter') data_filter   = [];
  @Input('measures') measures         = [];
  @Input('item') item                 = [];
  @Input('colspanFooter') colspanFooter ;
  @Input('base_currency_code') base_currency_code;
  
  protected isDateRanger() {
    if (this.data_filter['dateTimeState'] == "compare" ){
      return false;
    }
    return true;
  }
  
  constructor(protected service: SaleReportService) {}
  
  protected checkIsNumberDecimals(value){
    if (value == null || value == 'N/A' || isNaN(value)|| typeof value == 'undefined' || value == '--' || typeof value == 'string')
      return false;
    else
      return true;
  }
  
  protected checkNullValue(value) {
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
