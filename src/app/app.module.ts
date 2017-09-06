import {ErrorHandler, NgModule} from "@angular/core";
import {
  RouterModule,
} from "@angular/router";

/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from "./environment";
import {ROUTES} from "./app.routes";
// App is our top level component
import {AppComponent} from "./app.component";

// import'../styles/font-awesome.scss';
// import '../styles/daterangepicker.scss';
import {ShareModule} from "./modules/share/share.module";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterExternalModule} from "./modules/router/router.module";
import {R_IMPORTS, R_PROVIDERS} from "./R/index";
import {APP_PAGES} from "./pages/index";
import {ToastModule, ToastsManager} from "ng2-toastr";
import {CustomToastOptions} from "./services/toast-options";
import {APP_PROVIDERS} from "./services/index";
import {METEOR_COLLECTION} from "./services/meteor-collections/index";
import {SelectivePreloadingStrategy} from "./services/preloading-router";
import {Ng2Webstorage} from "ngx-webstorage";
import {AppStorage} from "./services/storage";
import {LocalStorageService, SessionStorageService} from "ngx-webstorage";
import {AppService} from "./app.service";

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
            bootstrap: [AppComponent],
            declarations: [
              AppComponent,
              ...APP_PAGES
            ],
            /**
             * Import Angular's modules.
             */
            imports: [
              ShareModule,
              Ng2Webstorage.forRoot({prefix: 'mr.vjcspy@gmail.com', separator: '|', caseSensitive: true}),
              ToastModule.forRoot(),
              R_IMPORTS,
              BrowserModule,
              BrowserAnimationsModule,
              RouterExternalModule,
              RouterModule.forRoot(ROUTES, {useHash: true, preloadingStrategy: SelectivePreloadingStrategy}),
            ],
            /**
             * Expose our Services and Providers into Angular's dependency injection.
             */
            providers: [
              AppService,
              {provide: ToastsManager, useClass: CustomToastOptions},
              SelectivePreloadingStrategy,
              LocalStorageService, SessionStorageService,
              AppStorage,
              ...APP_PROVIDERS,
              ...METEOR_COLLECTION,
              ENV_PROVIDERS,
              R_PROVIDERS
            ]
          })
export class AppModule {
}
