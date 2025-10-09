import Joi from "joi";

const urlRegex =
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;


const cardSchema = Joi.object({
    title: Joi.string().min(2).max(256).required(),
    subtitle: Joi.string().min(2).max(256).required(),
    description: Joi.string().min(2).max(1024).required(),
    phone: Joi.string()
        .ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
        .rule({ message: 'card "phone" must be a valid phone number' })
        .required(),
    email: Joi.string()
        .ruleset.pattern(
            /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        )
        .rule({ message: 'card "email" must be a valid email' })
        .required(),
    web: Joi.string()
        .ruleset.regex(urlRegex)
        .rule({ message: 'card "web" must be a valid url' })
        .allow(""),
    image: Joi.object()
        .keys({
            url: Joi.string()
                .ruleset.regex(urlRegex)
                .rule({ message: 'card.image "url" must be a valid url' })
                .allow(""),
            alt: Joi.string().min(2).max(256).allow(""),
        })
        .required(),
    address: Joi.object()
        .keys({
            state: Joi.string().allow(""),
            country: Joi.string().min(2).max(256).required(),
            city: Joi.string().min(2).max(256).required(),
            street: Joi.string().min(2).max(256).required(),
            houseNumber: Joi.number().required(),
            zip: Joi.number(),
        })
        .required(),
    bizNumber: Joi.number().allow(""),
    user_id: Joi.string().allow(""),
});

export const cardUpdateSchema = Joi.object({
    title: Joi.string().min(2).max(256),
    subtitle: Joi.string().min(2).max(256),
    description: Joi.string().min(2).max(1024),
    phone: Joi.string()
        .ruleset.regex(/0[0-9]{1,2}\-?\s?[0-9]{3}\s?[0-9]{4}/)
        .rule({ message: 'card "phone" must be a valid phone number' }),
    email: Joi.string()
        .ruleset.pattern(
            /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/
        )
        .rule({ message: 'card "email" must be a valid email' }),
    web: Joi.string()
        .ruleset.regex(urlRegex)
        .rule({ message: 'card "web" must be a valid url' })
        .allow(""),
    image: Joi.object().keys({
        url: Joi.string()
            .ruleset.regex(urlRegex)
            .rule({ message: 'card.image "url" must be a valid url' })
            .allow(""),
        alt: Joi.string().min(2).max(256).allow(""),
    }),
    address: Joi.object().keys({
        state: Joi.string().allow(""),
        country: Joi.string().min(2).max(256),
        city: Joi.string().min(2).max(256),
        street: Joi.string().min(2).max(256),
        houseNumber: Joi.number(),
        zip: Joi.number(),
    }),
    bizNumber: Joi.number().allow(""),
    user_id: Joi.string().allow(""),
}).min(1);

export default cardSchema;