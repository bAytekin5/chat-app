import prisma from "../database/prisma.js";
import bcryptjs from "bcryptjs";
import generateToken from "../utils/generateToken.js";
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
export const signup = async (req, res, next) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;
        if (!fullname || !username || !password || !confirmPassword || !gender) {
            throw new ApiError("Tüm alanlar zorunludur", 400);
        }
        if (password !== confirmPassword) {
            throw new ApiError("Şifreler eşleşmiyor", 400);
        }
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUser) {
            throw new ApiError("Kullanıcı adı zaten kullanılıyor", 400);
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const profilePic = gender === "male"
            ? `https://avatar.iran.liara.run/public/boy?username=${username}`
            : `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const newUser = await prisma.user.create({
            data: {
                fullname,
                username,
                password: hashedPassword,
                gender,
                profilePic,
            },
        });
        generateToken(newUser.id, res);
        res.status(201).json({
            id: newUser.id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilePic: newUser.profilePic,
        });
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            console.log("Kayıt Hatası:", error);
            next(error);
        }
    }
};
export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new ApiError("Kullanıcı adı ve şifre gereklidir", 400);
        }
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            throw new ApiError("Kullanıcı bulunamadı", 404);
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new ApiError("Hatalı şifre", 401);
        }
        generateToken(user.id, res);
        res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            console.log("Giriş Hatası:", error);
            next(error);
        }
    }
};
export const logout = async (req, res, next) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ message: "Başarıyla çıkış yapıldı" });
    }
    catch (error) {
        if (error instanceof ApiError) {
            res.status(error.statusCode).json({ message: error.message });
        }
        else {
            console.log("Çıkış Hatası:", error);
            next(error);
        }
    }
};
export const getMe = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user) {
            throw new ApiError("Kullanıcı bulunamadı", 404);
        }
        res.status(200).json({
            id: user.id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        console.log("Error in getMe", error);
        next(error);
    }
};
