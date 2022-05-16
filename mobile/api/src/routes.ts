import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesConstroller";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAuthenticated } from "./midware/ensureAuthenticated";

const router = Router();
//Instance for the AuthenticateUserController // Handle method added to receive request and response, No need to add methods because express will be able to automatically pass the parameters to the controller
router.post("/authenticate", new AuthenticateUserController().handle);

//Rota para criar mensagens
router.post("/messages", ensureAuthenticated, new CreateMessageController().handle);

//Rota para 3 ultimas mensagens
router.get("/messages/last3", new GetLast3MessagesController().handle)

//Rota para o profile do usuário
router.get("/profile", ensureAuthenticated, new ProfileUserController().handle)
export { router };