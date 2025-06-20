const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ success: false, message: "Foydalanuvchi ro'yhatdan o'tmagan!" })
    }

    const token = req.headers.authorization.split(" ")[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ success: false, message: "Token yaroqsiz yoki muddati tugagan!" })
    }

}

module.exports = authMiddleware;