import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" })
    }
    try {

        const user = await User.findOne({ email: email })

        if (user) {
            return res.status(400).json({ success: false, message: "User already exists with this email. try another." })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashPassword })
        const saveUser = await newUser.save();


        res.status(201).json({ success: true, message: "User created Succesfully!", user: saveUser })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}


export const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" })
    }
    try {

        const user = await User.findOne({ username: username })

        if (!user) {
            return res.status(400).json({ success: false, message: "User does not exists." })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Password is not matched" })

        }
        const secretKey = process.env.JWT_TOKEN;
        const token = jwt.sign({ username: username }, secretKey, { expiresIn: "1d" })

        res.status(200).json({ success: true, message: "User login Succesfully!", user: user, token: token })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}