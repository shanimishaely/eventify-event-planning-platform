import axios from 'axios'


const reg= async (event) =>{

event.preventDefault(); // Prevent default form submission

const userName = document.getElementById('userName').value;
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
const phone = document.getElementById('phone').value;
const role = document.getElementById('role').value;

const data = {
    "userName": userName,
    "email": email,
    "password":password,
    "phone": phone,
    "role":role
};
    try
    {
        const url=`http://localhost:8000/user/register`;
        const response = await axios.post(url, data);
        if (response.status === 201 || response.status === 200) {
            alert("ההרשמה הצליחה! אנא התחבר עם הפרטים החדשים.");
            window.location.href="../login/login.html"; 
        }
    }
    catch (error) {
        displayError(error, "ההרשמה נכשלה. נסה שוב.");
        
        // console.error('❌ שגיאה במהלך ההרשמה:', error);
        }
}


/**
 * פונקציית עזר להצגת הודעת שגיאה מפורטת מהשרת
 * @param {object} error - אובייקט השגיאה של Axios
 * @param {string} defaultMsg - הודעת ברירת המחדל
 */
const displayError = (error, defaultMsg = "אירעה שגיאה כללית. נסה שוב מאוחר יותר.") => {
    let errorMessage = defaultMsg;

    if (error.response) {
        const status = error.response.status;
        const serverError = error.response.data.error; // גישה לאובייקט השגיאה המוגדר בשרת

        if (serverError && serverError.message) {
            // שימוש בהודעת השגיאה המפורטת שהוגדרה בשרת
            errorMessage = `שגיאה (${status}): ${serverError.message}`;
        } else if (status === 400) {
            // שגיאות ולידציה או קלט לא חוקי
            errorMessage = "שגיאת קלט: אנא ודא שכל הפרטים שהזנת תקינים ומלאים.";
        } else if (status >= 500) {
            // שגיאות שרת פנימיות
            errorMessage = "שגיאת שרת פנימית. אנא נסה שוב מאוחר יותר.";
        }
    } else if (error.request) {
        // לא קיבלנו תגובה (רשת/שרת כבוי)
        errorMessage = "שגיאת רשת: לא ניתן להתחבר לשרת.";
    }

    // הצגת ההודעה המותאמת למשתמש
    alert(errorMessage);
    return errorMessage;
};
window.reg=reg
