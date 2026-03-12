const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { body } = require("express-validator");

const {
    createNote,
    getNotes,
    updateNote,
    deleteNote
} = require("../controllers/notesController");

router.post(
    "/notes",
    authMiddleware,
    [
        body("title").notEmpty().withMessage("Title is required"),
        body("content").optional().isLength({ max: 1000 })
    ],
    createNote
);

router.get("/notes", authMiddleware, getNotes);
router.put("/notes/:id", authMiddleware, updateNote);
router.delete("/notes/:id", authMiddleware, deleteNote);

module.exports = router;