import User,{generateToken} from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getAllUsers=  async (req,res,next) =>{ 
    try {
        const users= await User.find();
        res.json(users);
    } catch (error) {
       // שליפת המשתמשים נכשלה
       return next({msg:'Failed to retrieve all users.', type:'Server Error', status:500});
    }
};

export const getAllOrders= async (req, res, next) => { 
    try {
       
        const { id } = req.params;
        const user = await User.findById(id).select('order'); 
        
        if (!user) {
            // אם המשתמש לא נמצא - 404
            return next({ msg: `User not found.`, type: 'Not Found', status: 404 });
        }          
        res.json(user.order); 
        
    } catch (error) {
//שליפת ההזמנות נכשלה
        return next({ msg: 'Failed to retrieve orders or invalid user ID format.', type: 'Server Error', status: 500 });
    }
};


export const getAllAdvertisement=  async (req, res, next) => { 
    try {
       
        
        const { id } = req.params;
        const user = await User.findById(id).select('advertisment'); 
        
        if (!user) {
            // אם המשתמש לא נמצא - 404
            return next({ msg: `User not found.`, type: 'Not Found', status: 404 });
        }
        res.json(user.advertisment); 
       
    } catch (error) {
        // שליפת הפרסומים נכשלה
        return next({ msg: 'Failed to retrieve advertisements or invalid user ID format.', type: 'Server Error', status: 500 });
    }
};

// הרשמה
export const register= async (req,res,next) =>{
    try {
        const user=new User(req.body);
        await user.save();//מצפין סיסמא בגלל הprev 
        user.password = '****'; 
       // const token = generateToken(user);
        return res.status(201).json({ userName: user.userName, email: user.email });
    } 
    catch (error) 
    {
       // כשלון ולידציה או משתמש קיים
       return next({msg:'Registration failed: Invalid data or user already exists.', type:'Validation Error', status:400});
    }
};

// התחברות
export const login =async(req,res,next)=>{
   
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            // פרטים לא חוקיים - 401 
            return next({ msg: 'Invalid email or password.', type: 'Authentication Failed', status: 401 });
        }
        
         const result = await bcrypt.compare(password, user.password); // true
        if (result) {
            const token = generateToken(user);
            return res.status(200).json({ userName: user.userName, token: token ,userId:user._id,role:user.role});
        }
        else {
            // סיסמה שגויה - 401 
            return next({ msg: 'Invalid email or password.', type: 'Authentication Failed', status: 401 });
        }
        
    } catch (error) {
        // כשלון בתהליך ההתחברות - 500
        return next({ msg: 'Login process failed due to server error.', type: 'Server Error', status: 500});
    }
}

export const addOrder=async (req,res,next) =>{ 
    try {
        
        
            const {id} =req.params;
            const user=await User.findById(id);
            if (!user) {
                // משתמש לא נמצא - 404
                return next({ msg: `User not found.`, type: 'Not Found', status: 404 });
            }
            user.order.push(req.body);
            await user.save();
            res.status(201).json(user);
        
    } catch (error) {
// הוספת ההזמנה נכשלה
        return next({msg:'Failed to add order: Invalid order data.', type:'Validation Error', status:400});
    }
};


export const updateOrder= async (req,res,next)=> { 
    try {
            const { idUser,idOrder,role } = req.params;
            
            if(role==="user")
            {
                const user=await User.findById(idUser);
                if(!user)
                    // משתמש לא נמצא - 404
                    return next({ msg: `User not found.`, type: 'Not Found', status: 404 });
               
            
                 const orderIndex = user.order.findIndex(order1 => order1._id.equals(idOrder));
                if (orderIndex === -1) {
                    // הזמנה לא נמצאה - 404
                    return next({ msg: `Order not found for user.`, type: 'Not Found', status: 404 });
                }
        
                user.order[orderIndex] = { ...user.order[orderIndex], ...req.body };
                await user.save(); 
        
                res.json(user);
            }
            else{
                // אין הרשאה - 403 
                return  next({status: 403, type:'Authorization Error',msg:'Forbidden: Only user role can update orders.'});
            }  
        } catch (error) {
// עדכון ההזמנה נכשל
            return next({msg:'Order update failed: Invalid data or server error.', type:'Validation Error', status:400});
        }
    };


    export const deleteOrder= async (req,res,next)=> { 
        try {
            const { idUser,idOrder } = req.params; // הוספת role להדגמה
            
           
            
            const user=await User.findById(idUser);
            if(!user)
                // משתמש לא נמצא - 404
                return next({ msg: `User not found.`, type: 'Not Found', status: 404 });
                
            const orderIndex = user.order.findIndex(order1 => order1._id.equals(idOrder));
            if (orderIndex === -1) {
                // הזמנה לא נמצאה - 404
                return next({ msg: `Order not found for user.`, type: 'Not Found', status: 404 });
            }
            
            const del=user.order.splice(orderIndex,1);
            await user.save(); 
          res.status(204).end();  
        
        }
        catch (error) {
// מחיקת ההזמנה נכשלה
            return next({msg:'Order deletion failed due to server error.', type:'Server Error', status:500});
        }
    };

