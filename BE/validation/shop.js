const Joi = require('joi');

const productValidationCreateSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(0).max(1000),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required(),
    category: Joi.string().min(3).max(20).required(),
    __v: Joi.number().min(0).required(),
});

const productValidationUpdateSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(0).max(1000),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).required(),
    category: Joi.string().min(3).max(20).required(),
    __v: Joi.number().min(0).required(),
});

const productValidationDeleteSchema = Joi.object({
    _id: Joi.string().required(),
});

module.exports = {
    productValidationCreateSchema,
    productValidationUpdateSchema,
    productValidationDeleteSchema
};