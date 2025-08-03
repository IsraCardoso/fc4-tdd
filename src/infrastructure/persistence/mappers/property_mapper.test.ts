import { Property } from "../../../domain/entities/property";
import { PropertyEntity } from "../entities/property_entity";
import { PropertyMapper } from "./property_mapper";

describe('PropertyMapper', () => {
  describe('toDomain', () => {
    it('deve converter PropertyEntity em Property corretamente', () => {

      const propertyEntity = new PropertyEntity();
      propertyEntity.id = 'property-123';
      propertyEntity.name = 'Beach House';
      propertyEntity.description = 'A beautiful beach house';
      propertyEntity.maxGuests = 4;
      propertyEntity.basePricePerNight = 200;

      const property = PropertyMapper.toDomain(propertyEntity);

      expect(property.getId()).toBe('property-123');
      expect(property.getName()).toBe('Beach House');
      expect(property.getDescription()).toBe('A beautiful beach house');
      expect(property.getMaxGuests()).toBe(4);
      expect(property.getBasePricePerNight()).toBe(200);
    });

    it('deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity', () => {
      const invalidPropertyEntity = new PropertyEntity();
      invalidPropertyEntity.name = 'Invalid Property';
      invalidPropertyEntity.description = 'Missing required fields';
      invalidPropertyEntity.maxGuests = 2;
      invalidPropertyEntity.basePricePerNight = 100;

      expect(() => {
        PropertyMapper.toDomain(invalidPropertyEntity as any);
      }).toThrow();
    });
  });

  describe('toPersistence', () => {
    it('deve converter Property para PropertyEntity corretamente', () => {
      const property = new Property(
        'property-456',
        'Mountain Cabin',
        'Cozy cabin in the mountains',
        6,
        300
      );

      const propertyEntity = PropertyMapper.toPersistence(property);

      expect(propertyEntity.id).toBe('property-456');
      expect(propertyEntity.name).toBe('Mountain Cabin');
      expect(propertyEntity.description).toBe('Cozy cabin in the mountains');
      expect(propertyEntity.maxGuests).toBe(6);
      expect(propertyEntity.basePricePerNight).toBe(300);
    });
  });
});