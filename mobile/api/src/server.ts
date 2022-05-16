import { serverHttp } from "./app";

//Binds and listens for connections on the specified host and port.
serverHttp.listen(4000, () => console.log('server is running on port 4000'));