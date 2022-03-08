import { Router } from "express";
import {
  createCustomer,
  getCustomer,
  updateCustomer,
} from "../controllers/customerController.js";
import {
  customerCreateMiddleware,
  customerUpdateMiddleware,
} from "../middlewares/customerMiddleware.js";

const customerRouter = Router();

customerRouter.get("/customers", getCustomer);
customerRouter.get("/customers/:id", getCustomer);
customerRouter.post("/customers", customerCreateMiddleware, createCustomer);
customerRouter.put("/customers/:id", customerUpdateMiddleware, updateCustomer);

export default customerRouter;
