import { Booking } from "../../../domain/entities/booking";
import { Property } from "../../../domain/entities/property";
import { User } from "../../../domain/entities/user";
import { DateRange } from "../../../domain/value_objects/date_range";
import { BookingEntity } from "../entities/booking_entity";
import { PropertyEntity } from "../entities/property_entity";
import { UserEntity } from "../entities/user_entity";
import { BookingMapper } from "./booking_mapper";

describe('BookingMapper', () => {
  let property: Property;
  let user: User;
  let dateRange: DateRange;
  let bookingEntity: BookingEntity;
  let propertyEntity: PropertyEntity;
  let userEntity: UserEntity;

  beforeEach(() => {
    property = new Property('property-123', 'Beach House', 'A beautiful beach house', 4, 200);
    user = new User('user-123', 'John Doe');
    dateRange = new DateRange(
      new Date('2024-12-20'),
      new Date('2024-12-25')
    );

    propertyEntity = new PropertyEntity();
    propertyEntity.id = 'property-123';
    propertyEntity.name = 'Beach House';
    propertyEntity.description = 'A beautiful beach house';
    propertyEntity.maxGuests = 4;
    propertyEntity.basePricePerNight = 200;

    userEntity = new UserEntity();
    userEntity.id = 'user-123';
    userEntity.name = 'John Doe';

    bookingEntity = new BookingEntity();
    bookingEntity.id = 'booking-123';
    bookingEntity.property = propertyEntity;
    bookingEntity.guest = userEntity;
    bookingEntity.startDate = dateRange.getStartDate();
    bookingEntity.endDate = dateRange.getEndDate();
    bookingEntity.guestCount = 2;
    bookingEntity.totalPrice = 1200;
    bookingEntity.status = 'CONFIRMED';
  });

    it('deve converter BookingEntity para Booking corretamente', () => {
      const booking = BookingMapper.toDomain(bookingEntity);

      expect(booking.getId()).toBe('booking-123');
      expect(booking.getProperty().getId()).toBe('property-123');
      expect(booking.getGuest().getId()).toBe('user-123');
      expect(booking.getDateRange().getStartDate()).toEqual(dateRange.getStartDate());
      expect(booking.getDateRange().getEndDate()).toEqual(dateRange.getEndDate());
      expect(booking.getGuestCount()).toBe(2);
      expect(booking.getTotalPrice()).toBe(1200);
      expect(booking.getStatus()).toBe('CONFIRMED');
    });

    it('deve aceitar uma propriedade opcional para evitar carregamento duplicado', () => {
      const customProperty = new Property('property-456', 'Mountain Cabin', 'Cozy cabin', 6, 300);
      
      const booking = BookingMapper.toDomain(bookingEntity, customProperty);
      
      expect(booking.getProperty().getId()).toBe('property-456');
      expect(booking.getProperty().getName()).toBe('Mountain Cabin');
    });

    it('deve lançar erro se o BookingEntity for inválido', () => {
      bookingEntity.id = '';
      
      expect(() => {
        BookingMapper.toDomain(bookingEntity);
      }).toThrow('O ID da reserva é obrigatório');
    });

    it('deve converter Booking para BookingEntity corretamente', () => {
      const booking = new Booking(
        'booking-123',
        property,
        user,
        dateRange,
        2
      );
      booking['totalPrice'] = 1200;
      booking['status'] = 'CONFIRMED';

      const entity = BookingMapper.toPersistence(booking);

      expect(entity.id).toBe('booking-123');
      expect(entity.property).toBeDefined();
      expect(entity.guest).toBeDefined();
      expect(entity.startDate).toEqual(dateRange.getStartDate());
      expect(entity.endDate).toEqual(dateRange.getEndDate());
      expect(entity.guestCount).toBe(2);
      expect(entity.totalPrice).toBe(1200);
      expect(entity.status).toBe('CONFIRMED');
    });

    it('deve lançar erro se o Booking for inválido', () => {
      const invalidBooking = new Booking(
        '',
        property,
        user,
        dateRange,
        2
      );

      expect(() => {
        BookingMapper.toPersistence(invalidBooking);
      }).toThrow('O ID da reserva é obrigatório');
    });
});