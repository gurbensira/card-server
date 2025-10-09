import express from "express";
import { createNewCard, deleteCard, getAllCards, getAllMyCards, getCardById, toggleLikeCard, updateCard } from "../services/cardsService.js";
import { auth } from "../../auth/services/authService.js";
import { getCardByIdFromDb } from "../services/cardsDataService.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const allCards = await getAllCards();
        res.send(allCards);
    } catch (error) {
        console.error("Error getting all cards:", error);
        res.status(500).send(error.message);
    }
});

router.post("/", auth, async (req, res) => {
    try {
        const newCard = req.body;
        const user = req.user;

        if (!user.isBusiness) {
            return res.status(403).send("Only Business user can create cards");
        }

        const card = await createNewCard(newCard, user._id);
        res.status(201).send(card);
    } catch (error) {
        console.error("Error creating card:", error);
        res.status(400).send(error.message);
    }
});

router.get("/my-cards", auth, async (req, res) => {
    try {
        const user = req.user;
        const myCards = await getAllMyCards(user._id);
        res.send(myCards);
    } catch (error) {
        console.error("Error getting my cards:", error);
        res.status(400).send(error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const card = await getCardById(id);
        res.send(card);
    } catch (error) {
        console.error("Error getting card:", error);

        if (error.message === "Card not found") {
            return res.status(404).send(error.message);
        }
        if (error.message === "Invalid card ID format") {
            return res.status(400).send(error.message);
        }

        res.status(500).send(error.message);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const card = await getCardByIdFromDb(id);
        if (!user.isAdmin && card.user_id.toString() !== user._id) {
            return res.status(403).send("Only Admin user or owner of card can delete it");
        }

        const idOfDeletedCard = await deleteCard(id);
        res.send("Card deleted successfully");
    } catch (error) {
        console.error("Error deleting card:", error);

        if (error.message === "Card not found") {
            return res.status(404).send(error.message);
        }
        if (error.message === "Invalid card ID format") {
            return res.status(400).send(error.message);
        }

        res.status(500).send(error.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const newCard = req.body;

        const modifiedCard = await updateCard(id, newCard, user._id);
        res.send(modifiedCard);
    } catch (error) {
        console.error("Error updating card:", error);

        if (error.message === "Card not found") {
            return res.status(404).send(error.message);
        }
        if (error.message === "Invalid card ID format") {
            return res.status(400).send(error.message);
        }
        if (error.message.includes("Access denied")) {
            return res.status(403).send(error.message);
        }

        res.status(400).send(error.message);
    }
});

router.patch("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const updatedCard = await toggleLikeCard(id, user._id);
        res.send(updatedCard);
    } catch (error) {
        console.error("Error toggling like:", error);

        if (error.message === "Card not found") {
            return res.status(404).send(error.message);
        }
        if (error.message === "Invalid card ID format") {
            return res.status(400).send(error.message);
        }

        res.status(500).send(error.message);
    }
});

export default router;