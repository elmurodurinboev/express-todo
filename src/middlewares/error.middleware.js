const sendToTelegram = async (error) => {
    const token = process.env.TELEGRAM_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    const message = `
    <b>❌ Serverda xatolik!</b>
    <b>Xabar:</b> ${err.message}
    <b>Vaqt:</b> ${new Date().toLocaleString()}
    `;
    try {
        await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: "HTML",
        });
    } catch (error) {
        console.error("❌ Telegramga yuborishda xatolik:", telegramErr.message);
    }
}


const errorHandler = async (err, req, res, next) => {
    console.error(err?.message)
    // Telegramga yuboramiz
    sendErrorToTelegram(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Serverda ichki xatolik yuz berdi",
    });
}

module.exports = errorHandler