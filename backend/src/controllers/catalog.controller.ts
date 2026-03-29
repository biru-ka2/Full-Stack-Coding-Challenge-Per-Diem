import type { Request, Response, NextFunction } from "express";
import { getCatalogByLocation, getCategoriesByLocation } from "../services/catalog.service";
import { ValidationError } from "../utils/errors";

export const getCatalog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { location_id } = req.query;
    if (!location_id || typeof location_id !== "string") {
      return next(new ValidationError("location_id query parameter is required"));
    }
    const catalog = await getCatalogByLocation(location_id);
    res.json({ catalog });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { location_id } = req.query;
    if (!location_id || typeof location_id !== "string") {
      return next(new ValidationError("location_id query parameter is required"));
    }
    const categories = await getCategoriesByLocation(location_id);
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};
