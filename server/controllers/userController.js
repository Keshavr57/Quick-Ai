import prisma from '../configs/db.js';

export const getUserCreations = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Search
        const search = req.query.search || '';
        
        // Filter by type
        const type = req.query.type || '';
        
        // Sort
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'desc';

        console.log('🔍 Backend received search:', `"${search}"`);
        console.log('🔍 Search length:', search.length);

        // Build where clause
        let where = {
            userId
        };

        if (search && search.trim().length > 0) {
            where.prompt = {
                contains: search.trim(),
                mode: 'insensitive'
            };
            console.log('✅ Search filter applied');
        } else {
            console.log('❌ No search filter');
        }

        if (type && type.trim().length > 0) {
            where.type = type.trim();
        }

        console.log('📋 Where clause:', JSON.stringify(where, null, 2));

        // Get total count for pagination
        const total = await prisma.creation.count({ where });
        console.log('📊 Total matching items:', total);

        // Get creations with filters
        const creations = await prisma.creation.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: limit
        });

        console.log('✅ Returning', creations.length, 'items out of', total, 'total');
        
        // Debug: Show first 3 prompts
        if (creations.length > 0) {
            console.log('📝 Sample prompts:');
            creations.slice(0, 3).forEach((c, i) => {
                console.log(`  ${i + 1}. "${c.prompt}"`);
            });
        }

        res.json({ 
            success: true, 
            creations,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ Get user creations error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPublishedCreations = async (req, res) => {
    try {
        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        
        // Search
        const search = req.query.search || '';
        
        // Filter by type
        const type = req.query.type || '';
        
        // Sort
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder || 'desc';

        console.log('🔍 Backend received search:', `"${search}"`);
        console.log('🔍 Search length:', search.length);

        // Build where clause
        let where = {
            publish: true
        };

        if (search && search.trim().length > 0) {
            where.prompt = {
                contains: search.trim(),
                mode: 'insensitive'
            };
            console.log('✅ Search filter applied');
        } else {
            console.log('❌ No search filter');
        }

        if (type && type.trim().length > 0) {
            where.type = type.trim();
        }

        console.log('📋 Where clause:', JSON.stringify(where, null, 2));

        // Get total count for pagination
        const total = await prisma.creation.count({ where });
        console.log('📊 Total matching items:', total);

        // Get creations with filters
        const creations = await prisma.creation.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: limit
        });

        console.log('✅ Returning', creations.length, 'items out of', total, 'total');
        
        // Debug: Show first 3 prompts
        if (creations.length > 0) {
            console.log('📝 Sample prompts:');
            creations.slice(0, 3).forEach((c, i) => {
                console.log(`  ${i + 1}. "${c.prompt}"`);
            });
        }

        res.json({ 
            success: true, 
            creations,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('❌ Get published creations error:', error);
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

export const deleteCreation = async (req, res) => {
    try {
        const userId = req.userId; // From auth middleware
        const { id } = req.params;

        console.log('🗑️ Delete request for creation:', id, 'by user:', userId);

        // Check if creation exists and belongs to user
        const creation = await prisma.creation.findUnique({ 
            where: { id: parseInt(id) } 
        });

        if (!creation) {
            return res.status(404).json({ success: false, message: "Creation not found" });
        }

        if (creation.userId !== userId) {
            return res.status(403).json({ success: false, message: "You can only delete your own creations" });
        }

        // Delete the creation
        await prisma.creation.delete({
            where: { id: parseInt(id) }
        });

        console.log('✅ Creation deleted successfully');
        res.json({ success: true, message: 'Creation deleted successfully' });
    } catch (error) {
        console.error('❌ Delete creation error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};
