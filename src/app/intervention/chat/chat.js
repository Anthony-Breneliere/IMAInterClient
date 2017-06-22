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
var intervention_1 = require("../../model/intervention");
var intervention_service_1 = require("../../services/intervention.service");
var Subject_1 = require("rxjs/Subject");
var Chat = (function () {
    function Chat(interService, ref) {
        this.interService = interService;
        this.ref = ref;
        // liste des changements
        this.newInterDataSource = new Subject_1.Subject();
    }
    Object.defineProperty(Chat.prototype, "intervention", {
        get: function () { return this._intervention; },
        set: function (value) {
            var _this = this;
            this._intervention = value;
            // à chaque changement d'intervention affichée le composant s'abonne aux changements de l'intervention correspondante
            if (this.newInterSub)
                this.newInterSub.unsubscribe();
            // on filtre les message sur l'instance de l'intervention qui est actuellement affichée
            this.newInterSub =
                this.interService.newMessages$.filter(function (i) { return _this._intervention != null; }).subscribe(function (i) { return _this.detectChanges(); });
        },
        enumerable: true,
        configurable: true
    });
    Chat.prototype.writeMessage = function ($event, message) {
        this.interService.chat(this.intervention.Id, message);
        this.messageInput.nativeElement.value = "";
    };
    Chat.prototype.keyPress = function ($event) {
        if ($event.keyCode == 13) {
            this.interService.chat(this.intervention.Id, this.messageInput.nativeElement.value);
            this.messageInput.nativeElement.value = "";
        }
    };
    Chat.prototype.detectChanges = function () {
        this.ref.markForCheck();
        console.log("nb de messages" + this.intervention.Chat.values.length);
    };
    return Chat;
}());
__decorate([
    core_1.ViewChild('messageInput'),
    __metadata("design:type", core_1.ElementRef)
], Chat.prototype, "messageInput", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", intervention_1.Intervention),
    __metadata("design:paramtypes", [intervention_1.Intervention])
], Chat.prototype, "intervention", null);
Chat = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'chat',
        templateUrl: './chat.html',
        styleUrls: ['./chat.css'],
        // pour des raisons de performence, les champs ne seront mis à jour que sur un appel de onChangeCallback
        changeDetection: core_1.ChangeDetectionStrategy.OnPush
    }),
    __metadata("design:paramtypes", [intervention_service_1.InterventionService, core_1.ChangeDetectorRef])
], Chat);
exports.Chat = Chat;
//# sourceMappingURL=chat.js.map