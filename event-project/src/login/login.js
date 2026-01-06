import axios from "axios";


const login = async (event)=>{
event.preventDefault(); // Prevent default form submission
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

const data = {
    "email": email,
    "password":password
};

    try {
        const url=`http://localhost:8000/user`;
        const response = await axios.post(url, data);
        if (response.status === 200 || response.status === 201) {
            // התחברות מוצלחת
            alert("התחברת בהצלחה!");
            // שמירת הטוקן ב-localStorage
            const token=response.data.token;
            console.log(response.data)
            localStorage.setItem('token', token);
            localStorage.setItem('userId', response.data.userId);
            if(response.data.role==="user")
                window.location.href="../user/user.html"
            else
                window.location.href="../advertiser/advertiser.html"
        }
   
    } catch (error) {
        displayError(error, "ההתחברות נכשלה.");
        console.error('❌ שגיאה בהתחברות:', error);

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
        } else if (status === 401 || status === 404) {
             // 401: Unauthorized. 404: Not Found (לפעמים מוחזר במקום 401 למניעת חשיפת משתמשים)
             errorMessage = "מייל או סיסמה שגויים. אנא נסה שוב.";
        } else if (status === 400) {
            // שגיאות ולידציה או קלט לא חוקי
            errorMessage = "שגיאת קלט: אנא ודא שהנתונים שהזנת תקינים.";
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
    return errorMessage; // מחזיר את ההודעה לצורך הצגה ב-console.error
};


window.login=login;
