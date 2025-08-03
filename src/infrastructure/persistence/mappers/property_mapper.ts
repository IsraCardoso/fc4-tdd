import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { ValidationError } from "../../../shared/errors/app_error";
import { PROPERTY_ERRORS } from "../../../shared/errors/error_messages";

export class PropertyMapper {
  static toDomain(entity: PropertyEntity): Property {
    if (!entity.id || !entity.name) {
      throw new ValidationError(PROPERTY_ERRORS.NAME_REQUIRED);
    }
    
    if (entity.maxGuests <= 0) {
      throw new ValidationError(PROPERTY_ERRORS.MAX_GUESTS_INVALID);
    }

    if (entity.basePricePerNight <= 0) {
      throw new ValidationError(PROPERTY_ERRORS.BASE_PRICE_INVALID);
    }

    return new Property(
      entity.id,
      entity.name,
      entity.description,
      entity.maxGuests,
      Number(entity.basePricePerNight)
    );
  }

  static toPersistence(domain: Property): PropertyEntity {
    if (!domain.getId() || !domain.getName()) {
      throw new ValidationError(PROPERTY_ERRORS.NAME_REQUIRED);
    }

    const entity = new PropertyEntity();
    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.description = domain.getDescription();
    entity.maxGuests = domain.getMaxGuests();
    entity.basePricePerNight = domain.getBasePricePerNight();
    return entity;
  }
}
