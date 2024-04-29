    import React, { useState } from 'react';

    const AddProductForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        store: '',
        category: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
        <label>
            Product Name:
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <label>
            Description:
            <input type="text" name="description" value={formData.description} onChange={handleChange} />
        </label>
        <label>
            Price:
            <input type="number" name="price" value={formData.price} onChange={handleChange} />
        </label>
        <label>
            Store:
            <input type="text" name="store" value={formData.store} onChange={handleChange} />
        </label>
        <label>
            Category:
            <input type="text" name="category" value={formData.category} onChange={handleChange} />
        </label>
        <button type="submit">Add Product</button>
        </form>
    );
    };

    export default AddProductForm;
