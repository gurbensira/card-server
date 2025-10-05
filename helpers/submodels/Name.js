import { Schema } from "mongoose";
import { DEFAULT_VALIDATION } from "../mongooseValidators.js";

export const Name = new Schema({
    first: DEFAULT_VALIDATION,
    middle: {
        ...DEFAULT_VALIDATION,
        required: false,
    },
    last: DEFAULT_VALIDATION,
});




