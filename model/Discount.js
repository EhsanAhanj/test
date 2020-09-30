const mongoose = require("mongoose");
const categorySchema = require("./Category");
const config = require("config");
const pattern = new RegExp(config.get("domain"), "gi");
const Joi = require("@hapi/joi");
const isUrl = require("is-url");
const { Category } = require("./Category");
const { Owner } = require("./Owner");
const discountSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      _id: {
        type: mongoose.Types.ObjectId,
        validate: {
          validator: function (cat) {
            return new Promise(function (resolve, reject) {
              Category.findById(cat).then((res) => {
                return res ? resolve(true) : resolve(false);
              });
            });
          },
          message: "No Catrgory with this id exist",
        },
      },
      name_eng: String,
      name_fa: String,
    },
    isVerified: { type: Boolean, default: false },
    isWithMoaref: { type: Boolean },
    isExpired: { type: Boolean, default: false },
    timeLeft: Number,
    realPrice: {
      type: Number,
      required: true,
    },
    newPrice: {
      type: Number,
      required: true,
    },
    discountPercent: {
      type: Number,
      default: 1,
      get: function (v) {
        return Math.ceil(100 - (this.newPrice * 100) / this.realPrice);
      },
      validate: {
        validator: function (v) {
          return this.realPrice > this.newPrice;
        },
        message: "not validate realprice and newprice please reviwe",
      },
    },
    images: {
      type: Array,
      get: function (arr) {
        let data = [];
        if (arr && arr.length) {
          for (el of arr) {
            let url = `${config.get("domain")}${el}`;
            data.push(url);
          }
        }
        return data;
      },
      set: function (images) {
        let data = [];
        if (images && images.length) {
          for (el of images) {
            data.push(el.replace(pattern, ""));
          }
        }
        return data;
      },
      validate: {
        validator: function (v) {
          return v && v.length;
        },
        message: "A discount should have at least one picture ",
      },
    },
    createDate: { type: Date, default: Date.now },
    expireDate: {
      type: String,
      set: function (v) {
        return v;
      },
    },
    capacity: Number,
    selledCount: Number,
    selledTo: [Object],
    rating: {
      ratingNumber: Number,
      ratingBy: [Object],
      rateAvrage: Number,
    },
    comment: {
      commentNumber: Number,
      comments: [Object],
    },
    description: {
      feature: {
        type: Array,
        validate: {
          validator: function (v) {
            return v && v.length;
          },
          message:
            "A discount should have at least one feature on path description.feature[] ",
        },
      },
      address: { type: String, required: true },
      userManual: [String],
      text: { type: String, required: true },
    },
    owner: {
      _id: {
        type: mongoose.Types.ObjectId,
        validate: {
          validator: function (ownerid) {
            return new Promise(function (resolve, reject) {
              Owner.findById(ownerid).then((res) => {
                return res ? resolve(true) : resolve(false);
              });
            });
          },
          message: "No owner with this id exist",
        },
      },
      avatarUrl: { type: String, required: true },
      username: { type: String, required: true },
    },
    geoLocatin: {
      type: String,
      enum: ["Point"],
      // required: true
      coordinates: {
        type: [Number],
        //  required: true
      },
    },

    viewNumber: Number,
    //--------------------------------------------------thumbnail----------------------------
    thumbnail: {
      category: {
        type: String,
        get: function () {
          return this.category.name_eng;
        },
      },
      //---------first image for cart --------------
      image: {
        type: String,
        get: function () {
          if (this.images && this.images.length) {
            return this.images[0];
          }
          return [];
        },
      },
      title: {
        type: String,
        get: function () {
          return this.title;
        },
      },
      //------------------------ get first feature for cart -----------------------------
      description: {
        type: String,
        get: function () {
          return this.description.text;

          return "";
        },
      },
      timeLeft: {
        type: String,
        get: function () {
          /*

          --
          --
          --
          send milisecend to client by time left milli secends
          --
          --
          --
          */
          return this.timeLeft;
        },
      },
      owner: {
        type: String,
        get: function () {
          return this.owner.username;
        },
      },
      realPrice: {
        type: Number,
        get: function () {
          return this.realPrice;
        },
      },
      newPrice: {
        type: Number,
        get: function () {
          return this.newPrice;
        },
      },
      district: {
        type: String,
        get: function () {
          return this.description.address;
        },
      },
    },
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

const Discount = mongoose.model("Discount", discountSchema);
function validateNewDiscount(newDiscount) {
  const schema = {
    title: Joi.string().required(),
    category: Joi.object().required(),
    realPrice: Joi.number().required(),
    newPrice: Joi.number().required(),
    images: Joi.array().required(),
    owner: Joi.object().required(),
    description: Joi.object().required(),
    expireDate: Joi.string().required(),
  };

  return Joi.validate(newDiscount, schema);
}
const expect = {
  title: "string",
  category: { _id: "string", name_eng: "string", name_fa: "string" },
  realPrice: "number",
  newPrice: "number",
  images: '["validUrl"]',
  owner: { id: "string" },
  description: {
    feature: '["strings"]',
    address: "string",
    userManual: '["strings"]',
    text: "STRING",
  },
  expireDate: "String",
};
exports.expect = expect;
exports.validateNewDiscount = validateNewDiscount;
exports.Discount = Discount;
