// middleware/pagination.ts
import { Request, Response, NextFunction } from "express";

export interface Pagination {
    limit: number;
    offset: number;
}

export function paginate(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    let limit = parseInt(req.query.limit as string);
    let offset = parseInt(req.query.offset as string);

    // Set default values if not provided or invalid
    if (isNaN(limit) || limit <= 0) {
        limit = 25; // Default limit
    }
    if (isNaN(offset) || offset < 0) {
        offset = 0; // Default offset
    }

    // Attach pagination info to request object
    (req as any).pagination = { limit, offset };
    next();
}
