import {Component, ElementRef, OnInit, ViewChild, OnDestroy, Input, ChangeDetectionStrategy, ViewEncapsulation} from '@angular/core';
import * as moment from 'moment';
import * as $q from "q";
import * as _ from "lodash";
import {RequestService} from "../../../../services/request";
import {ApiManager} from "../../../../services/api-manager";
const Highcharts = require('highcharts/highcharts.src');
import 'highcharts/adapters/standalone-framework.src';
import {DashboardReportService} from "../../../../R/dashboard/service";

@Component({
             // moduleId: module.id,
             selector: 'bar-chart',
             templateUrl: 'bar-chart.html',
             encapsulation: ViewEncapsulation.None,
             styleUrls: [
               './bar-chart.scss'
             ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class BarChart implements OnDestroy, OnInit {
  @ViewChild('chart') public chartEl: ElementRef;
                             chart_type: string;
                             chart_data: any;
                             scope_Names: any;
                             totalValues: any;
                             maxValue: number;
                             
  @Input('data_bar_chart') viewData = [];
  @Input('current_currency') current_currency: string;
  private _barchart: any;
  
  ngOnInit() {
    if (typeof this.viewData != "undefined") {
      let max = _.max(this.viewData['chart_data']);
      if (typeof max === "number" && max > 0) {
        this.maxValue = Math.round(max * 1.33 * 100) / 100;
      } else {
        this.maxValue = 1;
      }
      
      this.chart_data  = this.viewData['chart_data'];
      this.scope_Names = this.viewData['scope_Names'];
      this.chart_type  = this.viewData['chart_type'];
      this.totalValues = [];
      _.forEach(this.viewData['chart_data'], item => {
        this.totalValues.push(this.maxValue - item);
      });
    }
    this.convertChart();
  }
  
  convertChart() {
    let barchart = this.initBarChart(this.chart_type);
    if (this.chartEl && this.chartEl.nativeElement) {
      barchart.chart = {
        type: 'bar',
        marginTop: 5,
        marginBottom: 15,
        height: this.scope_Names.length * 50 + 20,
        renderTo: this.chartEl.nativeElement
      };
      this._barchart = new Highcharts.Chart(barchart);
    }
  }
  
  private initBarChart(chartType): any {
    let currency_symbol = this.current_currency;
    return {
      title: {text: '', style: {display: 'none'}},
      subtitle: {text: '', style: {display: 'none'}},
      legend: {enabled: false},
      xAxis: {
        categories: this.scope_Names,
        // categories: this.value,
        labels: {enabled: false},
        lineWidth: 0,
        tickWidth: 0,
      },
      yAxis: {
        labels: {
          enabled: false,
        },
        gridLineWidth: 0,
        title: null
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        series: {
          pointWidth: 33,
          stacking: 'percent',
          states: {
            hover: {
              enabled: false
            }
          }
        }
      },
      tooltip: {
        enabled: false
      },
      series: [
        {
          showInLegend: false,
          name: 'Total',
          data: this.totalValues,
          // data: [this.maxItem - 0, this.maxItem - 2113.4],
          value: this.scope_Names,
          // value: this.value,
          color: '#eee',
          dataLabels: {
            formatter: function () {
              if (chartType === "discount_percent") {
                let discount_percent = 100 * (this.total - this.y);
                return Math.round(discount_percent * 100) / 100 + '%';
              } else if (chartType === "customer_count" || chartType === "quantity") {
                return Math.round((this.total - this.y) * 100) / 100;
              } else {
                let number = this.total - this.y;
                if (1000 <= number && number < 1000000) {
                  return currency_symbol + Math.round((number / 1000) * 100) / 100 + 'k';
                } else if (1000000 <= number && number < 1000000000) {
                  return currency_symbol + Math.round((number / 1000000) * 100) / 100 + 'm';
                } else if (number >= 1000000000) {
                  return currency_symbol + Math.round((number / 1000000000) * 100) / 100;
                } else {
                  return currency_symbol + Math.round(number * 100) / 100;
                }
                // return currency_symbol + Math.round((this.total - this.y) * 100) / 100;
              }
            },
            style: {
              textOutline: 'transparent !important',
              stroke: 'transparent',
              color: '#555',
              font: '13',
              fontWeight: 'normal',
            },
            enabled: true,
            align: 'right',
          }
        },
        {
          showInLegend: false,
          name: 'Value',
          data: this.chart_data,
          // data: this.item,
          color: '#b2dfdb',
          className : 'creportchart_value',
          dataLabels: {
            formatter: function () {
              return this.x;
            },
            style: {
              textOutline: 'transparent !important',
              stroke: 'transparent',
              color: '#555',
              font: '13',
              fontWeight: 'bold',
              height: '30px',
              fontSize: '13',
            },
            enabled: true,
            align: 'left',
          }
        }
      ]
    };
  }
  
  public ngOnDestroy() {
    this._barchart.destroy();
  }
  
  // dummy data
  // item    = [0, 2113.4, 0, 152.96, 713.8, 0];
  // // item    = [0, 2113.4];
  // maxItem = 2113.4 * 1.33;
  // value   = ['Thanhnt1', 'demo outlet', 'Ha Noi', '120', 'Hhehee', '1asd'];
  // // value   = ['Thanhnt1', 'demo outlet'];
}
