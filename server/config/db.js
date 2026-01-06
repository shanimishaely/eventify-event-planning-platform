import mongoose from 'mongoose';

export async function connectDB(dbname) {
    try {
        // אם הדטהבייס קיים - מתחבר אליו
        // אחרת - יוצר חדש
     const DB_URI = `mongodb://localhost:27017/${dbname}`;
        await mongoose.connect(DB_URI);
        console.log('mongo connected succesfuly');
    } catch (error) {
        console.log('ERROR', error.message);
    }
}