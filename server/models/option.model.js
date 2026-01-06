import  Joi  from 'joi';
import {model,Schema } from 'mongoose'

const optionSchema=new Schema({
    name: String,
    price: Number,
    address:{
        street: String,
        city: String
    },
    pic: String,
    eventArr:[String],
    category: String ,
    phone: String,
    description: String,
    local:String
});
export const validOption= {
    valid: Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required(),
        address: Joi.object({
            street: Joi.string().required(),
            city: Joi.string().required()
        }).required(),
        pic: Joi.string().required(),
        eventArr: Joi.array().items(Joi.string()),
        category: Joi.string().required(),
        phone: Joi.string().required(),
        description: Joi.string().required(),
        local:Joi.string().required()
    })
}

const Option=model('options',optionSchema);
export default Option;