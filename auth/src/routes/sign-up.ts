import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@tbticketsplease/common';
import { User } from '../models/user';

const router = express.Router();

router.post('/api/users/sign-up', [
    body('email').isEmail().withMessage('email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (!!existingUser) {
      throw new BadRequestError('Email must be unique.');
    }

    const user = User.build({ email, password });
    // write to db
    await user.save();

    // generate jwt - store on session obj
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.JWT_KEY!);

    req.session = {
      jwt: userJwt
    };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
