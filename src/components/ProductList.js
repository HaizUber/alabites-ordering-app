import React from 'react';

const ProductList = ({ filteredProducts, openModal }) => (
  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {filteredProducts.map(product => (
      <li key={product._id}>
        <a href="#" className="group block overflow-hidden" onClick={() => openModal(product)}>
          <img
            src={product.productPhotos[0]}
            alt={product.name}
            className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
          />
          <div className="relative bg-white pt-3">
            <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">{product.name}</h3>
            <p className="mt-2">
              <span className="sr-only">Regular Price</span>
              <span className="tracking-wider text-gray-900">{product.price} PHP</span>
            </p>
          </div>
        </a>
      </li>
    ))}
  </ul>
);

export default ProductList;
