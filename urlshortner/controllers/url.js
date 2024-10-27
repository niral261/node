const shortid = require("shortid");
const URL = require('../models/url');

async function generateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortID = shortid.generate(); // Corrected this line

    try {
        await URL.create({
            shortID: shortID,
            redirectURL: body.url,
            visitHistory: [],
            createdBy: req.user._id
        });
        return res.render('home',{
            id: shortID,
        })
    } catch (error) {
        console.error("Error creating short URL:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAnalytics(req,res) {
    const shortId = req.params.shortID;
    const result = await URL.findOne({ shortId });
    return res.json({ totalClicks: result.visitHistory.length, analytics: result.visitHistory})
}

module.exports = {
    generateNewShortURL,
    getAnalytics
};
