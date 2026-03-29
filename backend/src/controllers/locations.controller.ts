import type { Request, Response, NextFunction } from "express";
import { getActiveLocations } from "../services/locations.service";

export const getLocations = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const locations = await getActiveLocations();
    res.json({ locations });
  } catch (err) {
    next(err);
  }
};
