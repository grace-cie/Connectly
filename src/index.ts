/// [other imports]
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectToDatabase } from "./middleware/MongoDB";

/// [controller imports]
import { UserController } from "./interface/controller/UserController";
import { LoginController } from "./interface/controller/LoginController";

/// [usecases imports]
import { CreateUserUsecase } from "./application/usecase/CreateUser.usecase";
import { LoginUserUsecase } from "./application/usecase/LoginUser.usecase";

/// [repository implementation imports]
import { UserRepositoryImpl } from "./infrastructure/db/UserRepositoryImpl";
import { AuthenticationRepositoryImpl } from "./infrastructure/db/AuthenticationRepositoryImpl";
import { GetUsersUsecase } from "./application/usecase/GetUsers.usecase";

const app = express();
const port = process.env.PORT;
dotenv.config();

// Connect to MongoDB
connectToDatabase().catch(console.error);

/// Implementations
///
const userRepository = new UserRepositoryImpl();
const authenticationRepository = new AuthenticationRepositoryImpl();

/// Usecases
///
const getAllUsersUsecase = new GetUsersUsecase(userRepository);
const createUserUsecase = new CreateUserUsecase(userRepository);
const loginUserUsecase = new LoginUserUsecase(authenticationRepository);

/// Controllers
///
const userController = new UserController(
  createUserUsecase,
  getAllUsersUsecase
);
const loginController = new LoginController(loginUserUsecase);

// Middleware
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Connectly");
});
app.post("/login", (req, res) => loginController.create(req, res));
app.post("/createuser", (req, res) => userController.create(req, res));
app.get("/getUsers", (req, res) => userController.getUsers(req, res));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(process.env.ACCESS_TOKEN_SECRET);
});
