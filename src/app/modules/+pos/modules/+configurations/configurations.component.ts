import {Component, OnInit} from '@angular/core';

@Component({
             // moduleId: module.id,
             selector: 'configurations',
             template: `
               <div class="xcontainer-wrapper open">
                 <div class="xcontainer-inner">
                   <router-outlet></router-outlet>
                 </div>
               </div>
  
             `
           })
export class ConfigurationsComponent implements OnInit {
  constructor() { }
  
  ngOnInit() { }
  
}
