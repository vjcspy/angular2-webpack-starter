import {NgModule} from "@angular/core";
import {
  RouterModule,
  PreloadAllModules
} from "@angular/router";

/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from "./environment";
import {ROUTES} from "./app.routes";
// App is our top level component
import {AppComponent} from "./app.component";

import "../styles/styles.scss";
import "../styles/headings.css";
import {ShareModule} from "./modules/share/share.module";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterExternalModule} from "./modules/router/router.module";
import {R_IMPORTS, R_PROVIDERS} from "./R/index";
import {APP_PAGES} from "./pages/index";

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
              R_IMPORTS,
              BrowserModule,
              BrowserAnimationsModule,
              RouterExternalModule,
              RouterModule.forRoot(ROUTES, {useHash: true, preloadingStrategy: PreloadAllModules})
            ],
            /**
             * Expose our Services and Providers into Angular's dependency injection.
             */
            providers: [
              ENV_PROVIDERS,
              R_PROVIDERS
            ]
          })
export class AppModule {
}
