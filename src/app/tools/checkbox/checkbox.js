"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// /**
//  * Created by abreneli on 01/07/2016.
//  */
//
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var noop = function () { };
exports.CHECKBOX_CONTROL_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return Checkbox; }),
    multi: true
};
var Checkbox = (function () {
    function Checkbox() {
        //Placeholders for the callbacks which are later providesd
        //by the Control Value Accessor
        this.onTouchedCallback = noop;
        this.onChangeCallback = noop;
        this.checked = false;
    }
    Checkbox.prototype.setStyle = function () {
        return { 'width': this.width };
    };
    Object.defineProperty(Checkbox.prototype, "value", {
        //get accessor
        get: function () {
            return this.innerValue;
        },
        //set accessor including call the onchange callback
        set: function (v) {
            if (v !== this.innerValue) {
                this.innerValue = v;
                this.onChangeCallback(v);
            }
        },
        enumerable: true,
        configurable: true
    });
    ;
    Checkbox.prototype.writeValue = function (value) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    };
    Checkbox.prototype.onBlur = function () {
        this.onTouchedCallback();
    };
    Checkbox.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
    };
    Checkbox.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    return Checkbox;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], Checkbox.prototype, "label", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], Checkbox.prototype, "width", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], Checkbox.prototype, "checked", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], Checkbox.prototype, "value", null);
Checkbox = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'checkbox',
        templateUrl: './checkbox.html',
        styleUrls: ['./checkbox.css'],
        providers: [exports.CHECKBOX_CONTROL_VALUE_ACCESSOR]
    }),
    __metadata("design:paramtypes", [])
], Checkbox);
exports.Checkbox = Checkbox;
//# sourceMappingURL=checkbox.js.map