var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Recipe.findAll({}).then(function(dbRecipes) {
      res.render("index", {
        msg: "What's Cookin'!",
        recipes: dbRecipes
      });
    });
  });

  app.get("/shoppinglist", function(req, res) {
    db.Ingredient.findAll({
      where: { onList: true }
    }).then(function(ingredientsList) {
      res.render("shoppinglist", {
        shoppingList: ingredientsList
      });
    });
  });
  // // Load example page and pass in an example by id
  // app.get("/recipe/:id", function(req, res) {
  //   db.Recipe.findOne({ where: { id: req.params.id } }).then(function(
  //     dbRecipe
  //   ) {
  //     res.render("recipe", {
  //       recipe: dbRecipe
  //     });
  //   });
  // });

  // Load example page and pass in an example by id
  app.get("/recipe/:id", function(req, res) {
    db.Recipe.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: db.Ingredient,
          through: {
            attributes: ["RecipeId", "IngredientId", "ingredient"]
          }
        }
      ]
    }).then(
      function(dbRecipe) {
        res.render("recipe", {
          recipe: dbRecipe
        });
      },
      function(err) {
        console.log(err);
      }
    );
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
