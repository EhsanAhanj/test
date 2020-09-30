const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const config = require("config");
const pattern = new RegExp(config.get("domain"), "gi");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    minlength: 4,
    maxlength: 50,
    required: true,
    validate: {
      validator: function(v) {
        return new Promise(function(resolve, reject) {
          User.find({ userName: v }).then(res => {
            return res[0] ? resolve(false) : resolve(true);
          });
        });
      },

      message: "This username belongs to another account"
    }
  },
  name: { type: String, minlength: 2, maxlength: 50 },
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
      message: "With this PhoneNumber make an acount before recover that"
    },
    address: [String],
    location: {
      type: {
        type: String,
        enum: ["Point"]
      },
      coordinates: {
        type: [Number]
      }
    },
    createDate: { type: Date, default: Date.now },
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
    lastLogin: { type: Date, default: Date.now },
    notificationToken: String,
    cart: [Object],
    orders: [Object],
    fav: [String],
    saved: [String]
  }
});
const User = mongoose.model("User", userSchema);
function validateNewUser(newUser) {
  const schema = {
    imei: Joi.string().required(),
    phoneNumber: Joi.string(),
    name: Joi.string(),
    avatarSmall: Joi.string(),
    avatarSmall: Joi.string(),
    userName: Joi.string(),
    location: Joi.object()
  };

  return Joi.validate(newUser, schema);
}

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      avatarSm: this.avatarSmall
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

exports.validateNewUser = validateNewUser;
exports.userSchema = userSchema;
exports.User = User;
