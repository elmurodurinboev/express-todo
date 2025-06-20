const express = require("express")
const router = express.Router();
const { getTodos, createTodo, getById, updateTodo, deleteTodo } = require("../controllers/todo.controller")
const { body, param } = require("express-validator")
const validationResult = require("../middlewares/validation.middleware")

router.get("/", getTodos)
router.post(
    "/",
    [
        body("name").notEmpty().withMessage("name to'ldirilishi shart"),
        validationResult
    ],
    createTodo
)
router.get(
    "/:id",
    [
        param("id").notEmpty().isNumeric().withMessage("param mavjud va raqam bo'lishi shart"),
        validationResult
    ],
    getById
)
router.put(
    "/:id",
    [
        param("id").notEmpty().isNumeric().withMessage("param mavjud va raqam bo'lishi shart"),
        body("name").notEmpty().withMessage("name to'ldirilishi shart"),
        validationResult
    ],
    updateTodo
)
router.delete(
    "/:id",
    [
        param("id").notEmpty().isNumeric().withMessage("param mavjud va raqam bo'lishi shart"),
        validationResult
    ],
    deleteTodo
)


module.exports = router