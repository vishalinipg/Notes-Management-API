const { validationResult } = require("express-validator");
const db = require("../models/db");

// Create Note
exports.createNote = (req, res) => {

    const errors = validationResult(req);   
    if (!errors.isEmpty()) {                
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    const userId = req.user.id;

    const query = `
        INSERT INTO notes (title, content, user_id)
        VALUES (?, ?, ?)
    `;

    db.run(query, [title, content, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            message: "Note created",
            noteId: this.lastID
        });
    });
};

// Get All Notes
exports.getNotes = (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    let query;

    if (role === "admin") {
        query = "SELECT * FROM notes";
    } else {
        query = "SELECT * FROM notes WHERE user_id = ?";
    }

    db.all(query, role === "admin" ? [] : [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json(rows);
    });
};

// Update Note
exports.updateNote = (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;
    const noteId = req.params.id;

    const query = `
        UPDATE notes
        SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND user_id = ?
    `;

    db.run(query, [title, content, noteId, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.json({ message: "Note updated successfully" });
    });
};

// Delete Note

exports.deleteNote = (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;
    const noteId = req.params.id;

    let query;

    if (role === "admin") {
        query = "DELETE FROM notes WHERE id = ?";
    } else {
        query = "DELETE FROM notes WHERE id = ? AND user_id = ?";
    }

    db.run(query, role === "admin" ? [noteId] : [noteId, userId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.json({ message: "Note deleted successfully" });
    });
};