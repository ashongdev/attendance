import { Request, Response } from "express";
import { QueryResult } from "pg";
import { v4 as uuid } from "uuid";
import { pool } from "../db";

const registerCourse = async (req: Request, res: Response) => {};

const getStudents = async (req: Request, res: Response): Promise<void> => {};

const authenticate = async (req: Request, res: Response): Promise<void> => {};

export { authenticate, getStudents, registerCourse };
