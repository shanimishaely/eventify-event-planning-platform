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


const getAllItems = async (selectedCategory = "all", selectedEventType = "all",selectLocation='all') => {
    try {
        const url = `http://localhost:8000/option`;
        const response = await axios.get(url);
        const items = response.data;

        // סינון הפריטים לפי קטגוריה וסוג אירוע נבחרים
        const filteredItems = items.filter(item => {
            const categoryMatch = selectedCategory === "all" || item.category === selectedCategory;
            const locationMatch = selectLocation === "all" || item.local === selectLocation;
            const eventTypeMatch = selectedEventType === "all" || item.eventArr.includes(selectedEventType);
            return categoryMatch && eventTypeMatch&&locationMatch;
        });

        itemsContainer.innerHTML = ''; // ניקוי הקונטיינר לפני הוספת פריטים
        if (filteredItems.length === 0) {
            itemsContainer.innerHTML = '<p>לא נמצאו פריטים להצגה.</p>';
            return;
        }

        filteredItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('item-card');
            itemElement.innerHTML = `
                <img src="http://localhost:8000/public/${item.pic}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p><strong>מחיר:</strong> ${item.price} ₪</p>
                    <p><strong>קטגוריה:</strong> ${item.category}</p>
                    <p><strong>מיקום:</strong> ${item.local}</p>
                    <p>${item.description}</p>
                </div>`;
            itemsContainer.appendChild(itemElement);
        });
        
        
    } catch (error) {
        displayError(error, "אירעה שגיאה בטעינת הפריטים.");
        console.error('❌ שגיאה בשליפת הפריטים:', error);
        itemsContainer.innerHTML = '<p>אירעה שגיאה בטעינת הפריטים.</p>';
    }
}



document.addEventListener('DOMContentLoaded', () => {
    getAllItems(); // טען את כל הפריטים בתחילה
});
