import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'configurations-default-pos',
             templateUrl: 'pos.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class ConfigurationsDefaultPosComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
}