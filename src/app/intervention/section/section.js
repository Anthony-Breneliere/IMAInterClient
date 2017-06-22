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
// import 'jquery-ui';
// import 'gridstack';
var Section = (function () {
    function Section(el) {
        this.toMake = true;
        this.expand = true;
        this.el = el;
    }
    Section.prototype.ngAfterViewInit = function () {
        // var parent = $(this.el).parent();
        // var grid = parent.data('gridstack');
        // if (grid && this.toMake) {
        //     (<any> grid).makeWidget(this.el);
        //     this.toMake = false; 
        // }
    };
    Section.prototype.disp = function (t) {
        console.log(t);
    };
    Section.prototype.clickBar = function () {
        this.expand = !this.expand;
    };
    return Section;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], Section.prototype, "title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], Section.prototype, "color", void 0);
Section = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'section',
        templateUrl: './section.html',
        styleUrls: ['./section.css', '../../../node_modules/gridstack/dist/gridstack.css']
    }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], Section);
exports.Section = Section;
//# sourceMappingURL=section.js.map