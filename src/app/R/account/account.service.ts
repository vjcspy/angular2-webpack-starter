import {Injectable} from '@angular/core';
import {Subscription} from "rxjs";
import {NotifyManager} from "../../services/notify-manager";
import {MeteorObservable} from "meteor-rxjs";
import {AuthenticateService} from "../../services/authenticate";

@Injectable()
export class AccountService {
  
  private _subscribeAccount: Subscription;
  
  constructor(protected authenticate: AuthenticateService,
              protected notify: NotifyManager,) { }
  
  subscribeAccountChange() {
    if (typeof this._subscribeAccount === 'undefined') {
      MeteorObservable.autorun().subscribe(() => {
        this.authenticate.user = Meteor.user();
      });
    }
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
