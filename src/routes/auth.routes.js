const express = require("express");
const router = express.Router();
const { login, register, getme, refreshToken, logout } = require("../controllers/auth.controller")
const { body } = require("express-validator")
const authMiddleware = require("../middlewares/auth.middleware")
const validationResult = require("../middlewares/validation.middleware")

router.post(
    "/login",
    [
        body("email").notEmpty().isEmail().withMessage("Email xato"),
        body("password").notEmpty().isLength({ min: 1 }).withMessage("Parol kamida 1 ta belgidan iborat bo'lishi kerak"),
        validationResult
    ],
    login
)
router.post(
    "/register",
    [
        body("first_name").notEmpty().withMessage("first_name to'ldirilishi shart"),
        body("last_name").notEmpty().withMessage("last_name to'ldirilishi shart"),
        body("email").notEmpty().isEmail().withMessage("Email xato"),
        body("password").notEmpty().isLength({ min: 1 }).withMessage("Parol kamida 1 ta belgidan iborat bo'lishi kerak"),
        validationResult
    ],
    register
)

router.get("/me", authMiddleware, getme)
router.post(
    "/refresh",
    [
        body("refreshToken").notEmpty().withMessage("Refresh token yuborilmadi"),
        validationResult
    ],
    refreshToken
)

router.post(
    "/logout",
    [
        body("refreshToken").notEmpty().withMessage("Refresh token yuborilmadi"),
        validationResult
    ],
    logout
)

module.exports = router