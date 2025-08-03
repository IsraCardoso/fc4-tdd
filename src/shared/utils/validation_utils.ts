import { ValidationError } from '../errors/app_error';

type ValidationRule<T> = {
  validate: (value: T) => boolean;
  message: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

export class Validator<T extends object> {
  private validations: ValidationRules<T>;

  constructor(validations: ValidationRules<T>) {
    this.validations = validations;
  }

  validate<K extends keyof T>(field: K, value: T[K]): void {
    const validation = this.validations[field];
    
    if (!validation) {
      return;
    }

    if (!validation.validate(value)) {
      throw new ValidationError(validation.message);
    }
  }

  validateAll(data: T): void {
    // Get all keys from the validation rules
    const fields = Object.keys(this.validations) as Array<keyof T>;
    
    // Validate each field that has a validation rule
    for (const field of fields) {
      if (field in data) {
        this.validate(field, data[field]);
      }
    }
  }
}

export function createValidator<T extends object>(validations: ValidationRules<T>): Validator<T> {
  return new Validator(validations);
}
