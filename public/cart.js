let total = 0 // total variable for the functions

document.querySelectorAll('.cart-item').forEach(function(cartDiv) {
    const cartId = 1; // for demo
    const productId = cartDiv.getAttribute('data-product-id'); // I used data-product-id as the attribute for a bunch of buttons
    cartDiv.querySelector('.remove-btn').addEventListener('click', function() { // on click for the remove button
      fetch(`/api/cart/${cartId}/product/${productId}`, {
        method: 'DELETE'
      })
      .then(res => res.json()) // get the response from the server
      .then(data => { // give the message and then remove it from the cart
        alert('Item removed from cart!');
        cartDiv.remove();
      })
      .catch(() => alert('Error removing item from cart.')); // bad response
    }); 
  });

  document.querySelectorAll('.add-to-cart-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const productId = btn.getAttribute('data-product-id');
      const cartId = 1; // or get dynamically if needed
      let quantity = 1; // default quantity, didn't wanna mess with the input field for this demo
  
      fetch(`/api/cart/${cartId}/product/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: quantity })
      })
      .then(res => res.json())
      .then(data => {
        alert('Item added to cart!');
      })
      .catch(() => alert('Error adding item to cart.'));
    });
  });

  document.querySelectorAll('.checkout-button').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const cartId = 1; 
      fetch(`/api/cart/${cartId}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
        alert('Checkout complete! Your cart is now empty.');
        document.querySelectorAll('.cart-item').forEach(item => item.remove());
        // Update the total underneath
        const totalPrice = document.getElementById('total-price');
        if (totalPrice) totalPrice.textContent = '$0.00 + delivery fees';
      })
      .catch(() => alert('Error during checkout.'));
    });
  });