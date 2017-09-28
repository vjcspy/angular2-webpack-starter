/**
 * Angular 2 decorators and services
 */
import {
  ChangeDetectionStrategy,
  Component, ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {ToastsManager} from "ng2-toastr";
import {TranslateService} from "@ngx-translate/core";
import {AbstractSubscriptionComponent} from "./code/AbstractSubscriptionComponent";
import {RetailTranslate} from "./modules/share/provider/retail-translate";
import {AccountService} from "./R/account/account.service";

/**
 * App Component
 * Top Level Component
 */
@Component({
             selector: 'app',
             encapsulation: ViewEncapsulation.None,
             styleUrls: [
               './app.component.css',
               '../../node_modules/font-awesome/css/font-awesome.min.css',
               '../../node_modules/ng2-toastr/ng2-toastr.css'
             ],
             template: `
               <router-outlet></router-outlet>
             `,
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class AppComponent extends AbstractSubscriptionComponent {
  constructor(private toastr: ToastsManager,
              vcr: ViewContainerRef,
              protected translate: TranslateService,
              private retailTranslate: RetailTranslate,
              private accountService: AccountService) {
    super();
    this.resolveLanguage();
    this.toastr.setRootViewContainerRef(vcr);
    this.accountService.subscribeAccountChange();
  }
  
  protected resolveLanguage() {
    this.retailTranslate.resolveLanguages();
  }
}
