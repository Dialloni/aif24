// src/utils/hateoas.ts
import { Request } from "express";

export const generateHATEOASLinks = (
    req: Request,
    total: number,
    limit: number,
    offset: number,
) => {
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const originalQuery = { ...req.query };

    // Ensure limit and offset are set correctly in the query parameters
    const queryParams = new URLSearchParams(originalQuery as any);
    queryParams.set("limit", limit.toString());

    // Helper function to build URLs with updated offset
    const buildUrl = (newOffset: number) => {
        queryParams.set("offset", newOffset.toString());
        return `${baseUrl}?${queryParams.toString()}`;
    };

    const links: any = {
        self: buildUrl(offset),
        first: buildUrl(0),
        last: buildUrl(Math.floor((total - 1) / limit) * limit),
    };

    // Include 'prev' link only if there is a previous page
    if (offset > 0) {
        const prevOffset = Math.max(offset - limit, 0);
        links.prev = buildUrl(prevOffset);
    }

    // Include 'next' link only if there is a next page
    if (offset + limit < total) {
        const nextOffset = offset + limit;
        links.next = buildUrl(nextOffset);
    }

    return links;
};
