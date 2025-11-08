import prisma from '../configs/db.js';

export const getUserCreations = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware

        const creations = await prisma.creation.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, creations });
    } catch (error) {
        console.error('Get user creations error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPublishedCreations = async (req, res) => {
    try {
        const creations = await prisma.creation.findMany({
            where: { publish: true },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, creations });
    } catch (error) {
        console.error('Get published creations error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const toggleLikeCreation = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const { id } = req.body;

        const creation = await prisma.creation.findUnique({ where: { id: parseInt(id) } });

        if (!creation) {
            return res.status(404).json({ success: false, message: "Creation not found" });
        }

        const currentLikes = creation.likes || [];
        const userIdStr = userId.toString();
        let updatedLikes;
        let message;

        if (currentLikes.includes(userIdStr)) {
            updatedLikes = currentLikes.filter((user) => user !== userIdStr);
            message = 'Creation Unliked';
        } else {
            updatedLikes = [...currentLikes, userIdStr];
            message = 'Creation Liked';
        }

        await prisma.creation.update({
            where: { id: parseInt(id) },
            data: { likes: updatedLikes }
        });

        res.json({ success: true, message });
    } catch (error) {
        console.error('Toggle like error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};