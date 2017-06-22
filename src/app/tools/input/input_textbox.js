/**
 * Created by abreneli on 01/07/2016.
 */
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
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var noop = function () { };
exports.INPUTBOX_CONTROL_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return InputTextbox; }),
    multi: true
};
var InputTextbox = (function () {
    function InputTextbox() {
        this.innerValue = "";
        //Placeholders for the callbacks which are later providesd
        //by the Control Value Accessor
        this.onTouchedCallback = noop;
        this.onChangeCallback = noop;
        this.lineNb = 1;
    }
    Object.defineProperty(InputTextbox.prototype, "value", {
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
    InputTextbox.prototype.writeValue = function (value) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    };
    //Set touched on blur
    InputTextbox.prototype.onBlur = function () {
        this.onTouchedCallback();
    };
    InputTextbox.prototype.registerOnChange = function (fn) {
        this.onChangeCallback = fn;
        console.log();
    };
    InputTextbox.prototype.registerOnTouched = function (fn) {
        this.onTouchedCallback = fn;
    };
    InputTextbox.prototype.setStyle = function () {
        return this.lineNb == 1 ?
            { 'width': this.width }
            : { 'width': this.width, 'height': this.lineNb + 'em' };
    };
    return InputTextbox;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InputTextbox.prototype, "id", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InputTextbox.prototype, "label", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], InputTextbox.prototype, "width", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], InputTextbox.prototype, "lineNb", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], InputTextbox.prototype, "value", null);
InputTextbox = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'input-textbox',
        templateUrl: './input_textbox.html',
        styleUrls: ['./input_textbox.css'],
        providers: [exports.INPUTBOX_CONTROL_VALUE_ACCESSOR]
    }),
    __metadata("design:paramtypes", [])
], InputTextbox);
exports.InputTextbox = InputTextbox;
//# sourceMappingURL=input_textbox.js.map