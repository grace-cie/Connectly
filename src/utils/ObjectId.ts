import Joi from "joi";
import { ObjectId } from "mongodb";

// Custom Joi extension to validate ObjectId
const objectId = Joi.extend((joi) => ({
  type: "objectId",
  base: joi.string(),
  messages: {
    "objectId.base": '"{{#label}}" should be a valid ObjectId',
  },
  validate(value, helpers) {
    if (!ObjectId.isValid(value)) {
      return { value, errors: helpers.error("objectId.base") };
    }
    return { value };
  },
}));

export default objectId;
