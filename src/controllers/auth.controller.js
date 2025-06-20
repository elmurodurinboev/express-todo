const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
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
        console.log(error)
        res.status(400).json({ success: false, message: "Serverda xatolik yuz berdi." });
    }
}

const login = async (req, res) => {
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
        const token = jwt.sign({ userId: existingUser.id, role: existingUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).json({ token })
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: "Serverda xatolik yuz berdi." });
    }
}

module.exports = { register, login }