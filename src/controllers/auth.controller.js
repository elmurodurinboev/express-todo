const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { validationResult } = require("express-validator")
const TokenService = require("../services/token.service")

const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const isEmailExist = await prisma.user.findUnique({ where: { email } })
        if (isEmailExist) res.status(400).json({ success: false, message: "Bu email allaqachon ro'yhatdan o'tgan" })
        const data = await prisma.user.create({
            data: { first_name, last_name, email, password: hashedPassword }
        })
        res.status(200).json({ success: true, data })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (!existingUser) {
            return res.status(400).json({ success: false, message: "Bunday ma'lumotli user topilmadi" })
        }
        const passwordIsMatch = await bcrypt.compare(password, existingUser.password)
        if (!passwordIsMatch) {
            return res.status(400).json({ success: false, message: "Parol xato kiritildi" })
        }
        const tokens = TokenService.generateToken(existingUser.id, existingUser.role)
        const ip = req.ip
        const userAgent = req.get("User-Agent")
        TokenService.saveToken(tokens.refreshToken, existingUser.id, userAgent, ip).catch(err => { next(err) })
        res.status(200).json(tokens)
    } catch (error) {
        next(error)
    }
}

const getme = async (req, res, next) => {
    try {
        const { userId } = req.user
        const data = await prisma.user.findUnique(
            {
                where: { id: userId },
                select: {
                    id: true,
                    email: true,
                    first_name: true,
                    last_name: true,
                    role: true
                }
            }
        )
        if (!data) {
            return res.status(400).json({ success: false, message: "Bunday ma'lumotli user topilmadi" })
        }
        res.status(200).json({ success: true, data })
    } catch (error) {
        next(error)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const bodyToken = req.body.refreshToken
        const { userId, role } = jwt.verify(bodyToken, process.env.JWT_SECRET)
        const dbTokens = await prisma.token.findMany({ where: { userId } })
        let matchedToken = null
        for (let dbToken of dbTokens) {
            if (await bcrypt.compare(bodyToken, dbToken.token)) {
                matchedToken = dbToken
                break
            }
        };
        if (!matchedToken) {
            return res.status(403).json({ success: false, message: "Token topilmadi" });
        }
        if (matchedToken.expiresAt < new Date()) {
            prisma.token.delete({where: {id: matchedToken.id}})
            return res.status(403).json({ success: false, message: "Token muddati tugagan" });
        }
        const tokens = TokenService.generateToken(userId, role)
        await prisma.token.delete({ where: { id: matchedToken.id } })
        const ip = req.ip
        const userAgent = req.get("User-Agent")
        await TokenService.saveToken(tokens.refreshToken, userId, userAgent, ip)
        res.json(tokens)
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken
        const { userId } = jwt.verify(refreshToken, process.env.JWT_SECRET)

        // Bazadagi barcha user tokenlarni olib, solishtirib topamiz
        const dbTokens = await prisma.token.findMany({ where: { userId } })
        let matchedToken = null
        for (let dbToken of dbTokens) {
            if (await bcrypt.compare(refreshToken, dbToken.token)) {
                matchedToken = dbToken
                break
            }
        }

        if (!matchedToken) {
            return res.status(403).json({ message: "Token topilmadi yoki allaqachon o‘chirilgan" })
        }

        await prisma.token.delete({ where: { id: matchedToken.id } })

        res.status(200).json({ success: true, message: "Tizimdan muvaffaqiyatli chiqildi" })
    } catch (error) {
        next(error)
    }
}

module.exports = { register, login, getme, refreshToken, logout }