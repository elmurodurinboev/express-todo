const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient

const getTodos = async (req, res, next) => {
    try {
        const { userId } = req.user
        const data = await prisma.todo.findMany({ include: { user: true }, where: { userId } })
        res.status(200).json({ success: true, data })
    } catch (error) {
        next(error)
    }
}

const createTodo = async (req, res, next) => {
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
        next(error)
    }
}

const getById = async (req, res, next) => {
    try {
        const { userId } = req.user
        const { id } = req.params
        const data = await prisma.todo.findUnique({ where: { id: Number(id), userId }, include: { user: true } })
        res.status(200).json({ success: true, data })
    } catch (error) {
        next(error)
    }
}

const updateTodo = async (req, res, next) => {
    try {
        const { id } = req.params
        const { name } = req.body
        const { userId } = req.user
        const data = await prisma.todo.findUnique({ where: { id: Number(id), userId }, include: { user: true } })
        if (!data) {
            return res.status(400).json({ success: false, message: "Ma'lumot topilmadi" })
        }
        const updatedData = await prisma.todo.update({ where: { id: Number(id) }, data: { name } })
        res.status(200).json({ success: true, data: updatedData })
    } catch (error) {
        next(error)
    }
}

const deleteTodo = async (req, res, next) => {
    try {
        const { id } = req.params
        const { userId } = req.user
        const data = await prisma.todo.findUnique({ where: { id: Number(id), userId }, include: { user: true } })
        if (!data) {
            return res.status(400).json({ success: false, message: "Ma'lumot topilmadi" })
        }
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

module.exports = { getTodos, createTodo, getById, updateTodo, deleteTodo }