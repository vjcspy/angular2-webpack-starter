import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {RetailConfigService} from "../../../../R/retail-config/retail-config.service";
import {RetailConfigState} from "../../../../R/retail-config/retail-config.state";

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos-integration-setting',
             templateUrl: 'setting.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })

export class ConfigurationsDefaultPosIntegrationSettingComponent implements OnInit {
  @Input() retailConfigState: RetailConfigState;
  
  public _data = {
    integrate_gc: {
      title: "GC Extension",
      data: [
        {
          label: "None",
          value: 'none'
        },
        {
          label: "Aheadworks",
          value: 'aheadWorld'
        }
      ]
    },
    integrate_rp: {
      title: "RP Extension",
      data: [
        {
          label: "None",
          value: 'none'
        },
        {
          label: "Aheadworks",
          value: 'aheadWorld'
        }
      ]
    },
    integrate_wh: {
      title: "WH Extension",
      data: [
        {
          label: "None",
          value: 'none'
        }
      ]
    },
  };
  
  constructor(protected retailConfigService: RetailConfigService) {
  }
  
  getRetailConfigSnapshot() {
    return this.retailConfigService.retailConfigSnapshot;
  }
  
  ngOnInit() { }
}
