



document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const messageElement = document.getElementById('message');

    orderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // בדיקה האם יש טוקן (אימות שהמשתמש מחובר)
        const userToken = localStorage.getItem('userToken');
        if (!userToken) {
            messageElement.textContent = 'אינך מחובר. אנא התחבר כדי להוסיף הזמנה.';
            messageElement.style.color = 'red';
            // window.location.href = 'login.html'; 
            return;
        }

        const formData = new FormData(orderForm);
        const data = {
            id: formData.get('orderId'),
            name: formData.get('orderName'),
            price: Number(formData.get('orderPrice')),
            phone: formData.get('orderPhone')
        };
        
        try {
            // נקודת הקצה (endpoint) בצד השרת צריכה להיות מותאמת
            const url = 'http://localhost:4000/user/add-order'; // דוגמה לכתובת
            
            const response = await axios.post(url, data, {
                headers: {
                    'Authorization': `Bearer ${userToken}`
                }
            });

            if (response.status === 201) {
                messageElement.textContent = 'ההזמנה נוספה בהצלחה ליומן!';
                messageElement.style.color = 'green';
                orderForm.reset(); 
            }
        } catch (error) {
            console.error('Failed to add order:', error);
            const errorMessage = error.response?.data?.message || 'הוספת ההזמנה נכשלה. נסה שוב.';
            messageElement.textContent = errorMessage;
            messageElement.style.color = 'red';
        }
    });
});