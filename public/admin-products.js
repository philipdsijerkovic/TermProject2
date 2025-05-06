document.querySelectorAll('.product').forEach(function(prodDiv) {
    const productId = prodDiv.getAttribute('data-product-id');
    prodDiv.querySelector('.save-btn').addEventListener('click', function() {
      const name = prodDiv.querySelector('h3 input').value;
      const description = prodDiv.querySelector('textarea').value;
      const category_id = prodDiv.querySelector('input[type="text"]').value;
      const image_url = prodDiv.querySelector('p input[type="text"]').value; 
      const price = parseFloat(prodDiv.querySelector('.price-input')?.value || 0); // Default to 0 if not found
      const featured = prodDiv.querySelector('.featured-input')?.checked ? 1 : 0; // 1 & 0 instea dof boolean
   // Gonna use fetch for the buttons
      fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products_name: name,
          products_description: description,
          products_category_id: category_id,
          products_image_url: image_url,
          products_price: price,
          featured: featured
        })
      })
      .then(res => res.json())
      .then(data => alert('Product updated!'))
      .catch(() => alert('Error updating product.'));
    });
    prodDiv.querySelector('.delete-btn').addEventListener('click', function() {
      fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
        alert('Product deleted!');
        prodDiv.remove();
      })
      .catch(() => alert('Error deleting product.'));
    });
  });