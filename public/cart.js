let total = 0 // total variable for the functions

function increaseQuantity(button) {
    const input = button.previousElementSibling; // Input is above the button in my html, so I call it this way
    input.value = parseInt(input.value) + 1; // Increment the value
}

function decreaseQuantity(button) {
    const input = button.nextElementSibling; // Input is below the button in my html, so I call it this way
    input.value = parseInt(input.value) - 1; // Decrement the value
}





