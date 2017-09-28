import {Injectable} from '@angular/core';
import {AppStorage} from "../../services/storage";
import {Observable, Subscription} from "rxjs";
import {LicenseCollection} from "../../services/meteor-collections/licenses";
import {ProductCollection} from "../../services/meteor-collections/products";
import {NotifyManager} from "../../services/notify-manager";
import * as _ from 'lodash';
import {AccountActions} from "./account.actions";

@Injectable()
export class AccountService {
  
  protected subscriptionLicense: Subscription;
  
  constructor(protected storage: AppStorage,
              protected licenseCollection: LicenseCollection,
              protected productCollection: ProductCollection,
              protected notify: NotifyManager,
              protected accountActions: AccountActions) { }
  
  saveUserToStorage(user: any): void {
    this.storage.localStorage('user', user);
  }
  
  removeUserFromStorage() {
    this.storage.localClear('user');
  }
  
  subscribeLicense(resubscribe: boolean = false) {
    if (typeof this.subscriptionLicense === 'undefined' || resubscribe === true) {
      if (this.subscriptionLicense) {
        this.subscriptionLicense.unsubscribe();
      }
      
      this.subscriptionLicense = Observable.combineLatest(this.licenseCollection.getCollectionObservable(), this.productCollection.getCollectionObservable())
                                           .subscribe(([licenseCollection, productCollection]) => {
                                             const products = productCollection.collection.find({}).fetch();
                                             if (products) {
                                               const posProduct = _.find(products, p => p['code'] === 'xpos');
                                               if (posProduct) {
                                                 const licenses = licenseCollection.collection.find({}).fetch();
                                                 if (_.size(licenses) === 1) {
                                                   const licenseHasPos = _.find(licenses[0]['has_product'], p => p['_id'] = posProduct['_id']);
                                                   if (licenseHasPos) {
                                                     this.accountActions.saveLicenseData({licenseHasPos});
                                                   } else {
                                                     this.notify.error("Sorry, we can't find your license");
                                                   }
                                                 } else {
                                                   // this.toasts.error("Can't get license information");
                                                   // throw new GeneralException("Can't find license");
                                                 }
                                               }
                                             } else {
                                               return;
                                             }
                                           });
    }
    
    return this.subscriptionLicense;
  }
  
  register(user: any) {
    return new Promise<void>((resolve, reject) => {
      Accounts.createUser({
                            username: user.username,
                            email: user.email,
                            password: user.password,
                            profile: {
                              status: 1
                            }
                          }, (err: any) => {
        if (err) {
          if (err['reason']) {
            this.notify.error(err['reason'], err['error']);
          }
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  
  login(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Meteor.loginWithPassword(user.username, user.password, (e: Error) => {
        if (!!e) {
          if (e['reason']) {
            this.notify.error(e['reason'], e['error']);
          }
          return reject(e);
        }
        resolve();
      });
    });
  }
  
  logout() {
    return new Promise<void>((resolve, reject) => {
      Meteor.logout((e: Error) => {
        if (!!e) {
          if (e['reason']) {
            this.notify.error(e['reason'], e['error']);
          }
          return reject(e);
        }
        resolve();
      });
    });
  }
  
  requestSendForgotPassword(email: string) {
    return new Promise<void>((resolve, reject) => {
      Accounts.forgotPassword({email}, (e) => {
        if (!e) {
          this.notify.info("A message was sent to your email");
          resolve();
        } else {
          if (e['reason']) {
            this.notify.error(e['reason'], e['error']);
          }
          return reject(e);
        }
      });
    });
  }
  
  resetPassword(token: string, newPassword: string) {
    return new Promise((resolve, reject) => {
      Accounts.resetPassword(token, newPassword, (err) => {
        if (!!err) {
          if (err['reason']) {
            this.notify.error(err['reason'], err['error']);
          }
          return reject(err);
        } else {
          this.notify.success('Password reset successfully');
          resolve();
        }
      });
    });
  }
}
