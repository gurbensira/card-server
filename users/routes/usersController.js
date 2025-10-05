import express from "express";
import { changeIsBusiness, createNewUser, deleteUser, getAllUsers, getUserById, login, updateUser } from "../services/usersService.js";
import { auth } from "../../auth/services/authService.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newUser = req.body;
        const user = await createNewUser(newUser);
        res.status(201).send(user);
    } catch (error) {
        console.error(error)
        res.status(400).send(error.message);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { password, email } = req.body;
        const token = await login(email, password);
        res.send(token);
    } catch (error) {
        console.error(error)
        res.status(401).send(error.message);
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const user = req.user;

        // Only admin can get all users
        if (!user.isAdmin) {
            return res.status(403).send("Admin access required");
        }

        const allUsers = await getAllUsers();
        res.send(allUsers);
    } catch (error) {
        console.error("Error getting all users:", error);
        res.status(500).send(error.message);
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id, req.user);
        res.send(user);
    } catch (error) {
        console.error("Error getting user:", error);

        if (error.message === "User not found") {
            return res.status(404).send(error.message);
        }
        if (error.message === "Invalid user ID format") {
            return res.status(400).send(error.message);
        }
        if (error.message.includes("Access denied")) {
            return res.status(403).send(error.message);
        }

        res.status(500).send(error.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const newUser = req.body;

        const modifiedUser = await updateUser(id, newUser, user._id);
        res.send(modifiedUser);
    } catch (error) {
        console.error("Error updating user:", error);

        if (error.message === "User not found") {
            return res.status(404).send(error.message);
        }
        if (error.message === "Invalid user ID format") {
            return res.status(400).send(error.message);
        }
        if (error.message.includes("Access denied")) {
            return res.status(403).send(error.message);
        }
        if (error.message.includes("Validation failed") || error.message.includes("Email already exists") || error.message.includes("must")) {
            return res.status(400).send(error.message);
        }

        res.status(500).send(error.message);
    }
});

router.patch("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const modifiedUser = await changeIsBusiness(id, user._id);
        res.send(modifiedUser);
    } catch (error) {
        console.error("Error changing isBusiness:", error);

        if (error.message === "User not found") {
            return res.status(404).send(error.message);
        }
        if (error.message === "Invalid user ID format") {
            return res.status(400).send(error.message);
        }
        if (error.message.includes("Access denied")) {
            return res.status(403).send(error.message);
        }

        res.status(500).send(error.message);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        // Authorization check
        if (!user.isAdmin && user._id !== id) {
            return res.status(403).send("Only admin or account owner can delete user");
        }

        const deletedUser = await deleteUser(id);
        res.send(`User ${deletedUser.name} deleted successfully`);
    } catch (error) {
        console.error("Error deleting user:", error);

        if (error.message === "User not found") {
            return res.status(404).send(error.message);
        }
        if (error.message === "Invalid user ID format") {
            return res.status(400).send(error.message);
        }

        res.status(500).send(error.message);
    }
});

export default router;




