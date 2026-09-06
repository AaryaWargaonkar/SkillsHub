const badgeModel = require("../model/badgeModel")

exports.getMyBadges = async (req, resp) => {
    try {
        const badges = await badgeModel.find({
            studentId: req.params.studentId
        }).sort({ earnedAt: -1 })

        resp.status(200).json(badges)
    } catch (error) {
        console.log(error)
        resp.status(500).json({
            message: "Failed to fetch badges"
        })
    }
}

exports.awardBadge = async (studentId, badgeName, description, icon) => {
    try {
        const existingBadge = await badgeModel.findOne({
            studentId,
            badgeName
        })

        if (existingBadge) return

        await badgeModel.create({
            studentId,
            badgeName,
            description,
            icon
        })
    } catch (error) {
        console.log(error)
    }
}