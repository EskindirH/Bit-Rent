import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function phoneValidator(phoneRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const result = phoneRe.test(control.value);
      return !result ? {forbiddenPhone: {value: control.value}} : null;
    };
  }