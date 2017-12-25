import {Component, Input, ChangeDetectionStrategy, OnInit, ChangeDetectorRef} from '@angular/core';
import {SaleReportService} from "../../../../R/report/service";
import {ReportHelper} from "../../../../R/report/helper";
import * as _ from "lodash";
import {AbstractRxComponent} from "../../../../../share/core/AbstractRxComponent";

@Component({
             selector: '[sale-report-item-detail]',
             templateUrl: 'report-item-detail.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class CloudSaleReportItemDetailComponent extends AbstractRxComponent implements OnInit {
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
  
  constructor(protected service: SaleReportService, protected changeDetector: ChangeDetectorRef) {
    super();
  }
  
  ngOnInit() {
    this._subscription['update_view']  =  this.service.updateView().subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }
  
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
  
  getLabelForTitle() {
    let extra_info = this.service.viewDataFilter['extra_info'];
    let reportColumn     = _.find(ReportHelper.getListExtraData()['data'], (row) => row['value'] == extra_info);
    return this.service.viewDataFilter['report_type'] === 'outlet' ? 'Category' : reportColumn['label'];
  }
}
