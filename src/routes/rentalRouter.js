import { Router } from "express";
import {
  createRental,
  deleteRental,
  getRentals,
  returnRental,
} from "../controllers/rentalController.js";
import {
  createRentalMiddleware,
  returnRentalMiddleware,
} from "../middlewares/rentalMiddleware.js";

const rentalRouter = Router();

rentalRouter.get("/rentals", getRentals);
rentalRouter.post("/rentals", createRentalMiddleware, createRental);
rentalRouter.post("/rentals/:id/return", returnRental);
rentalRouter.delete("/rentals/:id", deleteRental);

export default rentalRouter;
