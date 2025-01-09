<script>
    import { onMount } from 'svelte';
    import { loadStripe } from '@stripe/stripe-js';

    let stripe, elements, cardElement;

    onMount(async () => {
        stripe = await loadStripe('pk_test_51Qexg5JZKswcLc30xEe0V0bd0rSnJ8o5uzDf9zQbdjqY2U6drW5gR89kYbbcsAavot3y5pBN2wlGZVVIWUFB0bvw00jKmv3UjW');
        elements = stripe.elements();

        // Create the card element
        cardElement = elements.create('card');
        cardElement.mount('#card-element');
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a payment method using Stripe Elements
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error(error);
        } else {
            console.log('Payment method created:', paymentMethod);

            // Send the paymentMethod.id and customerId to your backend to save the card
            const response = await fetch('http://localhost:3000/save-card', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    customerId: 'cus_RY5UnxvmKT8H2D', // Replace with actual Stripe customer ID
                }),
            });

            const data = await response.json();
            if (data.success) {
                console.log('Card successfully saved!');
            } else {
                console.log('Error saving card:', data.error);
            }
        }
    };
</script>

<div>
    <form on:submit={handleSubmit}>
        <div id="card-element"></div>
        <button type="submit">Add Card</button>
    </form>
</div>
