import { Joi } from "express-validation";

const logInUserSchema = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email(),
  }),
};

export default logInUserSchema;
