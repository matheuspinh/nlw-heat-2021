//Imports request e response types from express
import { Request, Response } from "express";
//Imports Service from the services directory
import { AuthenticateUserService } from "../services/AuthenticateUserService";
import { CreateMessageService } from "../services/CreateMessageService";

class CreateMessageController {
  async handle(request: Request, response: Response) {
    const { message } = request.body;
    const { user_id } = request;

    const service = new CreateMessageService()

    const result = await service.execute(message, user_id);


    return response.json(result);
  }
}

export { CreateMessageController }