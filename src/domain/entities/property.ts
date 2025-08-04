import { DateRange } from "../value_objects/date_range";
import { Booking } from "./booking";
import { PROPERTY_ERRORS } from "../../shared/errors/error_messages";
import { createValidator } from "../../shared/utils/validation_utils";
import { ValidationError } from "../../shared/errors/app_error";

type PropertyData = {
  name: string;
  description: string;
  maxGuests: number;
  basePricePerNight: number;
};

export class Property {
  private readonly bookings: Booking[] = [];
  private static readonly validator = createValidator<PropertyData>({
    name: {
      validate: (value: string) => !!value?.trim(),
      message: PROPERTY_ERRORS.NAME_REQUIRED,
    },
    maxGuests: {
      validate: (value: number) => value > 0,
      message: PROPERTY_ERRORS.MAX_GUESTS_INVALID,
    },
    basePricePerNight: {
      validate: (value: number) => value > 0,
      message: PROPERTY_ERRORS.BASE_PRICE_INVALID,
    },
  });

  constructor(
    private id: string,
    private name: string,
    private description: string,
    private maxGuests: number,
    private basePricePerNight: number
  ) {
    Property.validator.validateAll({
      name,
      description,
      maxGuests,
      basePricePerNight,
    });

    this.id = id;
    this.name = name;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getMaxGuests(): number {
    return this.maxGuests;
  }

  getBasePricePerNight(): number {
    return this.basePricePerNight;
  }

  validateGuestCount(guestCount: number): void {
    if (guestCount > this.maxGuests) {
      throw new ValidationError(
        PROPERTY_ERRORS.MAX_GUESTS_EXCEEDED(this.maxGuests)
      );
    }
  }

  calculateTotalPrice(dateRange: DateRange): number {
    const totalNights = dateRange.getTotalNights();
    let totalPrice = totalNights * this.basePricePerNight;

    if (totalNights >= 7) {
      totalPrice *= 0.9;
    }

    return totalPrice;
  }

  isAvailable(dateRange: DateRange): boolean {
    return !this.bookings.some(
      (booking) =>
        booking.getStatus() === "CONFIRMED" &&
        booking.getDateRange().overlaps(dateRange)
    );
  }

  addBooking(booking: Booking): void {
    this.bookings.push(booking);
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      maxGuests: this.maxGuests,
      basePricePerNight: this.basePricePerNight,
    };
  }
}
