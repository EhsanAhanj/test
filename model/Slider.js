const mongoose = require("mongoose");
const config = require("config");
const pattern = new RegExp(config.get("domain") + "/uploads", "gi");
const Joi = require("@hapi/joi");

const sliderSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      set: function(v) {
        return v.replace(pattern, "");
      },
      get: function(el) {
        return `${config.get("domain")}${el}`;
      }
    },
    category: { type: String, required: true },
    refId: { type: String, required: true },
    percent: { type: String, required: true },
    title: { type: String, required: true }
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true
  }
);
const Slider = mongoose.model("Slider", sliderSchema);
function validateNewSlider(newSlider) {
  const schema = {
    path: Joi.string().required(),
    category: Joi.string().required(),
    refId: Joi.string().required(),
    percent: Joi.string().required(),
    title: Joi.string().required()
  };

  return Joi.validate(newSlider, schema);
}
exports.validateNewSlider = validateNewSlider;
exports.Slider = Slider;
