import {
  Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import {Subscription} from "rxjs";
import {FormValidationService} from "../../share/provider/form-validation";
import {GeneralException} from "../../+pos/core/framework/General/Exception/GeneralException";
import * as _ from 'lodash';

@Component({
             // moduleId: module.id,
             encapsulation: ViewEncapsulation.None,
             selector: 'retail-select2',
             templateUrl: 'select2.component.html',
             styleUrls: ['select2.component.scss'],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class RetailSelect2Component implements OnInit, AfterViewInit, OnDestroy {
  @Input('elementData') elementData: any;
  @Input() formKey: string;
  @Input() disabled: boolean  = false;
  @Input() validation: string = "";
  @Input() multiple: boolean  = false;
  @ViewChild("selectElem") selectElem: ElementRef;
  
  protected _validProperty = {
    isValid: true,
    mess: ""
  };
  protected _validateSubscription: Subscription;
  
  protected modelValue: string | string[];
  
  @Output() modelChange = new EventEmitter();
  
  @Input()
  set model(optionValue: string | string[]) {
    // remove validate
    this._validateElement(false);
    
    this.modelValue = optionValue;
    this.modelChange.emit(this.modelValue);
  }
  
  get model() {
    return this.modelValue;
  }
  
  constructor(protected _elementRef: ElementRef, protected formValidationService: FormValidationService) {
  }
  
  ngOnInit() {
    // for form validation
    if (this.formKey) {
      this._validateSubscription = this.formValidationService
                                       .onSubmitOrCancel(
                                         this.formKey,
                                         () => this._validateElement(true),
                                         () => this._validateElement(false)
                                       );
    }
  }
  
  ngOnDestroy(): void {
    if (typeof this._validateSubscription !== "undefined") {
      this._validateSubscription.unsubscribe();
    }
  }
  
  ngAfterViewInit(): void {
    let vm = this;
    if (this.selectElem.nativeElement) {
      let _e = jQuery(this.selectElem.nativeElement);
      _e['select2']()
        .on('change', function () {
          vm.model = <any>jQuery(this).val();
        });
      if (this.multiple === true) {
        _e.val(this.model).trigger("change");
      }
    } else {
      throw new GeneralException("Can't create retail-select2 component");
    }
  }
  
  protected _validateElement(needValid): boolean {
    if (!needValid || !this.validation) {
      this._validProperty = {
        isValid: true,
        mess: ""
      };
      return true;
    } else {
      this._validProperty = <any>this.formValidationService.validate(this.validation, this.model);
      return this._validProperty.isValid;
    }
    
  }
  
  isSelected(value) {
    if (this.multiple === true) {
      if (_.isArray(this.model)) {
        return _.indexOf(this.model, value) > -1;
      } else {
        return false;
      }
    } else {
      return this.model == value;
    }
  }
  
  protected trackOption(index: number, option: Object) {
    return option['value'];
  }
}