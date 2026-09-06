const userModel = require("../model/userModel")
const bcrypt = require("bcryptjs")

exports.register = async (req, resp) => {
    try {
        const { uname, email, password, role } = req.body

        const existingUser = await userModel.findOne({ email })

        if (existingUser) {
            return resp.status(400).json({ message: "Email already registered" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            uname,
            email,
            password: hashedPassword,
            role: role || "student"
        })

        resp.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                uname: user.uname,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error)
        resp.status(500).json({ message: "Registration failed" })
    }
}

exports.login = async (req, resp) => {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return resp.status(404).json({ message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return resp.status(401).json({ message: "Invalid email or password" })
        }

        resp.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                uname: user.uname,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error)
        resp.status(500).json({ message: "Login failed" })
    }
}

exports.updateProfile = async (req, resp) => {
    try {
        const { uname, email, currentPassword, newPassword } = req.body

        const user = await userModel.findById(req.params.id)

        if (!user) {
            return resp.status(404).json({ message: "User not found" })
        }

        if (email && email !== user.email) {
            const existingUser = await userModel.findOne({ email })

            if (existingUser) {
                return resp.status(400).json({ message: "Email already in use" })
            }

            user.email = email
        }

        if (uname) {
            user.uname = uname
        }

        if (newPassword) {
            if (!currentPassword) {
                return resp.status(400).json({ message: "Current password is required to change password" })
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password)

            if (!isMatch) {
                return resp.status(401).json({ message: "Current password is incorrect" })
            }

            user.password = await bcrypt.hash(newPassword, 10)
        }

        await user.save()

        resp.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                uname: user.uname,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.log(error)
        resp.status(500).json({ message: "Failed to update profile" })
    }
}