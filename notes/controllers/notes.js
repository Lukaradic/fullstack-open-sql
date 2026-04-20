const express = require("express");
const { Note } = require("../models/index");
const { noteFinder } = require("../middleware/notes");
const router = express.Router();

router.get("/", async (_, res) => {
  const notes = await Note.findAll();
  res.json(notes);
});

router.post("/", async (req, res) => {
  try {
    const newNote = await Note.create({ ...req.body, date: new Date() });
    res.json(newNote);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.get("/:id", noteFinder, async (req, res) => {
  res.status(200).json(req.note);
});

router.delete("/:id", noteFinder, async (req, res) => {
  try {
    await req.note.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err }).end();
  }
});

router.put("/:id", noteFinder, async (req, res) => {
  try {
    await req.note.save();
    res.status(200).json(req.note);
  } catch (err) {
    res.status(400).json({ error: err }).end();
  }
});

module.exports = router;
