const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/auth.controller")
const { body } = require("express-validator")

router.post(
    "/login",
    [
        body("email").notEmpty().isEmail().withMessage("Email xato"),
        body("password").notEmpty().isLength({ min: 1 }).withMessage("Parol kamida 1 ta belgidan iborat bo'lishi kerak")
    ],
    login
)
router.post(
    "/register",
    [
        body("first_name").notEmpty().withMessage("first_name to'ldirilishi shart"),
        body("last_name").notEmpty().withMessage("last_name to'ldirilishi shart"),
        body("email").notEmpty().isEmail().withMessage("Email xato"),
        body("password").notEmpty().isLength({ min: 1 }).withMessage("Parol kamida 1 ta belgidan iborat bo'lishi kerak")
    ],
    register
)

module.exports = router