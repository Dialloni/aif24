import { Request, Response, NextFunction } from "express";

export function log_init(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const timestamp = new Date().toISOString();
    console.log(
        `[${timestamp}] ${req.method} ${req.originalUrl} request being served.`,
    );
    next();
}
export function log_close(
    req: Request,
    res: Response,
    next: NextFunction,
): void {
    const timestamp = new Date().toISOString();
    console.log(
        `[${timestamp}] ${req.method} ${req.originalUrl} request served.`,
    );

    next();
}
