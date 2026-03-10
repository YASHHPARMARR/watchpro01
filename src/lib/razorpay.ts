export const initializeRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export const createRazorpayOrder = async (amount: number) => {
    // This would typically call a Next.js API route to create an order
    // const response = await fetch('/api/payment/razorpay', { method: 'POST', body: JSON.stringify({ amount }) });
    // return await response.json();

    // Placeholder for demonstration
    return {
        id: `order_${Math.random().toString(36).substr(2, 9)}`,
        amount: amount * 100, // paise
        currency: "INR"
    };
};
