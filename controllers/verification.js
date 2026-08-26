const User = require("../models/user.js");
const VerificationToken = require("../models/verificationToken.js");

module.exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Find verification token
        const verificationToken = await VerificationToken.findOne({
            token
        });

        if (!verificationToken) {
            req.flash("error", "Invalid or expired verification link.");
            return res.redirect("/login");
        }

        // Check token expiry
        if (verificationToken.expiresAt < new Date()) {
            await VerificationToken.deleteOne({
                _id: verificationToken._id
            });

            req.flash(
                "error",
                "Verification link has expired. Please request a new one."
            );

            return res.redirect("/login");
        }

        // Find user
        const user = await User.findById(
            verificationToken.userId
        );

        if (!user) {
            req.flash("error", "User not found.");
            return res.redirect("/signup");
        }

        // Verify user
        user.isVerified = true;
        await user.save();

        // Delete used token
        await VerificationToken.deleteOne({
            _id: verificationToken._id
        });

        req.flash(
            "success",
            "Email verified successfully! You can now log in."
        );

        return res.redirect("/login");

    } catch (err) {
        console.log(err);

        req.flash(
            "error",
            "Something went wrong while verifying your email."
        );

        return res.redirect("/login");
    }
};