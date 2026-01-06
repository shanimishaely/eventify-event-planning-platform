import Option from "../models/option.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getAllOptions= async (req,res,next) =>{
    try {
        const options= await Option.find();
        res.json(options);
    } catch (error) {
        // שגיאה בשליפת הפרסומות
        return next({ msg: 'Failed to retrieve all options.', type: 'Server Error', status: 500 });    }
}
export const getOne=async (req,res,next) =>{
try {
    const {id}=req.params;
    const option=await Option.findById(id);
    if(!option){
        // אם האופציה לא נמצאה - 404
         return next({ msg: `Option not found.`, type: 'Not Found', status: 404 });
    }
    res.status(200).json(option);
} catch (error) {
    // שגיאה בשליפת האופציה
        return next({ msg: 'Invalid option ID format.', type: 'Invalid Input', status: 400 });}
}

export const addOption=async (req,res,next) =>{
    try {
        const newOption = new Option(req.body);
        await newOption.save();
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user)
        {
            // משתמש לא נמצא - 404
            return next({ msg: `User not found. Option created but not linked.`, type: 'Not Found', status: 404 });  
        }
        const data = {
            idOption: newOption._id,
            name: newOption.name,
            category: newOption.category,
            pic:newOption.pic
        };
        user.advertisment.push(data);
        await user.save();
        res.status(201).json(newOption);
    } catch (error) {
        // שגיאה בהוספת האופציה
        return next({ msg: 'Failed to add option: Invalid data or server error.', type: 'Validation Error', status: 400 });    
    }
}


export const updateOption = async (req, res,next) => {
    try {
        const { idoption, idadver } = req.params;
        // עדכון הפרסומת
        const option = await Option.findByIdAndUpdate(idoption, {
            $set: req.body,
        }, {
            new: true
        });

        // אם לא נמצאה הפרסומת, החזר שגיאה
        if (!option) {
            // פרסומת לא נמצאה - 404
            return next({ msg: `Option not found.`, type: 'Not Found', status: 404 });        
        }

        // עדכון המידע במערך הפרסומות של הלקוח
        await User.updateOne(
            { _id: idadver, 'advertisment.idOption': idoption }, // חיפוש הלקוח לפי id
            { $set: { 
                'advertisment.$.name': option.name,
                'advertisment.$.category': option.category 
                // עדכן כאן שדות נוספים אם יש צורך
            }}
        );

        // החזר את הפרסומת עם העדכונים
        return res.status(200).json(option);
    } catch (error) {
        //שגיאה בעדכון הפרסומת
        return next({ msg: 'Option update failed: Invalid data or ID format.', type: 'Validation Error', status: 400 });    
    }
};


export const deleteOption = async (req, res,next) => {
    try {
        const { idoption, idadver } = req.params;

        // 1. בדיקת תקינות ID ומניעת קריסה (לפני ההמרה)
        if (!mongoose.Types.ObjectId.isValid(idoption) || !mongoose.Types.ObjectId.isValid(idadver)) {
            return next({ msg: 'Invalid ID format provided for option or advertiser.', type: 'Invalid Input', status: 400 });        
        }

        //  המרה מפורשת של ה-ID ל-ObjectId
        const optionObjectId = new mongoose.Types.ObjectId(idoption);

        // 2. מחיקת הפרסומת מאוסף Options
        // שימוש במשתנה המומר
        const option = await Option.findByIdAndDelete(optionObjectId); 
        
        if (!option) {
            //האופציה לא קיימת
        return next({ msg: `Option not found.`, type: 'Not Found', status: 404 });
        }

        // 3. מציאת המשתמש
        const user = await User.findById(idadver);

        if (!user) {
            // הפרסומת נמחקה, אך המשתמש לא נמצא. מחזירים 204.
            return res.status(204).end(); 
        }

        // 4. חיפוש האינדקס במערך הפרסומות (advertisment)
        // 💡 הוספת בדיקת קיום ad.idOption לפני הפעלת equals, ושימוש ב-optionObjectId המומר
        const optionIndex = user.advertisment.findIndex(ad => ad.idOption && ad.idOption.equals(optionObjectId)); 
        
        if (optionIndex === -1) {
            // אם הקישור לא נמצא, עדיין מחזירים הצלחה כיוון שהפרסומת נמחקה
            return res.status(204).end();
        }

        // 5. מחיקת הקישור באמצעות splice
        user.advertisment.splice(optionIndex, 1);
        
        // 6. שמירת המשתמש המעודכן
        await user.save();

        // 7. תגובת הצלחה
        return res.status(204).end(); 

    } catch (error) {
        // טיפול בשגיאות שרת פנימיות
        console.error('Error during deleteOption:', error);
        // שליחת הודעה ברורה ללקוח
        return next({ msg: 'Option deletion failed due to server error.', type: 'Server Error', status: 500 });
    }
};

       