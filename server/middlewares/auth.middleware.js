import jwt from "jsonwebtoken"
export const auth=(req,res,next)=>{
   const { authorization } = req.headers;
    if (!authorization) {
        return next({ msg: 'Missing authorization header',status:401 });   
    }
    const [, token] = authorization.split(' ');
    try {
        // payload כאן ייכנס האוביקט
        const user = jwt.verify(token, process.env.JWT_SECRET);
        // העברת ההרשאות הלאה לקונטרולר
        req.user = user;
        return next();
    } 
    catch (error) {
        // verify לכאן מגיע אם נכשל 
        return next({ msg: 'no premission',status:403 });
    }
}
export function premission(permission){
    return function (req, res, next){
        if(permission===req.user.role)
            {
            next();}
        else
            return next({status:403, msg:"dont have permission!"});
    }
}
