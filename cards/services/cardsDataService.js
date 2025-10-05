import Card from "../models/Card.js";

//get all
export const getAllCardsFromDb = async () => {
    try {
        const cards = await Card.find();
        return cards;
    } catch (error) {
        console.error("Mongo error:", error);
        if (
            error.name === "MongoNetworkError" ||
            error.message.includes("ECONNREFUSED")
        ) {
            throw new Error("Database connection error");
        }
        throw new Error("MongoDb - Error in fetching cards");
    }
};

//get one by id
export const getCardByIdFromDb = async (id) => {
    try {
        const card = await Card.findById(id);
        if (!card) {
            throw new Error("Card not found");
        }
        return card;

    } catch (error) {
        console.error("Mongo error:", error);
        if (error.name === "CastError") {
            throw new Error("Invalid card ID format");
        }
        if (
            error.name === "MongoNetworkError" ||
            error.message.includes("ECONNREFUSED")
        ) {
            throw new Error("Database connection error");
        }
        if (error.message === "Card not found") {
            throw error;
        }
        throw new Error("MongoDb - Error in fetching card");
    }
};

//create
export const createCard = async (card) => {
    try {
        const cardForDb = new Card(card);
        await cardForDb.save();
        return cardForDb;

    } catch (error) {
        console.error("Mongo error:", error);
        if (error.code === 11000 && error.keyPattern?.bizNumber) {
            throw new Error("Business number already exists");
        }
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            throw new Error(`Validation failed: ${messages.join(", ")}`);
        }
        if (
            error.name === "MongoNetworkError" ||
            error.message.includes("ECONNREFUSED")
        ) {
            throw new Error("Database connection error");
        }
        throw new Error("MongoDb - Error in creating new card");
    }
};

//update -> gets id and new card and return new card
export const updateCardInDb = async (id, newCard) => {
    try {
        const cardAfterUpdate = await Card.findByIdAndUpdate(id, newCard, {
            new: true,
            runValidators: true, // וידוא שהנתונים החדשים עוברים ולידציה
        });
        if (!cardAfterUpdate) {
            throw new Error("Card not found");
        }
        return cardAfterUpdate;

    } catch (error) {
        console.error("Mongo error:", error);
        if (error.name === "CastError") {
            throw new Error("Invalid card ID format");
        }
        if (error.code === 11000 && error.keyPattern?.bizNumber) {
            throw new Error("Business number already exists");
        }
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            throw new Error(`Validation failed: ${messages.join(", ")}`);
        }
        if (
            error.name === "MongoNetworkError" ||
            error.message.includes("ECONNREFUSED")
        ) {
            throw new Error("Database connection error");
        }
        if (error.message === "Card not found") {
            throw error;
        }
        throw new Error("MongoDb - Error in updating card");
    }
};

//delete -> gets id and return id
export const deleteCardInDb = async (id) => {
    try {
        const deletedCard = await Card.findByIdAndDelete(id);
        if (!deletedCard) {
            throw new Error("Card not found");
        }
        return id;

    } catch (error) {
        console.error("Mongo error:", error);
        if (error.name === "CastError") {
            throw new Error("Invalid card ID format");
        }
        if (
            error.name === "MongoNetworkError" ||
            error.message.includes("ECONNREFUSED")
        ) {
            throw new Error("Database connection error");
        }
        if (error.message === "Card not found") {
            throw error;
        }
        throw new Error("MongoDb - Error in deleting card");
    }
};

//get card by biz number
export const getCardByBizNumber = async (bizNumber) => {
    try {
        const card = await Card.findOne({ bizNumber });
        return card;

    } catch (error) {
        console.error("Mongo error:", error);
        if (
            error.name === "MongoNetworkError" ||
            error.message.includes("ECONNREFUSED")
        ) {
            throw new Error("Database connection error");
        }
        throw new Error("MongoDb - Error in fetching card by business number");
    }
};

//get all cards by user id
export const getAllCardsByUserIdFromDb = async (userId) => {
    try {
        const cards = await Card.find({ user_id: userId });
        return cards;

    } catch (error) {
        console.error("Mongo error:", error);
        if (error.name === "CastError") {
            throw new Error("Invalid user ID format");
        }
        if (
            error.name === "MongoNetworkError" ||
            error.message.includes("ECONNREFUSED")
        ) {
            throw new Error("Database connection error");
        }
        throw new Error("MongoDb - Error in fetching user cards");
    }
};