import { Router, Request, Response, NextFunction } from "express";
import pool from "../database/db";
import { CreateUserRequest, CreateUserResponse } from "../types/types";
import { userSchema } from "../schema/user-schema";

const router = Router();

router.get(
  "/user",
  async (
    req: Request,
    res: Response<CreateUserResponse[] | { error: string }>,
    next: NextFunction
  ): Promise<void> => {

    try {
      const allUser = await pool.query('SELECT * FROM "user"');
      res.send(allUser.rows);
    } catch (error: unknown) {
      next(error);
    }
  }
);

router.post(
  "/user",
  async (
    req: Request<{}, {}, CreateUserRequest>,
    res: Response<CreateUserResponse | { error: string }>,
    next: NextFunction
  ): Promise<void> => {
    const { user_name, email } = req.body;

    // SCHEMA VALIDATION
    const validationResult = userSchema.validate({
      user_name,
      email,
    });

    if (validationResult.error) {
      const details = validationResult.error.details[0].message;
      res.status(400).json({ error: details });
    }

    try {
      const newUser = await pool.query(
        'INSERT INTO "user" (user_name , email) VALUES ($1, $2) RETURNING *',
        [user_name, email]
      );
      res.json(newUser.rows[0]);
    } catch (error: unknown) {
      next(error);
    }
  }
);

router.put(
  "/user/:id",
  async (
    req: Request<{ id: string }, {}, CreateUserRequest>,
    res: Response<CreateUserResponse | { error: string }>,
    next: NextFunction
  ): Promise<void> => {
    const {
      params: { id },
    } = req;

    const { user_name, email } = req.body;
    try {
      const newUser = await pool.query(
        'UPDATE "user" SET user_name = $1, email = $2 WHERE user_id = $3 RETURNING*',
        [user_name, email, id]
      );
      res.json(newUser.rows[0]);
    } catch (error: unknown) {
      next(error);
    }
  }
);

interface userDatabase {
  user_name: string;
  email: string;
}

router.patch(
  "/user/:id",
  async (
    req: Request<{ id: string }, {}, CreateUserRequest>,
    res: Response<CreateUserResponse | { error: string }>,
    next: NextFunction
  ): Promise<void> => {
    const {
      params: { id },
    } = req;
    let { user_name, email } = req.body;

    // request the current user
    try {
      const result = await pool.query(
        'SELECT * FROM "user" WHERE user_id = $1',
        [id]
      );
      let current_user = result.rows[0];

      // checkes if the client has updated data for user_name and/or email if not then asign the data from current_user
      if (!user_name) user_name = current_user.user_name;
      if (!email) email = current_user.email;
    } catch (error: any) {
      console.error(error.message, "error message");
    }

    try {
      const newUser = await pool.query(
        'UPDATE "user" SET user_name = $1, email = $2 WHERE user_id = $3 RETURNING*',
        [user_name, email, id]
      );
      res.json(newUser.rows[0]);
    } catch (error: unknown) {
      next(error);
    }
  }
);

router.delete(
  "/user/:id",
  async (
    req: Request<{ id: string }, {}, CreateUserRequest>,
    res: Response<CreateUserResponse | { error: string }>,
    next: NextFunction
  ): Promise<void> => {
    const {
      params: { id },
    } = req;

    try {
      const newUser = await pool.query(
        'DELETE FROM "user" WHERE user_id = $1 RETURNING *',
        [id]
      );
      res.json(newUser.rows[0]);
    } catch (error: unknown) {
      next(error);
    }
  }
);
export { router as userRouter };
