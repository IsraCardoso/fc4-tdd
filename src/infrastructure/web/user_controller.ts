import { UserService } from "../../application/services/user_service";
import { Request, Response } from "express";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const { name } = req.body;
      
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'O campo nome é obrigatório.' });
      }

      const user = await this.userService.createUser(name);
      
      return res.status(201).json({
        id: user.getId(),
        name: user.getName()
      });
    } catch (error: any) {
      if (error.message === 'O campo nome é obrigatório.') {
        return res.status(400).json({ error: error.message });
      }
      
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
