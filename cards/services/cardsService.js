import { generateBizNumber } from "../helpers/generateBizNumber.js";
import { validateCard, validateCardUpdate } from "../validation/cardValidationService.js";
import {
    createCard,
    deleteCardInDb,
    getAllCardsByUserIdFromDb,
    getAllCardsFromDb,
    getCardByIdFromDb,
    updateCardInDb,
} from "./cardsDataService.js";

export const getAllCards = async () => {
    try {
        const cards = await getAllCardsFromDb();
        return cards;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getCardById = async (id) => {
    try {
        const card = await getCardByIdFromDb(id);
        return card;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const createNewCard = async (card, userId) => {
    try {
        card.bizNumber = await generateBizNumber();
        card.user_id = userId;

        const { error } = validateCard(card);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const newCard = await createCard(card);
        return newCard;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateCard = async (cardId, newCard, userId) => {
    try {
        const existingCard = await getCardByIdFromDb(cardId);

        if (existingCard.user_id.toString() !== userId.toString()) {
            throw new Error("Access denied - you can only edit your own cards");
        }

        const { error } = validateCardUpdate(newCard);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const modifiedCard = await updateCardInDb(cardId, newCard);
        return modifiedCard;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteCard = async (id) => {
    try {
        const idOfDeletedCard = await deleteCardInDb(id);
        return idOfDeletedCard;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getAllMyCards = async (userId) => {
    try {
        const cards = await getAllCardsByUserIdFromDb(userId);
        return cards;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const toggleLikeCard = async (cardId, userId) => {
    try {
        const card = await getCardByIdFromDb(cardId);

        const userLikedIndex = card.likes.indexOf(userId);

        if (userLikedIndex === -1) {
            card.likes.push(userId);
        } else {
            card.likes.splice(userLikedIndex, 1);
        }

        const updatedCard = await updateCardInDb(cardId, { likes: card.likes });
        return updatedCard;

    } catch (error) {
        throw new Error(error.message);
    }
};