import {
  Component,
  OnInit
} from '@angular/core';
import {MeteorObservable} from "meteor-rxjs";
import {ActivatedRoute} from "@angular/router";
import * as _ from "lodash";
import {ManageUsersService} from "./manage-users.service";


@Component({
             selector   : 'role',
             templateUrl: 'role.html'
           })
export class RolesComponent implements OnInit {

  protected roles: any;
  protected currentGroup: string;
  protected role_id: number;
  protected permissions: any;
  constructor(private route: ActivatedRoute,
              protected userService: ManageUsersService) {}

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.role_id = p['id'];
    });

    MeteorObservable.call("api.get_roles").subscribe((res) => {
        this.roles = res['items'];
    });

    if (!!this.role_id){
      MeteorObservable.call("api.get_permissions_role", this.role_id).subscribe((res)=>{
        console.log(res);
        this.permissions = res;
      });
    }

    this.initPageJs();
  }

  private initPageJs() {
    let vm                            = this;
    let initValidationMaterial = function () {
      jQuery('.js-validation-permission').validate({
                                                       errorClass: 'help-block text-right animated fadeInDown',
                                                       errorElement: 'div',
                                                       errorPlacement: function (error, e) {
                                                         jQuery(e).parents('.form-group > div').append(error);
                                                       },
                                                       highlight: function (e) {
                                                         var elem = jQuery(e);

                                                         elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                                                         elem.closest('.help-block').remove();
                                                       },
                                                       success: function (e) {
                                                         var elem = jQuery(e);

                                                         elem.closest('.form-group').removeClass('has-error');
                                                         elem.closest('.help-block').remove();
                                                       },
                                                       rules: {
                                                       },
                                                       messages: {
                                                       },
                                                       submitHandler: function (form) {
                                                         let permissions = [];
                                                          _.forEach(vm.permissions, (value, key) => {
                                                            _.forEach(value, (val, k) => {
                                                              let perm = _.omit(val, ['created_at', 'updated_time'])
                                                              permissions.push(perm);
                                                            });
                                                          });
                                                          let data = {
                                                            role_id: vm.role_id,
                                                            permissions: permissions
                                                          };
                                                          vm.userService.updateXRetailPermission(data);
                                                       }
                                                     });
    };
    initValidationMaterial();
  }

  getGroupOfPermission(permission: string){
    if (permission){
      return permission.split("_")[0];
    }
  }

  setCurrentGroup(group: string){
    this.currentGroup = group;
  }

  getCurrentGroup(){
    if (!this.currentGroup){
      this.currentGroup = _.keys(this.permissions)[0];
    }
    return this.currentGroup;
  }

  getAllSectionsOfGroup(group){
      let sections = [];
      _.forEach(group.value, (permission, k) => {
        let arr_str = permission['permission'].split('_');
        sections.push(arr_str[1]);
      });
      return _.uniq(sections);
  }


}
