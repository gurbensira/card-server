import userRegistrationSchema, { userLoginSchema, userUpdateSchema } from "./userValidationSchema.js";

// Validate user registration
export const validateUserRegistration = (user) => {
    return userRegistrationSchema.validate(user);
};

// Validate user login
export const validateUserLogin = (credentials) => {
    return userLoginSchema.validate(credentials);
};

// Validate user update (partial)
export const validateUserUpdate = (user) => {
    return userUpdateSchema.validate(user);
};