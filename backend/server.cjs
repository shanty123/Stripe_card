const express = require('express');
const cors = require('cors');
const stripe = require('stripe')('sk_test_51Qexg5JZKswcLc305UlXpokWTQ6bAVeGVoybfCHWXD1G1QxO19fBYjHcqNrherLrAWM0Dra5XzpBZLK6rOdIjMpl00st2MFCly');
const bodyParser = require('body-parser');

const app = express();


app.use(cors({
    origin: 'http://localhost:5174',
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type'],
}));


app.use(bodyParser.json());


app.post('/save-card', async (req, res) => {
    const { paymentMethodId, customerId } = req.body;

    try {

        const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
            customer: customerId,
        });

   
        await stripe.customers.update(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethod.id,
            },
        });

        res.json({ success: true, paymentMethod });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the Express server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
