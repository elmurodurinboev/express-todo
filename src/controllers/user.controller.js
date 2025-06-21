const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


const getUsers = async (req, res, next) => {
    try {
        const data = await prisma.user.findMany()
        const response = {
            success: true,
            data
        }
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}



module.exports = { getUsers }