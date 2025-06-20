const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()


const getUsers = async (req, res) => {
    try {
        const data = await prisma.user.findMany()
        const response = {
            success: true,
            data
        }
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: "Serverda xatolik yuz berdi." });
    }
}



module.exports = { getUsers }