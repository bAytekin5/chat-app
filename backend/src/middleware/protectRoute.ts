import jwt, {JwtPayload} from "jsonwebtoken";

import {Request, Response, NextFunction} from "express";
import prisma from "../database/prisma.js";

interface DecodedToken extends JwtPayload {
    userId: string;
}

declare global {
    namespace Express {
        export interface Request {
            user: {
                id: string;
            };
        }
    }
}

class ApiError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

const protectRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            throw new ApiError("Yetkisiz - No token provided", 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;

        if (!decoded) {
            throw new ApiError("Yetkisiz - Invalid Token", 401);
        }

        const user = await prisma.user.findUnique({
            where: {id: decoded.userId},
            select: {id: true, username: true, fullname: true, profilePic: true},
        });

        if (!user) {
            throw new ApiError("Kullanıcı Bulunamadı!", 404);
        }

        req.user = user;

        next();
    } catch (error: any) {
        console.log("Error in protectRoute middleware", error.message);
        next(error);
    }
};

export default protectRoute;
