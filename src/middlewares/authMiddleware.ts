import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, 'your_secret_key') as JwtPayload;
      req.user = { id: decoded.userId };
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
  } else {
    res.status(401).json({ message: 'Authorization header missing.' });
  }
};
