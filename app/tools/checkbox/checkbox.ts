// /**
//  * Created by abreneli on 01/07/2016.
//  */
//
import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, DefaultValueAccessor   } from '@angular/forms';

const noop = () => {};

export const CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Checkbox),
    multi: true
};

@Component({
    selector: 'checkbox',
    templateUrl: 'app/tools/checkbox/checkbox.html',
    styleUrls: ['app/tools/checkbox/checkbox.css'],
    providers: [CHECKBOX_CONTROL_VALUE_ACCESSOR]
})

export class Checkbox implements ControlValueAccessor
{
    private innerValue: any;

    @Input() public label: string;
    @Input() public width: string;
    @Input() public checked: boolean;

    constructor()
    {
        this.checked = false;
    }

    public setStyle(): any
    {
        return    { 'width' : this.width };
    }

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

    writeValue(value: any): void
    {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    onBlur() {
        this.onTouchedCallback();
    }

    registerOnChange(fn: any): void
    {
        this.onChangeCallback = fn;
    }

    registerOnTouched(fn: any): void
    {
        this.onTouchedCallback = fn;

    }
}
