import { Router } from "express";
import User from '../models/user.model.js';
import {getAllUsers,getAllOrders,getAllAdvertisement,register,login,addOrder,updateOrder,deleteOrder} from '../controllers/user.controller.js'
import { validUser } from "../models/user.model.js";
import {validateJoiSchema} from "../middlewares/validate.middleware.js"
import { auth } from "../middlewares/auth.middleware.js";
import { premission } from "../middlewares/auth.middleware.js";
const router=Router();

//הצגת כל הלקוחות
router.get('/', getAllUsers);
//צפייה ביומנו, auth
router.post('/watchd/:id',auth,premission('user'),getAllOrders);
//צפייה בפרסומיו,auth
router.post('/watch/:id',auth,premission('advertiser'),getAllAdvertisement);
//הרשמת לקוח,,validateJoiSchema(validUser.register)
router.post('/register/',validateJoiSchema(validUser.register),register);
//התחברות לקוח,,validateJoiSchema(validUser.login)
router.post('/',validateJoiSchema(validUser.login),login);
//הוספה ליומן,auth
router.post('/:id',auth,premission('user'),addOrder);
//עדכון יומן
//router.put('/:idUser/:idOrder',auth,updateOrder);
//מחיקת מהיומן,auth
router.delete('/:idUser/:idOrder',auth,premission('user'),deleteOrder)
export default router;