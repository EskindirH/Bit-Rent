import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validateEmail(emailRegex: RegExp): ValidatorFn{
    return (control: AbstractControl): ValidationErrors |null =>{
        const forbiddenEmail= emailRegex.test(control.value);
        return !forbiddenEmail ?{ forbiddenEmail: {value: control.value}}: null;
    }
}