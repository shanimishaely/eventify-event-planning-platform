 import axios from "axios";
const messageElement = document.getElementById('message');
const advertisementForm = document.getElementById('advertisementForm');
async function addAdvertise() {
  const userId = localStorage.getItem('userId');
  const token=localStorage.getItem('token');
  const data = {
    name: document.getElementById('name').value,
    price: Number(document.getElementById('price').value),
    address:{
      street:document.getElementById('street').value,
      city:document.getElementById('city').value
    },
    pic: document.getElementById('pic').files[0]?.name,
    category: document.getElementById('category').value,
    phone: document.getElementById('phone').value,
    local:document.getElementById('location').value,
    description: document.getElementById('description').value,
    eventArr: Array.from(document.querySelectorAll('input[name="eventArr"]:checked')).map(c => c.value)
  };
  
  try {
    const url = `http://localhost:8000/option/${userId}`;
    const response = await axios.post(url,data,{
      headers: {
          Authorization: `Bearer ${token}`
      }
  });
    if (response.status === 201) {
      console.log('✅ הפרסום נוסף בהצלחה!', response.data);
      alert("הפרסום נוסף בהצלחה!");
       window.location.href="../advertiser/advertiser.html"
    }
  } catch (error) {
    console.error('❌ שגיאה בהוספת הפרסום:', error);

    let errorMessage = "הוספת הפרסום נכשלה. אירעה שגיאה לא ידועה.";

    if (error.response) {
        const status = error.response.status;
        const serverError = error.response.data.error; // גישה לאובייקט השגיאה המוגדר בשרת

        if (serverError && serverError.message) {
            // שימוש בהודעת השגיאה המפורטת שהוגדרה בשרת (כמו 'Validation Error', 'Not Found')
            errorMessage = `שגיאה (${serverError.status || status}): ${serverError.message}`;
        } else if (status === 404) {
             // אם המשתמש לא נמצא (כפי שהוגדר בשרת ב-addOption)
             errorMessage = "שגיאה 404: המשתמש המפרסם לא נמצא.";
        } else if (status === 400) {
            // שגיאות ולידציה או קלט לא חוקי
            errorMessage = "שגיאת קלט: אנא בדוק את הפרטים שהזנת.";
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
  }
}
function previewImage(event) {
  // מקבלים את אלמנט התצוגה המקדימה של התמונה באמצעות ה-ID
  const imagePreview = document.getElementById('imagePreview');

  // מקבלים את הקובץ הראשון שנבחר על ידי המשתמש
  const file = event.target.files[0];

  // יוצרים מופע של FileReader כדי לקרוא את תוכן הקובץ
  const reader = new FileReader();

  // מגדירים פונקציה שתתבצע כאשר קובץ הוקרא בהצלחה
  reader.onload = function(e) {
    // מעדכנים את ה-src של התמונה בתצוגה המקדימה עם התמונה שנקראה
    imagePreview.src = e.target.result;
    
    // מציגים את התמונה בתצוגה המקדימה
    imagePreview.style.display = 'block';
  };

  // אם יש קובץ שנבחר, קוראים את תוכן הקובץ כ-Data URL
  if (file) {
    reader.readAsDataURL(file); // קורא את התמונה מרחבי הדיסק
  }
}
// לחשוף את הפונקציה ל־HTML
window.addAdvertise = addAdvertise;
