import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyMapper } from "./property_mapper";
import { UserMapper } from "./user_mapper";
import { ValidationError } from "../../../shared/errors/app_error";
import { BOOKING_ERRORS } from "../../../shared/errors/error_messages";

export class BookingMapper {
  static toDomain(entity: BookingEntity, property?: Property): Booking {
    if (!entity.id) {
      throw new ValidationError(BOOKING_ERRORS.ID_REQUIRED);
    }

    if (!entity.guest) {
      throw new ValidationError(BOOKING_ERRORS.GUEST_REQUIRED);
    }

    if (entity.guestCount <= 0) {
      throw new ValidationError(BOOKING_ERRORS.GUEST_COUNT_INVALID);
    }

    if (entity.totalPrice < 0) {
      throw new ValidationError(BOOKING_ERRORS.TOTAL_PRICE_INVALID);
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
      throw new ValidationError(BOOKING_ERRORS.ID_REQUIRED);
    }

    if (!domain.getProperty() || !domain.getGuest()) {
      throw new ValidationError(BOOKING_ERRORS.PROPERTY_AND_GUEST_REQUIRED);
    }

    if (domain.getGuestCount() <= 0) {
      throw new ValidationError(BOOKING_ERRORS.GUEST_COUNT_INVALID);
    }

    if (domain.getTotalPrice() < 0) {
      throw new ValidationError(BOOKING_ERRORS.TOTAL_PRICE_INVALID);
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
