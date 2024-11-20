const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

require("dotenv").config();

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.mongo_uri)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
});

const Book = mongoose.model("Book", bookSchema);

// Routes
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/books", async (req, res) => {
  const { title, author, description } = req.body;
  if (!title || !author || !description)
    return res.status(400).json({ error: "All fields are required" });

  const book = new Book({ title, author, description });
  await book.save();
  res.status(201).json(book);
});

app.put("/books/:id", async (req, res) => {
  const { title, author, description } = req.body;

  if (!title || !author || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
