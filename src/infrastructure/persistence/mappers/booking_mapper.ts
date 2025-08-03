import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyMapper } from "./property_mapper";
import { UserMapper } from "./user_mapper";

export class BookingMapper {
  static toDomain(entity: BookingEntity, property?: Property): Booking {
    if (!entity.id) {
      throw new Error("O ID da reserva é obrigatório");
    }

    if (!entity.guest) {
      throw new Error("O hóspede da reserva é obrigatório");
    }

    if (entity.guestCount <= 0) {
      throw new Error("O número de hóspedes deve ser maior que zero");
    }

    if (entity.totalPrice < 0) {
      throw new Error("O preço total não pode ser negativo");
    }

    const guest = UserMapper.toDomain(entity.guest);
    const dateRange = new DateRange(entity.startDate, entity.endDate);

    const booking = new Booking(
      entity.id,
      property || PropertyMapper.toDomain(entity.property),
      guest,
      dateRange,
      entity.guestCount
    );

    booking["totalPrice"] = Number(entity.totalPrice);
    booking["status"] = entity.status;

    return booking;
  }

  static toPersistence(domain: Booking): BookingEntity {
    if (!domain.getId()) {
      throw new Error("O ID da reserva é obrigatório");
    }

    if (!domain.getProperty() || !domain.getGuest()) {
      throw new Error("A propriedade e o hóspede são obrigatórios");
    }

    if (domain.getGuestCount() <= 0) {
      throw new Error("O número de hóspedes deve ser maior que zero");
    }

    if (domain.getTotalPrice() < 0) {
      throw new Error("O preço total não pode ser negativo");
    }

    const entity = new BookingEntity();
    entity.id = domain.getId();
    entity.property = PropertyMapper.toPersistence(domain.getProperty());
    entity.guest = UserMapper.toPersistence(domain.getGuest());
    entity.startDate = domain.getDateRange().getStartDate();
    entity.endDate = domain.getDateRange().getEndDate();
    entity.guestCount = domain.getGuestCount();
    entity.totalPrice = domain.getTotalPrice();
    entity.status = domain.getStatus();
    return entity;
  }
}
