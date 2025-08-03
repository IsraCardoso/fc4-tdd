import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";

export class PropertyMapper {
  static toDomain(entity: PropertyEntity): Property {
    if (!entity.id || !entity.name) {
      throw new Error("ID e nome da propriedade são obrigatórios");
    }
    
    if (entity.maxGuests <= 0) {
      throw new Error("O número máximo de hóspedes deve ser maior que zero");
    }

    if (entity.basePricePerNight <= 0) {
      throw new Error("O preço base por noite deve ser maior que zero");
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
      throw new Error("ID e nome da propriedade são obrigatórios");
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
