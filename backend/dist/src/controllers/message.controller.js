import prisma from "../database/prisma.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
export const sendMessage = async (req, res, next) => {
    try {
        const messageText = req.body.message;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        const participantIds = [senderId, receiverId].filter((id) => id !== undefined);
        if (!senderId) {
            return next(new ApiError("User not authenticated", 401));
        }
        let conversation = await prisma.conversation.findFirst({
            where: {
                participantId: {
                    hasEvery: participantIds,
                },
            },
        });
        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    participantId: participantIds,
                },
            });
        }
        const newMessage = await prisma.message.create({
            data: {
                senderId,
                body: messageText,
                conversationId: conversation.id,
            },
        });
        if (newMessage) {
            conversation = await prisma.conversation.update({
                where: {
                    id: conversation.id,
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        },
                    },
                },
            });
        }
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
            res.status(201).json(newMessage);
        }
    }
    catch (error) {
        console.log("Error in sendMessage", error);
        next(error);
    }
};
export const getMessages = async (req, res, next) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        const conversation = await prisma.conversation.findFirst({
            where: {
                participantId: {
                    hasEvery: [senderId, userToChatId],
                },
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
        if (!conversation) {
            return next(new ApiError("No data found", 200));
        }
        res.status(200).json(conversation.messages);
    }
    catch (error) {
        console.log("Error in getMessage", error);
        next(error);
    }
};
export const getUserForSideBar = async (req, res, next) => {
    try {
        const authUserId = req.user.id;
        const users = await prisma.user.findMany({
            where: {
                id: {
                    not: authUserId,
                },
            },
            select: {
                id: true,
                fullname: true,
                profilePic: true,
            },
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.log("Error in getUserForSideBar", error);
        next(error);
    }
};
