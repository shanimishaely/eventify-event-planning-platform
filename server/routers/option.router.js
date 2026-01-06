import { Router } from "express";
import {auth} from "../middlewares/auth.middleware.js"
import {validateJoiSchema} from "../middlewares/validate.middleware.js"
import {getAllOptions,addOption,updateOption,deleteOption,getOne} from '../controllers/option.controller.js'
import { validOption } from "../models/option.model.js";
import upload from "../middlewares/upload.js"
import { premission } from "../middlewares/auth.middleware.js";
const router=Router();
//הצגת כל הפרסומות
router.get('/', getAllOptions);
//,validateJoiSchema(validOption.valid),auth
//הוספת פרסומת
router.post('/:id',upload.single('file'),auth,premission('advertiser'),validateJoiSchema(validOption.valid),addOption);
//קבלת פרסומת על פי id
router.get('/:id',auth,premission('advertiser'),getOne)
//עדכון פרסומת,validateJoiSchema(validOption.valid)
router.put('/:idoption/:idadver',auth,premission('advertiser'),validateJoiSchema(validOption.valid),updateOption );
//מחיקת פרסומת
router.delete('/:idoption/:idadver',auth,premission('advertiser'),deleteOption);

export default router;