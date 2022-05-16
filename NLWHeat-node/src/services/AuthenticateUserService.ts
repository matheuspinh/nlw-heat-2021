//Import axios installed via "yard add axios"
import axios from "axios";
//Import prisma client_id
import prismaClient from "../prisma";
//import function to sign the user
import { sign } from "jsonwebtoken"

//This service will be authenticating users via github
/*Receive code(string) 
Recover access_token from github
Recover user information from github
Verify if user exists in our db
YES = Generate access token
NO = Create in Db, generate access token
Returns token with user information
*/
//Interface do IAccessTokenResponse
interface IAccessTokenResponse {
  access_token: string;
}
//Interface para selecionar as informações a serem retornadas
interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  //receives code from github
  async execute(code: string) {
    //Declaring a url constant to github
    const url = "https://github.com/login/oauth/access_token"
    //Função para aguardar o retorno da url postada no argumento, e chamar a informação recebida de accessTokenResponse// No terceiro argumento são passados parâmetros em params: {} para conseguir acesso ao access_token// É passado em headers: {} o "Accept": "application/json" para retornar a resposta como JSON
    const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        "Accept": "application/json"
      }
    });

    const response = await axios.get<IUserResponse>("https://api.github.com/user", {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`
      },
    });

    const { login, id, avatar_url, name } = response.data

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id
      }
    })

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          login,
          avatar_url,
          name
        }
      })
    }
    //
    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id
        }
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d"
      }
    );

    return { token, user };
  }
}

export { AuthenticateUserService }