import { Request, Response, NextFunction } from "express";

export class NotFoundError extends Error {
    constructor() {
        super('Entity not found');
    }
}

export const notFoundHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof NotFoundError) {
        res.status(404).json({
            error: 'NotFoundError',
            message: 'Entità non trovata'
        });
    } else {
        next(err);
    }
}