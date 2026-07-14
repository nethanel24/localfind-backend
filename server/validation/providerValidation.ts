import Joi from "joi";

const locationSchema = Joi.object({
  type: Joi.string().valid("Point").required(),
  coordinates: Joi.array().items(Joi.number()).length(2).required(),
});

export const createProviderSchema = Joi.object({
  category: Joi.string().required(),
  description: Joi.string().min(10).max(1000).required(),
  price: Joi.number().min(0).required(),
  city: Joi.string().required(),
  location: locationSchema.required(),
  openness: Joi.number().min(0).max(100),
});

export const updateProviderSchema = Joi.object({
  category: Joi.string(),
  description: Joi.string().min(10).max(1000),
  price: Joi.number().min(0),
  city: Joi.string(),
  location: locationSchema,
  openness: Joi.number().min(0).max(100),
  isActive: Joi.boolean(),
});

export const detectCategorySchema = Joi.object({
  text: Joi.string().min(10).max(1000).required(),
});