import _ from "lodash";
import { generateToken } from "../../auth/providers/jwtProvider.js";
import { comparePassword, generatePassword } from "../helpers/bcrypt.js";
import { createUser, deleteUserInDb, getAllUsersFromDb, getUserByEmail, getUserByIdFromDb, updateUserInDb } from "./usersDataService.js";
import Card from "../../cards/models/Card.js";
import { validateUserLogin, validateUserRegistration, validateUserUpdate } from "../validation/userValidationService.js";

export const createNewUser = async (user) => {
    try {
        const { error } = validateUserRegistration(user);
        if (error) {
            throw new Error(error.details[0].message);
        }

        let hashPass = generatePassword(user.password);
        user.password = hashPass;
        const newUser = await createUser(user);
        const DTOuser = _.pick(newUser, ["email", "name", "_id"]);
        return DTOuser;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const login = async (email, password) => {
    try {
        const { error } = validateUserLogin({ email, password });
        if (error) {
            throw new Error(error.details[0].message);
        }

        const user = await getUserByEmail(email);
        if (!user) {
            throw new Error("Email is incorrect");
        }

        if (!comparePassword(password, user.password)) {
            throw new Error("Password is incorrect");
        }

        return generateToken(user);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getAllUsers = async () => {
    try {
        const users = await getAllUsersFromDb();
        return users;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getUserById = async (id, loggedInUser) => {
    try {
        const user = await getUserByIdFromDb(id);

        // Check authorization
        if (!loggedInUser.isAdmin && loggedInUser._id.toString() !== id) {
            throw new Error("Access denied");
        }

        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateUser = async (id, newUser, userId) => {
    try {
        const existingUser = await getUserByIdFromDb(id);

        // Check authorization
        if (existingUser._id.toString() !== userId.toString()) {
            throw new Error("Access denied - you can only edit your own user");
        }

        // Validate update data
        const { error } = validateUserUpdate(newUser);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // If password is being updated, hash it
        if (newUser.password) {
            newUser.password = generatePassword(newUser.password);
        }

        const modifiedUser = await updateUserInDb(userId, newUser);
        return modifiedUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const changeIsBusiness = async (id, userId) => {
    try {
        const existingUser = await getUserByIdFromDb(id);

        if (existingUser._id.toString() !== userId.toString()) {
            throw new Error("Access denied - you can only edit your own user");
        }

        const modifiedUser = await updateUserInDb(userId, {
            isBusiness: !existingUser.isBusiness
        });

        return modifiedUser;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteUser = async (id) => {
    try {
        const userToDelete = await getUserByIdFromDb(id);
        await Card.deleteMany({ user_id: id });
        const deletedUserId = await deleteUserInDb(id);
        return {
            id: deletedUserId,
            name: userToDelete.name
        };
    } catch (error) {
        throw new Error(error.message);
    }
};





