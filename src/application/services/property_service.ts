import { Property } from "../../domain/entities/property";
import { PropertyRepository } from "../../domain/repositories/property_repository";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }

  async createProperty(name: string, description: string, maxGuests: number, basePricePerNight: number): Promise<Property> {
    const propertyId = Math.random().toString(36).substring(2, 15);
    const propertyName = name.trim();
    const propertyDescription = description.trim();
    const propertyMaxGuests = maxGuests;
    const propertyBasePricePerNight = basePricePerNight;
    const property = new Property(propertyId, propertyName, propertyDescription, propertyMaxGuests, propertyBasePricePerNight);
    
    await this.propertyRepository.save(property);
    return property;
  }
}
