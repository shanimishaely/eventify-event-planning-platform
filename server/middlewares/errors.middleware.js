import express from "express";


/**
 * 
 * @param {express.Request} req 
 * @param {*} res 
 * @param {*} next 
 */
export const urlNotFound = (req, res, next) => {
    next({
        status: 404,
        type:'not found',
        msg: `url not found (${req.url}, method: ${req.method})`
    });
};

/**
 * מידלוואר שמטפל בשגיאות
 * @param {{ status?:number, type?:string, msg:string }} err 
 * @param {express.Request} req 
 * @param {*} res 
 * @param {*} next 
 */
export const errorHandler = (err, req, res, next) => {
    const error1 = {
        message: err.msg ||"server",
        type: err.type || 'Server Error',
        status :err.status || 500   
    };
    res.status(err.status||500).json({ error: error1});
};