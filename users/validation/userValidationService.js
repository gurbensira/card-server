import userRegistrationSchema, { userLoginSchema, userUpdateSchema } from "./userValidationSchema.js";

export const validateUserRegistration = (user) => {
    return userRegistrationSchema.validate(user);
};

export const validateUserLogin = (credentials) => {
    return userLoginSchema.validate(credentials);
};

export const validateUserUpdate = (user) => {
    return userUpdateSchema.validate(user);
};