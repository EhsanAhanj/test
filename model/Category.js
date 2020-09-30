const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const categorySchema = new mongoose.Schema({
  name_eng: { type: String, required: true },
  name_fa: { type: String, required: true }
});
const Category = mongoose.model("Category", categorySchema);
function validateNewCategory(newCategory) {
  const schema = {
    name_eng: Joi.string().required(),
    name_fa: Joi.string().required()
  };

  return Joi.validate(newCategory, schema);
}
exports.validateNewCategory = validateNewCategory;
exports.categorySchema = categorySchema;
exports.Category = Category;
