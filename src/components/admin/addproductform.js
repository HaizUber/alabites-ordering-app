import React, { useState } from 'react';

const AddProductForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        store: '',
        category: '',
        image: '',
    });

    const handleChange = (e) => {
        if (e.target.type === 'file') {
            setFormData({ ...formData, image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.image) {
                console.error('Please select an image.');
                return;
            }

            const imageBase64 = await convertImageToBase64(formData.image);

            const formDataWithImage = {
                ...formData,
                image: '', // Clear the image field as we don't need it anymore
                photoReference: imageBase64 // Assign the base64-encoded image to photoReference
            };

            onSubmit(formDataWithImage); // Send form data to the backend
            console.log("data with image", formDataWithImage);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const convertImageToBase64 = (imageFile) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(imageFile);
        });
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
            <label>
                Image:
                <input type="file" accept="image/*" onChange={handleChange} />
            </label>
            <button type="submit">Add Product</button>
        </form>
    );
};

export default AddProductForm;
