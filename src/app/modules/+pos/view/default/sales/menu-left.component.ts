import {ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {AuthenticateService} from "../../../../../services/authenticate";
import {OfflineService} from "../../../../share/provider/offline";
import {MenuState} from "../../R/sales/menu/menu.state";
import {RetailTranslate} from "../../../../../services/retail-translate";
import {MenuLeftActions} from "../../R/sales/menu/left/left.actions";
import {TranslateService} from "@ngx-translate/core";
import {RouterActions} from "../../../../../R/router/router.actions";

@Component({
             // moduleId: module.id,
             selector: 'pos-default-menu-left',
             templateUrl: 'menu-left.component.html',
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class PosDefaultMenuLeftComponent implements OnInit {
  @ViewChild('menuElem') menuElem: ElementRef;
  @Input() menuState: MenuState;
  
  constructor(public authenticateService: AuthenticateService,
              public offline: OfflineService,
              public translate: TranslateService,
              public retailTranslate: RetailTranslate,
              public menuLeftActions: MenuLeftActions,
              protected routerActions: RouterActions) { }
  
  ngOnInit() { }
  
  getUserName() {
    return "Cashier";
  }
  
  getOutletRegisterData() {
    return "Register 1 - Outlet 1"
  }
  
  
  openCart() {
    this.routerActions.go('pos/default/sales/checkout');
  }
  
  openShift() {
  
  }
  
  goPosSetting() {
  
  }
  
  changeOutlet() {
  
  }
  
  openOrders() {
    this.routerActions.go('pos/default/sales/orders');
  }
  
  flushCache() {
  
  }
  
  @HostListener('document:click', ['$event.target']) onClick(target) {
    // if (screenfull.enabled && this.appService.viewState.firstTimeFullScreen) {
    //   this.appService.viewState.firstTimeFullScreen = false;
    //   screenfull.request();
    // }
    
    if (target.className.indexOf('menu-toggle') > -1 || target.className.indexOf('amenu') > -1)
      return;
    if (this.menuElem && !this.menuElem.nativeElement.contains(target)) {
      if (this.menuState.leftMenu.isOpen === true) {
        this.menuLeftActions.changeOpenState(false);
      }
    }
  }
}