import axios from "axios";
const itemsContainer =document.querySelector('.items-display .container');


const getAllItems= async()=>{
    try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (!userId) {
        itemsContainer.innerHTML = '<p>אנא התחבר כדי לצפות ביומן שלך.</p>';
        return;
    }
        const url = `http://localhost:8000/user/watchd/${userId}`;
        const response=await axios.post(url,{},{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const items=response.data;
        if (items.length === 0) {
             itemsContainer.innerHTML = '<p>היומן שלך ריק, התחל למלא!.</p>';
             return;
        }
        console.log(items);
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item-card');
            // יצירת תוכן ה-HTML עבור כל פריט
            itemElement.innerHTML = `
                <img src="http://localhost:8000/public/${item.pic}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p><strong>מחיר:</strong> ${item.price} ₪</p>
                    <p><strong>קטגוריה:</strong> ${item.category}</p>
                  
                    <p>${item.description}</p>
                     <p>${item.phone}</p>
                     <button class="del-btn">מחק מהיומן </button>
                </div>`;
                 const delButton = itemElement.querySelector('.del-btn');
                 delButton.addEventListener('click', () => del_from_di(item));
                 itemsContainer.appendChild(itemElement);
        });
        
  }
   catch (error) {
         console.error('שגיאה בשליפת הפריטים:', error.massage);
        // itemsContainer.innerHTML = '<p>אירעה שגיאה בטעינת הפריטים. אנא נסה שוב מאוחר יותר.</p>';
        // יצירת אלמנט הודעה והצגה בתוכו
        const message = document.createElement('p');
        itemsContainer.innerHTML = ''; // מנקה את הקונטיינר
        itemsContainer.appendChild(message);
        displayError(error, message, 'אירעה שגיאה בטעינת היומן. נסה שוב מאוחר יותר.');
        }
}
async function del_from_di(item)
{
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (!userId) {
        alert("אינך מחובר. לא ניתן לבצע מחיקה.");
        return;
    }
    const url = `http://localhost:8000/user/${userId}/${item._id}`;
    try{
    const response=await axios.delete(url,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    alert("✅ הפריט נמחק בהצלחה מהיומן.");
    window.location.reload();
    }
    catch(error)
    {
        console.error('❌ נכשל במחיקה מהיומן:', error);
        displayError(error, 'alert', "המחיקה מהיומן נכשלה. אנא נסה שוב.");
    }
    
}
const ad=document.getElementById('adv');
ad.addEventListener('click',()=>get_back());
async function get_back(){
    window.location.href="../user/user.html";
}

document.addEventListener('DOMContentLoaded', getAllItems);


/**
 * פונקציית עזר להצגת הודעת שגיאה מפורטת מהשרת
 * @param {object} error - אובייקט השגיאה של Axios
 * @param {string|object} target - אלמנט ה-DOM (להצגה בתוך הדף) או String 'alert'
 * @param {string} defaultMsg - הודעת ברירת המחדל
 * @returns {string} - ההודעה הסופית שהוצגה (שימושי ל-DOM)
 */
const displayError = (error, target, defaultMsg = "אירעה שגיאה כללית. נסה שוב מאוחר יותר.") => {
    let errorMessage = defaultMsg;

    if (error.response) {
        const status = error.response.status;
        const serverError = error.response.data.error; 

        if (serverError && serverError.message) {
            errorMessage = `שגיאה (${status}): ${serverError.message}`;
        } else if (status === 401 || status === 403) {
             errorMessage = "שגיאת הרשאה: אנא התחבר מחדש או בדוק את ההרשאות שלך.";
        } else if (status === 400) {
            errorMessage = "שגיאת קלט: הפרטים ששלחת אינם תקינים.";
        } else if (status === 404) {
             errorMessage = "שגיאה 404: המשאב המבוקש לא נמצא.";
        } else if (status >= 500) {
            errorMessage = "שגיאת שרת פנימית. אנא נסה שוב מאוחר יותר.";
        }
    } else if (error.request) {
        errorMessage = "שגיאת רשת: לא ניתן להתחבר לשרת.";
    }

    // הצגת ההודעה בהתאם ליעד
    if (target === 'alert') {
        alert(errorMessage);
    } else if (target instanceof HTMLElement) {
        target.textContent = errorMessage;
        target.style.color = 'red';
    }
    return errorMessage; 
};
