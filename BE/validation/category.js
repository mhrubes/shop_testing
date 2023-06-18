const Joi = require('joi');

const categoryValidationCreateSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().min(2).max(20).required(),
    active: Joi.boolean().required(),
});

const categoryValidationUpdateSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string().min(2).max(20).required(),
    active: Joi.boolean().required(),
});

const categoryValidationDeleteSchema = Joi.object({
    _id: Joi.string().required(),
});

module.exports = {
    categoryValidationCreateSchema,
    categoryValidationUpdateSchema,
    categoryValidationDeleteSchema
};