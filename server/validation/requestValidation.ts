import Joi from "joi";

export const createRequestSchema = Joi.object({
  provider: Joi.string().required(),
  text: Joi.string().min(2).required(),
});

export const updateRequestStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "handled").required(),
});