import {
  Component,
  OnInit
} from '@angular/core';
import {ProductCollection} from "../../../services/ddp/collections/products";
import {MongoObservable} from "meteor-rxjs";
import {UserCollection} from "../../../services/ddp/collections/users";
import {PriceCollection} from "../../../services/ddp/collections/prices";

@Component({
             selector   : 'add-license',
             templateUrl: 'add.html'
           })
export class AddLicenseComponent implements OnInit {

  protected products: any;
  protected users: any;
  protected prices: any;
  protected base_urls: string[] = [];
  protected currentProduct: any;

  constructor(protected productCollection: ProductCollection,
              protected userCollection: UserCollection,
              protected priceCollection: PriceCollection) { }

  ngOnInit() {
    this.productCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        this.products = collection.find({}).fetch();
      }
    );

    this.userCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        this.users = collection.find({}).fetch();
      }
    );

    this.priceCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        this.prices = collection.find({}).fetch();
      }
    );

    this.initPageJs();
  }

  private initPageJs() {
    let initValidationMaterial = function () {
      jQuery('.js-validation-material').validate({
                                                   ignore        : [],
                                                   errorClass    : 'help-block text-right animated fadeInDown',
                                                   errorElement  : 'div',
                                                   errorPlacement: function (error, e) {
                                                     jQuery(e).parents('.form-group > div').append(error);
                                                   },
                                                   highlight     : function (e) {
                                                     var elem = jQuery(e);

                                                     elem.closest('.form-group').removeClass('has-error').addClass('has-error');
                                                     elem.closest('.help-block').remove();
                                                   },
                                                   success       : function (e) {
                                                     var elem = jQuery(e);

                                                     elem.closest('.form-group').removeClass('has-error');
                                                     elem.closest('.help-block').remove();
                                                   },
                                                   rules         : {
                                                     'val-username2'        : {
                                                       required : true,
                                                       minlength: 3
                                                     },
                                                     'val-email2'           : {
                                                       required: true,
                                                       email   : true
                                                     },
                                                     'val-password2'        : {
                                                       required : true,
                                                       minlength: 5
                                                     },
                                                     'val-confirm-password2': {
                                                       required: true,
                                                       equalTo : '#val-password2'
                                                     },
                                                     'val-select22'         : {
                                                       required: true
                                                     },
                                                     'val-select2-multiple2': {
                                                       required : true,
                                                       minlength: 2
                                                     },
                                                     'val-suggestions2'     : {
                                                       required : true,
                                                       minlength: 5
                                                     },
                                                     'val-skill2'           : {
                                                       required: true
                                                     },
                                                     'val-currency2'        : {
                                                       required: true,
                                                       currency: ['$', true]
                                                     },
                                                     'val-website2'         : {
                                                       required: true,
                                                       url     : true
                                                     },
                                                     'val-phoneus2'         : {
                                                       required: true,
                                                       phoneUS : true
                                                     },
                                                     'val-digits2'          : {
                                                       required: true,
                                                       digits  : true
                                                     },
                                                     'val-number2'          : {
                                                       required: true,
                                                       number  : true
                                                     },
                                                     'val-range2'           : {
                                                       required: true,
                                                       range   : [1, 5]
                                                     },
                                                     'val-terms2'           : {
                                                       required: true
                                                     }
                                                   },
                                                   messages      : {
                                                     'val-username2'        : {
                                                       required : 'Please enter a username',
                                                       minlength: 'Your username must consist of at least 3 characters'
                                                     },
                                                     'val-email2'           : 'Please enter a valid email address',
                                                     'val-password2'        : {
                                                       required : 'Please provide a password',
                                                       minlength: 'Your password must be at least 5 characters long'
                                                     },
                                                     'val-confirm-password2': {
                                                       required : 'Please provide a password',
                                                       minlength: 'Your password must be at least 5 characters long',
                                                       equalTo  : 'Please enter the same password as above'
                                                     },
                                                     'val-select22'         : 'Please select a value!',
                                                     'val-select2-multiple2': 'Please select at least 2 values!',
                                                     'val-suggestions2'     : 'What can we do to become better?',
                                                     'val-skill2'           : 'Please select a skill!',
                                                     'val-currency2'        : 'Please enter a price!',
                                                     'val-website2'         : 'Please enter your website!',
                                                     'val-phoneus2'         : 'Please enter a US phone!',
                                                     'val-digits2'          : 'Please enter only digits!',
                                                     'val-number2'          : 'Please enter a number!',
                                                     'val-range2'           : 'Please enter a number between 1 and 5!',
                                                     'val-terms2'           : 'You must agree to the service terms!'
                                                   }
                                                 });
    };
    initValidationMaterial();
  }

  private onChange(event){
    this.productCollection.getCollectionObservable().subscribe(
      (collection: MongoObservable.Collection<any>) => {
        this.currentProduct = collection.findOne({_id: event.target.value});
      }
    );
  }

  private addBasedUrl(event){
    this.base_urls.push(event.target.value);
    event.target.value = "";
  }
}
