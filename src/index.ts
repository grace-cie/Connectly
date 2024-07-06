/// [other imports]
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectToDatabase } from "./middleware/MongoDB";

/// [controller imports]
import { UserController } from "./interface/controller/UserController";
import { LoginController } from "./interface/controller/LoginController";
import { PostController } from "./interface/controller/PostController";

/// [usecases imports]
import { CreateUserUsecase } from "./usecase/CreateUser.usecase";
import { LoginUserUsecase } from "./usecase/LoginUser.usecase";

/// [repository implementation imports]
import { UserRepositoryImpl } from "./infrastructure/repository/UserRepositoryImpl";
import { AuthenticationRepositoryImpl } from "./infrastructure/repository/AuthenticationRepositoryImpl";
import { GetUsersUsecase } from "./usecase/GetUsers.usecase";
import { authenticateToken } from "./middleware/AuthenticateToken";
import { PostsRepositoryImpl } from "./infrastructure/repository/PostsRepositoryImpl";
import { CreatePostUsecase } from "./usecase/CreatePosts.usecase";
import { GetMyPostsUsecase } from "./usecase/GetMyPosts.usecase";

/// initaialize env's
dotenv.config();

const app = express();
const port = process.env.PORT;

// Connect to MongoDB
connectToDatabase().catch(console.error);

/// Implementations
///
const userRepository = new UserRepositoryImpl();
const authenticationRepository = new AuthenticationRepositoryImpl();
const postRepository = new PostsRepositoryImpl();

/// Usecases
///
const getAllUsersUsecase = new GetUsersUsecase(userRepository);
const createUserUsecase = new CreateUserUsecase(userRepository);
const loginUserUsecase = new LoginUserUsecase(authenticationRepository);
const createPostUsecase = new CreatePostUsecase(postRepository);
const getMyPostsUsecase = new GetMyPostsUsecase(postRepository);

/// Controllers
///
const userController = new UserController(
  createUserUsecase,
  getAllUsersUsecase
);
const loginController = new LoginController(loginUserUsecase);
const postController = new PostController(createPostUsecase, getMyPostsUsecase);

// Middleware
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Connectly");
});
app.post("/login", (req, res) => loginController.login(req, res));
app.post("/registerUser", (req, res) => userController.registerUser(req, res));
app.get("/getUsers", authenticateToken, (req, res) =>
  userController.getUsers(req, res)
);
app.post("/createpost", authenticateToken, (req, res) =>
  postController.createPost(req, res)
);
app.get("/myposts/:postedBy", authenticateToken, (req, res) =>
  postController.myPosts(req, res)
);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(process.env.ACCESS_TOKEN_SECRET);
});
