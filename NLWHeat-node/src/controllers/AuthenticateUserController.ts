//Imports request e response types from express
import { Request, Response } from "express";
//Imports Service from the services directory
import { AuthenticateUserService } from "../services/AuthenticateUserService";


class AuthenticateUserController {
  //request: and response: to define the type of requests and responses are expected
  async handle(request: Request, response: Response) {
    //code de desestruturado from request.body
    const { code } = request.body;
    //instance a layer of service
    const service = new AuthenticateUserService();
    try {
      const result = await service.execute(code);
      //Return result from auth service
      return response.json(result);
    } catch (err) {
      return response.json(err.message);
    }
  }
}

export { AuthenticateUserController }