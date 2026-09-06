const express = require("express")
const { getMyBadges } = require("../controller/badgeController")

const badgeRouter = express.Router()

badgeRouter.get("/my-badges/:studentId", getMyBadges)

module.exports = badgeRouter