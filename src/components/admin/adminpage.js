import React from 'react';
import AddProductForm from './addproductform';

const AdminPage = () => {
    const handleSubmit = async (formData) => {
        try {
          const response = await fetch('https://alabites-api.vercel.app/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
      
          if (!response.ok) {
            throw new Error('Failed to add product');
          }
      
          const data = await response.json();
          console.log(data); // Handle success response
          alert('Product added successfully'); // Provide feedback to the user
        } catch (error) {
          console.error('Error adding product:', error);
          alert('Failed to add product'); // Provide feedback to the user
        }
      };
      

  return (
    <div>
      <h2>Add New Product</h2>
      <AddProductForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AdminPage;
