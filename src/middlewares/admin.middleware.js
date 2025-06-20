const adminMiddleware = (req, res, next) => {
    const user = req.user
    
    if (!user) {
        return res.status(401).json({ success: false, message: "Foydalanuvchi ro'yhatdan o'tmagan" })
    }

    if (user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: "Ruhsat yo'q" })
    }

    next()
}

module.exports = adminMiddleware