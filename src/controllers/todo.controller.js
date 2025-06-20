const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient

const getTodos = async (req, res) => {
    try {
        const { userId } = req.user
        const data = await prisma.todo.findMany({ include: { user: true }, where: { userId } })
        res.status(200).json({ success: true, data })
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: "Serverda xatolik" })
    }
}

const createTodo = async (req, res) => {
    try {
        const { userId } = req.user
        const { name } = req.body
        const data = await prisma.todo.create({
            data: { name, userId },
            include: { user: true }
        })
        console.log(data);
        res.status(200).json({ success: true, data })
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: "Serverda xatolik" })
    }
}

const getById = async (req, res) => {
    try {
        const {userId} = req.user
        const { id } = req.params
        const data = await prisma.todo.findUnique({ where: { id: Number(id), userId }, include: { user: true } })
        res.status(200).json({ success: true, data })
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: "Serverda xatolik" })
    }
}

module.exports = { getTodos, createTodo, getById }