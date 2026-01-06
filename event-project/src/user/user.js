import axios from "axios";
const itemsContainer =document.querySelector('.items-display .container');

const categorySelect = document.getElementById('category');
const eventTypeSelect = document.getElementById('event-type');
const locationSelect=document.getElementById('location');
categorySelect.addEventListener('change', filterItems);
eventTypeSelect.addEventListener('change', filterItems);
locationSelect.addEventListener('change',filterItems);
function filterItems()
{
    
    const selectedCategory = categorySelect.value;
    const selectedEventType = eventTypeSelect.value;
    const selectLocation=locationSelect.value;
    getAllItems(selectedCategory, selectedEventType,selectLocation);

}

const getAllItems= async(selectedCategory = "all", selectedEventType = "all",selectLocation='all')=>{
    try {
        const url='http://localhost:8000/option';
        const token=localStorage.getItem('token');
        const response=await axios.get(url,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const items=response.data;

        const filteredItems = items.filter(item => {
            const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
            const locationMatch = selectLocation === "all" || item.local === selectLocation;
            const eventTypeMatch = selectedEventType === "all" || item.eventArr.includes(selectedEventType);
            return categoryMatch && eventTypeMatch&&locationMatch;
        });

        itemsContainer.innerHTML = '';
        if (filteredItems.length === 0) {
             itemsContainer.innerHTML = '<p>לא נמצאו פריטים להצגה.</p>';
             return;
        }

        filteredItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item-card');
            // יצירת תוכן ה-HTML עבור כל פריט
            itemElement.innerHTML = `
                <img src="http://localhost:8000/public/${item.pic}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p><strong>מחיר:</strong> ${item.price} ₪</p>
                    <p><strong>קטגוריה:</strong> ${item.category}</p>
                    <p><strong>מיקום:</strong> ${item.local}</p>
                    <p>${item.description}</p>
                     <p>${item.phone}</p>
                     <button class="add-btn">הוסף ליומן</button>
                </div>`;
                 const addButton = itemElement.querySelector('.add-btn');
                 addButton.addEventListener('click', () => add_to_di(item));
                 itemsContainer.appendChild(itemElement);
        });
        
  }
   catch (error) {
         console.error('שגיאה בשליפת הפריטים ❌:', error);
        //itemsContainer.innerHTML = '<p>אירעה שגיאה בטעינת הפריטים. אנא נסה שוב מאוחר יותר.</p>';
    // יצירת אלמנט הודעה והצגה בתוכו
        const message = document.createElement('p');
        itemsContainer.innerHTML = ''; // מנקה את הקונטיינר
        itemsContainer.appendChild(message);
        displayError(error, message, 'אירעה שגיאה בטעינת הפריטים. אנא נסה שוב מאוחר יותר.');
    }
}
async function add_to_di(item){
     const userId = localStorage.getItem('userId');
     const token=localStorage.getItem('token');
     const url = `http://localhost:8000/user/${userId}`;
     try {
        console.log(item)
        const response=await axios.post(url,item,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 201|| response.status === 200) {
            console.log(' הפריט נוסף בהצלחה ליומן!');
            alert('✅ הפריט נוסף בהצלחה ליומן!');}
     } catch (error) {
            console.error('❌ Failed to add advertisement:', error);
            displayError(error, 'alert', "הוספת הפריט ליומן נכשלה.");     }
    
}
document.addEventListener('DOMContentLoaded', () => {
    getAllItems(); // טען את כל הפריטים בתחילה
});
const mainbtn =document.getElementById('view-orders-btn');
mainbtn.addEventListener('click', () => get_my_dic());
async function get_my_dic(){
    window.location.href = "../userDic/userDic.html";
}
const out=document.getElementById('logout-btn');
out.addEventListener('click',()=>get_home());
async function get_home(){
   localStorage.clear();
    window.location.href=".../index.html";
}

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
             errorMessage = "שגיאה 404: המשאב לא נמצא.";
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