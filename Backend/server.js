import "dotenv/config";
import express from "express";
import sequelize from "./config/database.js";
import cors from "cors";

import authRouters from "./routers/authRouters.js"
import recipeRoutes from "./routers/recipeRoutes.js"
import favoritesContainerRoutes from "./routers/favoritesContainerRoutes.js"
import favoritesRecipesRoutes from './routers/favoritesRecipesRoutes.js';
import ratingReviewRoutes from './routers/ratingReviewRoutes.js';
import followerRouters from './routers/followerRouters.js';

// associations
import setupAssociations from "./models/associations.js"


const app = express();

app.use(
  cors({
    origin: process.env.SITE_URL,
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/auth", authRouters);
app.use("/recipes", recipeRoutes);
app.use('/favorites/containers', favoritesContainerRoutes);
app.use('/favorites/recipes', favoritesRecipesRoutes);
app.use('/rating-review', ratingReviewRoutes);
app.use("/followers", followerRouters)

// Database Sync
async function initializeDatabase() {
  console.log("Database connection has been established successfully.");
  await sequelize.sync({ force: false });
//   await sequelize.sync({ force: true });
}

setupAssociations()
initializeDatabase();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
