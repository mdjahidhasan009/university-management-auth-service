import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodEffects } from 'zod';

const validateRequest =
  (
    schema: AnyZodObject | ZodEffects<AnyZodObject> ////NOTE:
  ) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (err) {
      next(err);
    }
  };

export default validateRequest;
