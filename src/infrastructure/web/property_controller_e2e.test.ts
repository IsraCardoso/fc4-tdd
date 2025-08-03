import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMPropertyRepository } from "../repositories/typeorm_property_repository";
import { PropertyEntity } from "../persistence/entities/property_entity";
import { BookingEntity } from "../persistence/entities/booking_entity";
import { UserEntity } from "../persistence/entities/user_entity";
import { PropertyService } from "../../application/services/property_service";
import { PropertyController } from "./property_controller";
import { errorHandler } from "../../shared/middlewares/error_handler";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [PropertyEntity, BookingEntity, UserEntity],
    synchronize: true,
    logging: false,
  });
  await dataSource.initialize();

  propertyRepository = new TypeORMPropertyRepository(dataSource.getRepository(PropertyEntity));
  propertyService = new PropertyService(propertyRepository);
  propertyController = new PropertyController(propertyService);
  
  app.post("/properties", propertyController.createProperty);
  
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    errorHandler(err, req, res, next);
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("PropertyController E2E Tests", () => {
  beforeEach(async () => {
    const propertyRepo = dataSource.getRepository(PropertyEntity);
    await propertyRepo.clear();
  });

  describe("POST /properties", () => {
    it("deve criar uma propriedade com sucesso", async () => {
      const propertyData = {
        name: "Casa na Praia",
        description: "Casa com vista para o mar",
        maxGuests: 6,
        basePricePerNight: 500
      };

      const response = await request(app)
        .post("/properties")
        .send(propertyData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        name: propertyData.name,
        description: propertyData.description,
        maxGuests: propertyData.maxGuests,
        basePricePerNight: propertyData.basePricePerNight
      });
      expect(response.body.id).toBeDefined();
    });

    it("deve retornar erro com código 400 e mensagem 'O nome da propriedade é obrigatório.' ao enviar um nome vazio", async () => {
      const propertyData = {
        name: "",
        description: "Descrição qualquer",
        maxGuests: 2,
        basePricePerNight: 200
      };

      const response = await request(app)
        .post("/properties")
        .send(propertyData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "O campo nome é obrigatório."
      });
    });

    it("deve retornar erro com código 400 e mensagem 'A capacidade máxima deve ser maior que zero.' ao enviar maxGuests igual a zero ou negativo", async () => {
      const propertyData = {
        name: "Apartamento",
        description: "Apartamento no centro",
        maxGuests: 0,
        basePricePerNight: 300
      };

      const response = await request(app)
        .post("/properties")
        .send(propertyData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "O número máximo de hóspedes deve ser maior que zero."
      });
    });

    it("deve retornar erro com código 400 e mensagem 'O preço base por noite deve ser maior que zero' ao enviar basePricePerNight ausente ou inválido", async () => {
      const propertyData = {
        name: "Casa de Campo",
        description: "Casa no campo",
        maxGuests: 4,
        basePricePerNight: 0
      };

      const response = await request(app)
        .post("/properties")
        .send(propertyData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: "O preço base por noite deve ser maior que zero."
      });
    });
  });
});
