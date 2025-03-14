import jwt from "jsonwebtoken";
import prisma from "../database/prisma.js";
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            throw new ApiError("Yetkisiz - No token provided", 401);
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            throw new ApiError("Yetkisiz - Invalid Token", 401);
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, username: true, fullname: true, profilePic: true },
        });
        if (!user) {
            throw new ApiError("Kullanıcı Bulunamadı!", 404);
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        next(error);
    }
};
export default protectRoute;
