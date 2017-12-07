import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
const Highcharts = require('highcharts/highcharts.src');
import 'highcharts/adapters/standalone-framework.src';
import {ReportDashboardHelper} from "../../../../R/dashboard/helper";
import * as _ from "lodash";
import * as moment from "moment";
import {DashboardReportService} from "../../../../R/dashboard/service";

@Component({
             // moduleId: module.id,
             selector: 'chart-line-time',
             templateUrl: 'chart-line-time.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ChartLineTime implements AfterViewInit, OnDestroy, OnInit {
  @Input('typeChart') typeChart    = [];
  @ViewChild('chart_line_time') public chartEl: ElementRef;
  @Input('data_chart_line_time') viewData    = [];
  
  chart_data: any;
  scope_Names: any;
  totalValues: any;
  
  private _chartLineTime: any;
  
  constructor(protected dashboardReportService: DashboardReportService) {}
  
  ngOnInit() {
    if (typeof this.viewData != "undefined") {
      this.chart_data = this.viewData['chart_data'];
      this.scope_Names = this.viewData['scope_Names'];
      this.totalValues = [];
      _.forEach(this.viewData['chart_data'], item => {
        this.totalValues = item;
      });
    }
    this.convertChart();
  }
  
  getListDataFilter() {
    return _.map(this.dashboardReportService.viewData['list_date_filter'], function (date) {
      return moment(date, "YYYY-MM-DD").format("Do MMM");
    });
  }
  
  public convertChart() {
    let chartLineTime = this.initChartLineTime();
    if (this.chartEl && this.chartEl.nativeElement) {
      chartLineTime.chart = {
        type: 'line',
        renderTo: this.chartEl.nativeElement
      };
      
      this._chartLineTime = new Highcharts.Chart(chartLineTime);
    }
    ;
  }
  
  private initChartLineTime(): any {
    return {
      title: {
        text: ''
      },
  
      subtitle: {
        text: ''
      },
  
      xAxis: {
        categories: this.getListDataFilter(),
        labels: {
          autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90]
        }
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: false
          },
          enableMouseTracking: true
        }
      },
      credits: {
        enabled: false
      },
      legend: {
        enabled: false,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
  
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + '</b><br/>' +
                 this.x + ': ' + this.y;
        }
      },
  
      series: [{
        name: this.getTitleDashBoardChart(),
        data: this.totalValues
      }],
  
      responsive: {
        rules: [{
          condition: {
            maxWidth: 500
          },
          chartOptions: {
            legend: {
              enabled: false,
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle'
            }
          }
        }]
      }
    };
  }
  
  public ngOnDestroy() {
    this._chartLineTime.destroy();
  }
  
  getTitleDashBoardChart() {
    let typeChart = this.typeChart;
    let chart     = _.find(ReportDashboardHelper.getWidgets()['data'], (row) => row['value'] === typeChart);
    return chart['label'];
  }
}
