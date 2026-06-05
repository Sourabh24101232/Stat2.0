import express from "express";
import { protect } from "../middleware/auth.js";
import { changeRoleToOwner, deleteCar, getOwnerCars, toggleCarAvailability } from "../Controllers/ownerController.js";
import upload from "../middleware/multer.js";
import { addCar } from "../Controllers/ownerController.js";

const ownerRouter = express.Router();
ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"), protect, addCar);
ownerRouter.get("/cars",protect,getOwnerCars)
ownerRouter.post("/toggle-car",protect,toggleCarAvailability)
ownerRouter.post("/delete-car",protect,deleteCar)

export default ownerRouter;