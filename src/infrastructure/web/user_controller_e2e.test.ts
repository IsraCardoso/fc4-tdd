import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMUserRepository } from "../repositories/typeorm_user_repository";
import { UserEntity } from "../persistence/entities/user_entity";
import { UserService } from "../../application/services/user_service";
import { UserController } from "./user_controller";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let userRepository: TypeORMUserRepository;
let userService: UserService;
let userController: UserController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [UserEntity],
    synchronize: true,
    logging: false,
  });
  await dataSource.initialize();

  userRepository = new TypeORMUserRepository(dataSource.getRepository(UserEntity));
  userService = new UserService(userRepository);
  userController = new UserController(userService);
  
  app.post("/users", async (req, res, next) => {
    try {
      await userController.createUser(req, res);
    } catch (error) {
      next(error);
    }
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("UserController E2E Tests", () => {
  beforeEach(async () => {
    const userRepo = dataSource.getRepository(UserEntity);
    await userRepo.clear();
  });

  describe("POST /users", () => {
    it("deve criar um usuário com sucesso", async () => {
      const userData = {
        name: "John Doe"
      };

      const response = await request(app)
        .post("/users")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(userData.name);
    });

    it("deve retornar erro com código 400 e mensagem 'O campo nome é obrigatório.' ao enviar um nome vazio", async () => {
      const response = await request(app)
        .post("/users")
        .send({ name: "" })
        .expect(400);

      expect(response.body).toEqual({
        error: "O campo nome é obrigatório."
      });
    });
  });
});
