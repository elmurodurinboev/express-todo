const express = require("express")
const router = express.Router();
const { getTodos, createTodo, getById } = require("../controllers/todo.controller")


router.get("/", getTodos)
router.post("/", createTodo)
router.get("/:id", getById)


module.exports = router