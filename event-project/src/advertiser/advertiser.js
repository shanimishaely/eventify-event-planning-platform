import axios from "axios";

const itemsContainer = document.querySelector('.container');

// פונקציה לקבלת הפרסומות של המפרסם
const getAdvertisements = async () => {
    try{
     const userId = localStorage.getItem('userId');
     const token=localStorage.getItem('token');
    const url = `http://localhost:8000/user/watch/${userId}`; 
    console.log(token);
    const response = await axios.post(url,{},{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    
    const items=response.data;
    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item-card');
    
        // יצירת תוכן ה-HTML עבור כל פריט
        itemElement.innerHTML = `
            <div class="item-details">
             <img src="http://localhost:8000/public/${item.pic}">
                <h3>${item.name}</h3>
                <p><strong>קטגוריה:</strong> ${item.category}</p>
            </div>
                <button class="update-btn">עדכן</button>
                <button class="delete-btn">מחק</button>
           `;
           
           const updateButton = itemElement.querySelector('.update-btn');
           const deleteButton = itemElement.querySelector('.delete-btn');

           updateButton.addEventListener('click', () => updateAd(item));
           deleteButton.addEventListener('click', () => deleteAd(item.idOption));
           itemsContainer.appendChild(itemElement);
    });
    }
    catch(error){
        console.error('שגיאה בטעינת הפרסומות:', error);
     // הצגת הודעת שגיאה מפורטת ב-alert
        const errorMsg = displayError(error, 'אירעה שגיאה כללית בטעינת הפרסומות.');
        
        // הצגת הודעת שגיאה באזור התוכן
        itemsContainer.innerHTML = `<p>${errorMsg}</p>`;    }
}


async function updateAd(item) {
    try{
    // המרת האובייקט למחרוזת JSON
    const token=localStorage.getItem('token');
    const url = `http://localhost:8000/option/${item.idOption}`;
    const itemToUpdate=await axios.get(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    localStorage.setItem('itemToUpdate', JSON.stringify(itemToUpdate));
    // ניווט לדף הבא
    window.location.href = "../advertiseUpdate/advertiseUpdate.html";
    }
    catch(error){
        console.error('שגיאה בעדכון הפרסומת:', error);
        displayError(error, 'נכשל בעדכון נתוני הפרסומת.');
    }
}

async function  deleteAd(id)
{
    const userId = localStorage.getItem('userId');
    const token=localStorage.getItem('token');
    try {
        
        const url = `http://localhost:8000/option/${id}/${userId}`; 
        console.log(url);
    const response=await axios.delete(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    // אם המחיקה הצליחה (204 No Content), טען מחדש את הדף
    if (response.status === 204) {
        alert("הפרסומת נמחקה בהצלחה.");
    }
    window.location.reload();
    } catch (error) {
        console.error('שגיאה במחיקת הפרסומת:', error);
        displayError(error, 'שגיאה במחיקת הפרסומת. אנא נסה שוב.');
    }
    
}

const out=document.getElementById('home-btn');
out.addEventListener('click',()=>get_home());
async function get_home(){
    localStorage.removeItem('userId');
   localStorage.removeItem('token');
    window.location.href=".../index.html";
}


/**
 * פונקציית עזר להצגת הודעת שגיאה מפורטת מהשרת
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
             errorMessage = "שגיאה 404: המשאב המבוקש לא נמצא.";
        } else if (status === 401 || status === 403) {
             errorMessage = "שגיאת הרשאה: אינך מורשה לבצע פעולה זו.";
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


// טעינת הפרסומות עם כניסה לדף
document.addEventListener('DOMContentLoaded', getAdvertisements);