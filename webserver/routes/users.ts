// routes/user.ts
import { Router, Request, Response } from "express";
import { User } from "../models/ai.js";
import { paginate } from "../middleware/pagination.js";
import { generateHATEOASLinks } from "../lib/hateoas.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         UserID:
 *           type: integer
 *           description: Auto-generated ID of the user
 *         sub:
 *           type: string
 *           description: Unique identifier from the OpenID provider
 *         email:
 *           type: string
 *           description: User's email address
 *         name:
 *           type: string
 *           description: User's full name
 *         picture:
 *           type: string
 *           description: URL to the user's profile picture
 *         lastLogin:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the user's last login
 *       example:
 *         UserID: 1
 *         sub: "google-oauth2|1234567890"
 *         email: "user@example.com"
 *         name: "John Doe"
 *         picture: "https://example.com/johndoe.jpg"
 *         lastLogin: "2024-10-28T12:00:00Z"
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: API endpoints for users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users with pagination
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of users to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of users to skip
 *     responses:
 *       '200':
 *         description: A paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 offset:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 links:
 *                   type: object
 *                   properties:
 *                     self:
 *                       type: string
 *                     next:
 *                       type: string
 *                     prev:
 *                       type: string
 *                     first:
 *                       type: string
 *                     last:
 *                       type: string
 *       '500':
 *         description: Internal server error
 */
router.get(
    "/",
    paginate,
    async (req: Request, res: Response): Promise<void> => {
        const { limit, offset } = (req as any).pagination;

        try {
            const UserName: string | undefined = req.query.UserName as
                | string
                | undefined;
            // Fetch users with pagination
            const { users, total } = await User.findAll({
                limit,
                offset,
                UserName,
            });

            const links = generateHATEOASLinks(req, total, limit, offset);

            res.json({
                total,
                limit,
                offset,
                data: users,
                links,
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).send("Internal server error");
        }
    },
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       '200':
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *   put:
 *     summary: Update a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     requestBody:
 *       description: User object to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               picture:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid input
 *       '404':
 *         description: User not found
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       '204':
 *         description: User deleted successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       description: User object to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sub
 *               - email
 *               - name
 *               - picture
 *             properties:
 *               sub:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               picture:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User created successfully
 *         headers:
 *           Location:
 *             description: URL of the created user
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Invalid input
 */

router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).send("Invalid user ID");
        return;
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        res.json(user);
    } catch (error) {
        console.error(`Error fetching user with ID ${userId}:`, error);
        res.status(500).send("Internal server error");
    }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
    const { sub, email, name, picture } = req.body;
    if (!sub || !email || !name || !picture) {
        res.status(400).send("Missing required fields");
        return;
    }
    try {
        const user = await User.createOrUpdate({ sub, email, name, picture });
        const location = `${req.protocol}://${req.get("host")}${req.baseUrl}/${user.UserID}`;
        res.status(201).header("Location", location).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send("Internal server error");
    }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).send("Invalid user ID");
        return;
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).send("User not found");
            return;
        }

        const { email, name, picture } = req.body;

        if (email !== undefined) user.email = email;
        if (name !== undefined) user.name = name;
        if (picture !== undefined) user.picture = picture;
        user.lastLogin = new Date();

        await user.update();

        res.json(user);
    } catch (error) {
        console.error(`Error updating user with ID ${userId}:`, error);
        res.status(500).send("Internal server error");
    }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        res.status(400).send("Invalid user ID");
        return;
    }

    try {
        const result = await User.deleteById(userId);
        if (result) {
            res.status(204).send();
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error(`Error deleting user with ID ${userId}:`, error);
        res.status(500).send("Internal server error");
    }
});

export default router;
