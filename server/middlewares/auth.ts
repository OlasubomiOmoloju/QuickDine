import { NextFunction, Request, Response } from "express";
import { IUser, User } from "../models/User.js";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: IUser;
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    let token: string | undefined;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            console.log("TOKEN RECEIVED:", !!token);

            // Verify token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET!
            ) as { id: string };

            console.log("DECODED TOKEN:", decoded);

            // Get user from database
            const user = await User.findById(decoded.id).select("-password");

            console.log("USER FOUND:", user?._id);

            if (!user) {
                res.status(401).json({
                    message: "Not authorized, user not found",
                });
                return;
            }

            req.user = user;

            next();
            return;
        } catch (error) {
            console.error("AUTH MIDDLEWARE ERROR:", error);

            res.status(401).json({
                message: "Not authorized, token failed",
            });

            return;
        }
    }

    res.status(401).json({
        message: "Not authorized, no token",
    });
};

export const adminOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            message: "Access denied, admin role required",
        });
    }
};

export const ownerOnly = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {

    console.log("OWNER CHECK");
    console.log("USER:", req.user);
    console.log("ROLE:", req.user?.role);

    if (req.user && req.user.role === "owner") {
        next();
    } else {
        res.status(403).json({
            message: "Access denied, owner role required",
        });
    }
};