import User from "./User.js";
import Recipe from "./Recipe.js";
import FavoritesContainer from "./FavoritesContainer.js";
import FavoritesRecipes from "./FavoritesRecipes.js";
import RatingReview from "./RatingReview.js";
import Follower from "./Follower.js";

// Define associations
export default function setupAssociations() {
  // User has many Recipes
  User.hasMany(Recipe, { foreignKey: "userId" });
  Recipe.belongsTo(User, { foreignKey: "userId" });

  // User has many FavoritesContainers
  User.hasMany(FavoritesContainer, { foreignKey: "userId", as: "containers" });
  FavoritesContainer.belongsTo(User, { foreignKey: "userId" });

  // FavoritesContainer has many FavoritesRecipes
  FavoritesContainer.hasMany(FavoritesRecipes, {
    foreignKey: "containerId",
    as: "recipes",
    onDelete: "CASCADE", // Enable cascading delete
  });
  FavoritesRecipes.belongsTo(FavoritesContainer, { foreignKey: "containerId" });

  // Recipe has many FavoritesRecipes
  Recipe.hasMany(FavoritesRecipes, { foreignKey: "recipeId", as: "favorites" });
  FavoritesRecipes.belongsTo(Recipe, { foreignKey: "recipeId" });

  // User has many RatingReviews
  User.hasMany(RatingReview, { foreignKey: "userId" });
  RatingReview.belongsTo(User, { foreignKey: "userId" });

  // Recipe has many RatingReviews
  Recipe.hasMany(RatingReview, { foreignKey: "recipeId" });
  RatingReview.belongsTo(Recipe, { foreignKey: "recipeId" });
  User.belongsToMany(User, {
    as: "Followers",
    through: Follower,
    foreignKey: "followingId", // The user being followed
    otherKey: "followerId", // The user who is following
  });
  
  User.belongsToMany(User, {
    as: "Following",
    through: Follower,
    foreignKey: "followerId", // The user who is following
    otherKey: "followingId", // The user being followed
  });
  
  // Set up alias for Follower model association with User
  Follower.belongsTo(User, { foreignKey: 'followerId', as: 'Subscriber' });
  Follower.belongsTo(User, { foreignKey: 'followingId', as: 'Following' });
  
}
