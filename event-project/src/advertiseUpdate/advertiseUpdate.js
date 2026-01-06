import axios from "axios";
const messageElement = document.getElementById('message');
const advertisementForm = document.getElementById('advertisementForm');

/**
 * פונקציית עזר להצגת הודעת שגיאה מפורטת מהשרת
 * הערה: פונקציה זו הוספה כדי לאפשר טיפול עקבי בשגיאות
 * @param {object} error - אובייקט השגיאה של Axios
 * @param {string} defaultMsg - הודעת ברירת המחדל
 */
const displayError = (error, defaultMsg) => {
    let errorMessage = defaultMsg;

    if (error.response) {
        const status = error.response.status;
        const serverError = error.response.data.error; 

        if (serverError && serverError.message) {
            // שימוש בהודעת השגיאה המפורטת מהשרת
            errorMessage = `שגיאה (${status}): ${serverError.message}`;
        } else if (status === 404) {
             errorMessage = "שגיאה 404: הפרסומת או המשתמש לא נמצאו.";
        } else if (status === 400) {
             errorMessage = "שגיאת קלט: אנא בדוק את הפרטים שהזנת.";
        } else if (status === 401 || status === 403) {
             errorMessage = "שגיאת הרשאה: אינך מורשה לבצע עדכון זה.";
        } else if (status >= 500) {
            errorMessage = "שגיאת שרת פנימית. אנא נסה שוב מאוחר יותר.";
        }
    } else if (error.request) {
        errorMessage = "שגיאת רשת: לא ניתן להתחבר לשרת.";
    }

    // הצגת ההודעה
    alert(errorMessage);
    return errorMessage;
};



function getlocalstorage() {
    // קבלת האובייקט מ-localStorage
    const itemToUpdate = JSON.parse(localStorage.getItem('itemToUpdate'));

    if (itemToUpdate) {
        // מילוי השדות עם הנתונים מהאובייקט
        document.getElementById('name').value = itemToUpdate.data.name || '';
        document.getElementById('price').value = itemToUpdate.data.price || '';
        document.getElementById('street').value = itemToUpdate.data.address?.street || ''; // גישה בנויה לכתובת
        document.getElementById('city').value = itemToUpdate.data.address?.city || ''; // גישה בנויה לכתובת
        document.getElementById('pic').value = itemToUpdate.data.pic || '';
        document.getElementById('phone').value = itemToUpdate.data.phone || '';
        document.getElementById('description').value = itemToUpdate.data.description || '';
        document.getElementById('category').value = itemToUpdate.data.category||'';
        document.getElementById('location').value=itemToUpdate.data.local||'';
          

        // מילוי checkbox של אירועים מתאימים
        const eventArr = itemToUpdate.data.eventArr || [];
        document.querySelectorAll('input[name="eventArr"]').forEach((checkbox) => {
            checkbox.checked = eventArr.includes(checkbox.value);
        });
    }
}

async function advertiseUpdate() {
    const userId = localStorage.getItem('userId'); // הנח שאתה שומר את מזהה המשתמש בעוגיה
    const itemToUpdate = JSON.parse(localStorage.getItem('itemToUpdate'));
    const idtoupdate=itemToUpdate.data._id;
    const data = {
        name: document.getElementById('name').value,
        price: Number(document.getElementById('price').value),
        address: {
            street: document.getElementById('street').value,
            city: document.getElementById('city').value
        },
        pic: document.getElementById('pic').value,
        category: document.getElementById('category').value,
        phone: document.getElementById('phone').value,
        description: document.getElementById('description').value,
        local:document.getElementById('location').value,

        eventArr: Array.from(document.querySelectorAll('input[name="eventArr"]:checked')).map(c => c.value)
    };

    try {
        const token=localStorage.getItem('token');
        const url = `http://localhost:8000/option/${idtoupdate}/${userId}`; 
        const response = await axios.put(url, data,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            console.log('✅ הפרסום התעדכן בהצלחה!', response.data);
            alert("הפרסום התעדכן בהצלחה!");
            window.location.href = "../advertiser/advertiser.html"; // חזור לדף המפרסם
        }
    } catch (error) {
        console.error('❌ עדכון הפרסום נכשל:', error);
        displayError(error, "עדכון הפרסום נכשל, בדוק את הנתונים ונסה שוב.");    }
}

// להפעיל את הפונקציה לאחר שהדף נטען
document.addEventListener('DOMContentLoaded', getlocalstorage);
window.advertiseUpdate=advertiseUpdate;

