const jwt = require("jsonwebtoken")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const bcrypt = require("bcrypt")
const TokenService = {
    generateToken(userId, role) {
        const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: '15d' })
        return { accessToken, refreshToken }
    },
    async saveToken(token, userId, userAgent, ip) {
        try {
            const hashedToken = await bcrypt.hash(token, 10)
            const data = await prisma.token.create({
                data: {
                    token: hashedToken,
                    userAgent,
                    userId,
                    ip,
                    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
                }
            })
            return data
        } catch (error) {

        }
    }
}

module.exports = TokenService