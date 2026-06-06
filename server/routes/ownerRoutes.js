import express from "express";
import { protect } from "../middleware/auth.js";
import { changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability ,addCar,updateUserImage} from "../Controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();
ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"), protect, addCar);
ownerRouter.get("/cars",protect,getOwnerCars)
ownerRouter.post("/toggle-car",protect,toggleCarAvailability)
ownerRouter.post("/delete-car",protect,deleteCar)
//Add get DashboardData function after creating booking model,controller and routes
ownerRouter.get('/dashboard',protect,getDashboardData)
ownerRouter.post("/update-image", upload.single("image"), protect, updateUserImage);

export default ownerRouter;