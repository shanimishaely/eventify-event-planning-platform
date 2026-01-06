import {model,Schema } from 'mongoose'
import Joi from 'joi'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const uesrSchema= new Schema({
    userName: String,
    email:{ type:String, unique:true },
    password: String,
    phone: String,
    role: { type: String, enum: ['user','advertiser']},
    advertisment: [{ idOption:{ type: Schema.Types.ObjectId, ref: 'options' },pic: String, name:String, category:String }],
    order:[{id:String,pic:String, name:String,price: Number,phone:String}]  
      
});
// save פעולה לביצוע לפני הפעולה
uesrSchema .pre('save', async function(){
    if (!this.isModified('password')){
        return;
    }
    // this - האוביקט שהולך להישמר בדטהבייס
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(this.password, salt); // גיבוב/הצפנה של הסיסמא
    // Store hash in your password DB
    this.password = hash;

    // נשמר בדטהבייס this-בסוף הפונקציה כל ה
})


// יצירת צמיד-טוקן
export const generateToken = (user) => {
    // מקבלים את כל פרטי המשתמש ולוקחים מתוכו רק את מה שקשור להרשאות
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
};


//סכמה לבדיקת תקינות
export const validUser= {
    login: Joi.object({
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(4).required()
    }),
    register: Joi.object({
        userName: Joi.string().required(),
        email: Joi.string().email().lowercase().required(),
        password: Joi.string().min(4).required(),
        phone:Joi.string().required(),
        role: Joi.string().valid('user','advertiser')
    })
}
const User=model('users',uesrSchema);
export default User;