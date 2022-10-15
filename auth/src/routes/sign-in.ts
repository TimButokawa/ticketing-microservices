import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@tbticketsplease/common';
import { User } from '../models/user';
import { Password } from '../utils/password';

const router = express.Router();

router.post('/api/users/sign-in', [
    body('email').isEmail().withMessage('email must be valid'),
    body('password').trim().notEmpty().withMessage('you must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('invalid credentials');
    }

    const isMatchingPassword = await Password.compare(user.password, password);

    if (!isMatchingPassword) {
      throw new BadRequestError('invalid credentials');
    }

    // generate jwt - store on session obj
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.JWT_KEY!);

    req.session = {
      jwt: userJwt
    };

    res.status(200).send(user);
  }
);

export { router as signInRouter };
