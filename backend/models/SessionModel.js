const mongoose = require("mongoose");
const { SessionSchema } = require("../schemas/SessionSchema");

const SessionModel = mongoose.model("session", SessionSchema);

module.exports = { SessionModel };
