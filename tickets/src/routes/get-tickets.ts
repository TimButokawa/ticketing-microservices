import { requireAuth } from '@tbticketsplease/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets',
    requireAuth,
    async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});

    res.send(tickets);
});

export { router as getTicketsRouter };

