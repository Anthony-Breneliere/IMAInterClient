/**
 * Created by abreneli on 01/07/2016.
 */

import {Component, Input, forwardRef} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, DefaultValueAccessor   } from '@angular/forms';

const noop = () => {};

export const INPUTBOX_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputTextbox),
    multi: true
};

@Component({
    moduleId: module.id,
    selector: 'input-textbox',
    templateUrl: './input_textbox.html',
    styleUrls: ['./input_textbox.css'],
    providers: [INPUTBOX_CONTROL_VALUE_ACCESSOR]
})

export class InputTextbox implements ControlValueAccessor
{
    private innerValue: any = "";

    @Input() public id: string;
    @Input() public label: string;
    @Input() public width: string;
    @Input() public lineNb: number;

    //Placeholders for the callbacks which are later providesd
    //by the Control Value Accessor
    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    @Input() set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    constructor()
    {
        this.lineNb = 1;
    }


    writeValue(value: any): void
    {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    //Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    registerOnChange(fn: any): void
    {
        this.onChangeCallback = fn;
        console.log()
    }

    registerOnTouched(fn: any): void
    {
        this.onTouchedCallback = fn;

    }

    public setStyle(): any
    {
        return  this.lineNb == 1 ?
        { 'width' : this.width }
        : { 'width' : this.width, 'height' : this.lineNb + 'em' };
    }
}