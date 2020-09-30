const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const pattern = new RegExp(config.get("domain"), "gi");

const ownerSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      minlength: 4,
      maxlength: 50,
      required: true,
      validate: {
        validator: function(v) {
          return new Promise(function(resolve, reject) {
            Owner.find({ userName: v }).then(res => {
              return res[0] ? resolve(false) : resolve(true);
            });
          });
        },

        message: "This username belongs to another account"
      }
    },
    name: { type: String, minlength: 2, maxlength: 50, required: true },
    category: {
      _id: String,
      name_eng: String,
      name_fa: String
    },
    phoneNumber: {
      type: String,
      minlength: 7,
      maxlength: 511,
      required: true,
      validate: {
        validator: function(v) {
          return new Promise(function(resolve, reject) {
            Owner.find({ phoneNumber: v }).then(res => {
              return res[0] ? resolve(false) : resolve(true);
            });
          });
        },
        message: "This PhoneNumber belongs to another account"
      }
    },
    // password: { type: String, minlength: 5, maxlength: 1023, required: true },
    ostan: { type: String, enum: ["GILAN"] },
    city: String,
    district: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"]
      },
      coordinates: {
        type: [Number]
      }
    },
    avatarSmall: {
      type: String,
      set: url => {
        if (url == config.get("default-avatar")) return url;
        return url.replace(pattern, "");
      },
      get: path => {
        if (path == config.get("default-avatar")) return path;
        return `${config.get("domain")}${path}`;
      }
    },
    avatarLarge: {
      type: String,
      set: url => {
        if (url == config.get("default-avatar")) return url;
        return url.replace(pattern, "");
      },
      get: path => {
        if (path == config.get("default-avatar")) return path;
        return `${config.get("domain")}${path}`;
      }
    },
    ownerRole: { type: String, enum: ["GUEST", "PARTNER", "ADMIN"] },
    biography: String,
    Rate: Number,
    lastLogin: { type: Date, default: Date.now },
    linksOut: {},
    canRateFor: [String],
    transactions: [String],
    activeDiscounts: { type: Number, default: 0 },
    activeDiscounts: { type: Array, items: mongoose.Types.ObjectId },
    buys: [String],
    savedOrders: []
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true
  }
);

ownerSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      avatarSm: this.avatarSmall,
      userName: this.userName
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Owner = mongoose.model("Owner", ownerSchema);
function validateNewOwner(newOwner) {
  const schema = {
    userName: Joi.string().required(),
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    phoneNumber: Joi.string()
      .min(7)
      .max(13)
      .required(),
    district: Joi.string().required(),
    biography: Joi.string(),
    linksOut: Joi.array(),
    avatarImage: Joi.string(),
    address: Joi.string().required(),
    category: Joi.object()
  };

  return Joi.validate(newOwner, schema);
}

const Expect = {
  userName: "string().required()",
  name: "string().min(3).max(50).required()",
  phoneNumber: "string().min(7).max(13).required()",
  district: "string().required()",
  biography: "string()",
  linksOut: "array()",
  avatarImage: "string()",
  address: "string()",
  category: "string()"
};

exports.Owner = Owner;
exports.validateNewOwner = validateNewOwner;
