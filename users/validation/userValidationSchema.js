import Joi from "joi";

const urlRegex =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

// Schema for user registration (all required fields match User model)
const userRegistrationSchema = Joi.object({
    name: Joi.object().keys({
        first: Joi.string().min(2).max(256).required(),
        middle: Joi.string().min(2).max(256).allow(""),
        last: Joi.string().min(2).max(256).required(),
    }).required(),
    email: Joi.string()
        .ruleset.pattern(
            /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        )
        .rule({ message: 'user "email" must be a valid email' })
        .required(),
    password: Joi.string()
        .min(6)
        .max(1024)
        .required()
        .messages({
            'string.min': 'password must be at least 6 characters long',
            'any.required': 'password is required'
        }),
    phone: Joi.string()
        .ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
        .rule({ message: 'user "phone" must be a valid phone number' })
        .required(),
    isBusiness: Joi.boolean(),
    isAdmin: Joi.boolean(),
    address: Joi.object().keys({
        state: Joi.string().max(256).allow(""),
        country: Joi.string().min(2).max(256),
        city: Joi.string().min(2).max(256),
        street: Joi.string().min(2).max(256),
        houseNumber: Joi.number(),
        zip: Joi.number(),
    }).required(),
    image: Joi.object()
        .keys({
            url: Joi.string()
                .ruleset.regex(urlRegex)
                .rule({ message: 'user.image "url" mast be a valid url' })
                .allow(""),
            alt: Joi.string().min(2).max(256).allow(""),
        })
        .required(),
});

// Schema for user login (only email and password required)
export const userLoginSchema = Joi.object({
    email: Joi.string()
        .ruleset.pattern(
            /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        )
        .rule({ message: 'user "email" must be a valid email' })
        .required(),
    password: Joi.string()
        .required()
        .messages({
            'any.required': 'password is required'
        }),
});

// Schema for user update (all fields optional, but validated if present)
export const userUpdateSchema = Joi.object({
    name: Joi.object().keys({
        first: Joi.string().min(2).max(256),
        middle: Joi.string().min(2).max(256).allow(""),
        last: Joi.string().min(2).max(256),
    }),
    email: Joi.string()
        .ruleset.pattern(
            /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        )
        .rule({ message: 'user "email" must be a valid email' }),
    password: Joi.string()
        .min(6)
        .max(1024)
        .messages({
            'string.min': 'password must be at least 6 characters long'
        }),
    phone: Joi.string()
        .ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
        .rule({ message: 'user "phone" must be a valid phone number' }),
    isBusiness: Joi.boolean(),
    isAdmin: Joi.boolean(),
    address: Joi.object().keys({
        state: Joi.string().max(256).allow(""),
        country: Joi.string().min(2).max(256),
        city: Joi.string().min(2).max(256),
        street: Joi.string().min(2).max(256),
        houseNumber: Joi.number(),
        zip: Joi.number(),
    }),
    image: Joi.object()
        .keys({
            url: Joi.string()
                .ruleset.regex(urlRegex)
                .rule({ message: 'user.image "url" must be a valid url' })
                .allow(""),
            alt: Joi.string().min(2).max(256).allow(""),
        })
    ,
}).min(1); // At least one field must be present

export default userRegistrationSchema;