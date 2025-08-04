import express, { Request, Response, NextFunction } from "express";
import { DataSource } from "typeorm";
import { TypeORMBookingRepository } from "./infrastructure/repositories/typeorm_booking_repository";
import { TypeORMPropertyRepository } from "./infrastructure/repositories/typeorm_property_repository";
import { TypeORMUserRepository } from "./infrastructure/repositories/typeorm_user_repository";
import { BookingService } from "./application/services/booking_service";
import { PropertyService } from "./application/services/property_service";
import { UserService } from "./application/services/user_service";
import { BookingEntity } from "./infrastructure/persistence/entities/booking_entity";
import { PropertyEntity } from "./infrastructure/persistence/entities/property_entity";
import { UserEntity } from "./infrastructure/persistence/entities/user_entity";
import { BookingController } from "./infrastructure/web/booking_controller";
import { PropertyController } from "./infrastructure/web/property_controller";
import { UserController } from "./infrastructure/web/user_controller";
import { errorHandler } from "./shared/middlewares/error_handler";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing JSON
app.use(express.json());

// Configuração do banco de dados
const dataSource = new DataSource({
  type: "sqlite",
  database: "./database.sqlite",
  entities: [BookingEntity, PropertyEntity, UserEntity],
  synchronize: true,
  logging: false,
});

// Inicialização dos repositórios
const bookingRepository = new TypeORMBookingRepository(
  dataSource.getRepository(BookingEntity)
);
const propertyRepository = new TypeORMPropertyRepository(
  dataSource.getRepository(PropertyEntity)
);
const userRepository = new TypeORMUserRepository(
  dataSource.getRepository(UserEntity)
);

// Inicialização dos serviços
const propertyService = new PropertyService(propertyRepository);
const userService = new UserService(userRepository);
const bookingService = new BookingService(
  bookingRepository,
  propertyService,
  userService
);

// Inicialização dos controllers
const bookingController = new BookingController(bookingService);
const propertyController = new PropertyController(propertyService);
const userController = new UserController(userService);

// Rotas de reservas
app.post("/bookings", (req, res, next) => {
  bookingController.createBooking(req, res).catch((err) => next(err));
});

app.post("/bookings/:id/cancel", (req, res, next) => {
  bookingController.cancelBooking(req, res).catch((err) => next(err));
});

// Rotas de propriedades
app.post("/properties", propertyController.createProperty);

// Rotas de usuários
app.post("/users", (req, res, next) => {
  userController.createUser(req, res).catch((err) => next(err));
});

// Middleware de tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

// Inicialização do servidor
async function startServer() {
  try {
    await dataSource.initialize();
    console.log("✅ Banco de dados conectado com sucesso!");

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📱 API disponível em: http://localhost:${PORT}`);
      console.log("\n📋 Endpoints disponíveis:");
      console.log("  POST   /bookings - Criar reserva");
      console.log("  POST   /bookings/:id/cancel - Cancelar reserva");
      console.log("  POST   /properties - Criar propriedade");
      console.log("  POST   /users - Criar usuário");
    });
  } catch (error) {
    console.error("❌ Erro ao inicializar o servidor:", error);
    process.exit(1);
  }
}

startServer();
