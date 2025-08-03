import { User } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/user_repository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(name: string): Promise<User> {
    if (!name || name.trim().length === 0) {
      throw new Error("O campo nome é obrigatório.");
    }
    
    const userId = Math.random().toString(36).substring(2, 15);
    const userName = name.trim();
    const user = new User(userId, userName);
    
    await this.userRepository.save(user);
    return user;
  }
}
