import { USER_ERRORS } from "../../shared/errors/error_messages";
import { createValidator } from "../../shared/utils/validation_utils";

type UserData = {
  id: string;
  name: string;
};

export class User {
  private readonly id: string;
  private readonly name: string;
  
  private static readonly validator = createValidator<UserData>({
    id: {
      validate: (value: string) => !!value?.trim(),
      message: USER_ERRORS.ID_REQUIRED
    },
    name: {
      validate: (value: string) => !!value?.trim(),
      message: USER_ERRORS.NAME_REQUIRED
    }
  });
  
  constructor(id: string, name: string) {
    User.validator.validateAll({ id, name });

    this.id = id;
    this.name = name;
  }
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  toObject() {
    return {
      id: this.id,
      name: this.name
    };
  }
}
