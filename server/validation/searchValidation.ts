import Joi from "joi";

export const searchSchema = Joi.object({
  text: Joi.string().min(2).required(),
  lng: Joi.number(),
  lat: Joi.number(),
  maxDistance: Joi.number(),
});