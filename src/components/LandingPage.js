import React, { useState, useEffect } from "react";
import Footer from '../components/footer.js';
import ProductModal from "../components/ProductModal";
import CartModal from "../components/CartModal";
import '../styles/LandingPage.css';

const LandingPage = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState({ minPrice: '', maxPrice: '' });
  const [availability, setAvailability] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const existingProductIndex = cartItems.findIndex(item => item.id === product.id);

    let updatedCartItems;
    if (existingProductIndex !== -1) {
      updatedCartItems = [...cartItems];
      updatedCartItems[existingProductIndex].quantity += product.quantity;
    } else {
      updatedCartItems = [...cartItems, product];
    }

    setCartItems(updatedCartItems);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://alabites-api.vercel.app/products");
        const data = await response.json();
        if (data.message === "success") {
          setProducts(data.data);
        } else {
          console.error("Failed to fetch products:", data.message);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, []);

    // Add logging to useEffect for debugging
    useEffect(() => {
      console.log("Current cart items inside:", cartItems);
    }, [cartItems]);
    
    useEffect(() => {
      // Save cart items to localStorage whenever it changes
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);
  
    useEffect(() => {
      // Load cart items from localStorage on component mount
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems'));
      if (storedCartItems) {
        setCartItems(storedCartItems);
      }
    }, []);

  useEffect(() => {
    applyFilters();
  }, [products, sortBy, priceRange, availability]);

  const applyFilters = () => {
    let filteredProducts = [...products];

    // Filter by availability
    if (availability === "In Stock") {
      filteredProducts = filteredProducts.filter(product => product.stock > 0);
    } else if (availability === "Out of Stock") {
      filteredProducts = filteredProducts.filter(product => product.stock === 0);
    }

    // Filter by price range
    filteredProducts = filteredProducts.filter(product => {
      const minPrice = parseFloat(priceRange.minPrice);
      const maxPrice = parseFloat(priceRange.maxPrice);
      return (!minPrice || product.price >= minPrice) && (!maxPrice || product.price <= maxPrice);
    });

    // Sort
    if (sortBy === "name, ASC") {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name, DESC") {
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "price, ASC") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price, DESC") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(filteredProducts);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePriceRangeChange = (event) => {
    setPriceRange({ ...priceRange, [event.target.name]: event.target.value });
  };

  const handleAvailabilityChange = (event) => {
    setAvailability(event.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters); // Toggle the visibility of filters
  };

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <section className="relative bg-[url(https://www.capgros.com/uploads/s1/10/48/04/1/istock-1053271298.jpeg)] bg-cover bg-center bg-no-repeat" style={{ height: '50vh' }}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-white/75 sm:bg-transparent sm:from-white/95 sm:to-white/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l blur" style={{ backdropFilter: 'blur(1px)' }}></div>

      {/* Hero section */}
      <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8" style={{ height: '50vh' }}>
        <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h1 className="text-3xl font-extrabold sm:text-5xl">
            Satisfy your cravings
            <strong className="block font-extrabold text-green-800"> with Alabites. </strong>
          </h1>

          <p className="mt-4 max-w-lg sm:text-xl/relaxed">
            Ordering your favorite R2K, Chef In Action, Graciously Food Cravings has never been faster only here on Alabites
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-center">
            <a
              href="#"
              className="block w-full rounded bg-green-800 px-12 py-3 text-sm font-medium text-white shadow hover:bg-yellow-500 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto"
            >
              Get Started
            </a>

            <a
              href="#"
              className="block w-full rounded bg-white px-12 py-3 text-sm font-medium text-green-800 shadow hover:text-yellow-500 focus:outline-none focus:ring active:text-rose-500 sm:w-auto"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Product Collection */}
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header>
          <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">Breakfast</h2>
          <p className="mt-4 max-w-md text-gray-500">
            Nothing Beats a great start of the day, go grab something to eat to boost your energy for the day!
          </p>
        </header>

        {/* Filters & Sorting */}
        <div className="mt-8 block lg:hidden">
          <button
            onClick={toggleFilters} // Toggle visibility on button click
            className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
          >
            <span className="text-sm font-medium">Filters & Sorting</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`size-4 ${showFilters ? 'rtl:rotate-180' : ''}`} // Rotate icon based on filter visibility
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          
          {showFilters && (
            <div className="mt-4">
              {/* Sort By */}
              <div className="bg-white p-4 rounded-lg shadow-lg mt-4">
                <label htmlFor="SortBy" className="block text-xs font-medium text-gray-700"> Sort By </label>
                <select
                  id="SortBy"
                  className="mt-1 rounded border-gray-300 text-sm"
                  onChange={handleSortChange}
                  value={sortBy}
                >
                  <option value="">Sort By</option>
                  <option value="price, ASC">Price, Low to High</option>
                  <option value="price, DESC">Price, High to Low</option>
                  <option value="name, ASC">Name, A to Z</option>
                  <option value="name, DESC">Name, Z to A</option>
                </select>
              </div>

              {/* Filter by Price Range */}
              <div className="bg-white p-4 rounded-lg shadow-lg mt-4">
                <label htmlFor="minPrice" className="block text-xs font-medium text-gray-700"> Min Price </label>
                <input
                  type="number"
                  id="minPrice"
                  name="minPrice"
                  value={priceRange.minPrice}
                  onChange={handlePriceRangeChange}
                  className="mt-1 rounded border-gray-300 text-sm"
                  placeholder="Min Price"
                />
                <label htmlFor="maxPrice" className="block text-xs font-medium text-gray-700"> Max Price </label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  value={priceRange.maxPrice}
                  onChange={handlePriceRangeChange}
                  className="mt-1 rounded border-gray-300 text-sm"
                  placeholder="Max Price"
                />
              </div>

              {/* Availability */}
              <div className="bg-white p-4 rounded-lg shadow-lg mt-4">
                <label htmlFor="Availability" className="block text-xs font-medium text-gray-700"> Availability </label>
                <select
                  id="Availability"
                  className="mt-1 rounded border-gray-300 text-sm"
                  onChange={handleAvailabilityChange}
                  value={availability}
                >
                  <option value="">All</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
          {/* Sort By */}
          <div className="hidden space-y-4 lg:block">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <label htmlFor="SortBy" className="block text-xs font-medium text-gray-700"> Sort By </label>
              <select
                id="SortBy"
                className="mt-1 rounded border-gray-300 text-sm"
                onChange={handleSortChange}
                value={sortBy}
              >
                <option value="">Sort By</option>
                <option value="price, ASC">Price, Low to High</option>
                <option value="price, DESC">Price, High to Low</option>
                <option value="name, ASC">Name, A to Z</option>
                <option value="name, DESC">Name, Z to A</option>
              </select>
            </div>

            {/* Filter by Price Range */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <label htmlFor="minPrice" className="block text-xs font-medium text-gray-700"> Min Price </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                value={priceRange.minPrice}
                onChange={handlePriceRangeChange}
                className="mt-1 rounded border-gray-300 text-sm"
                placeholder="Min Price"
              />
              <label htmlFor="maxPrice" className="block text-xs font-medium text-gray-700"> Max Price </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={priceRange.maxPrice}
                onChange={handlePriceRangeChange}
                className="mt-1 rounded border-gray-300 text-sm"
                placeholder="Max Price"
              />
            </div>

            {/* Availability */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
            <label htmlFor="Availability" className="block text-xs font-medium text-gray-700"> Availability </label>
              <select
                id="Availability"
                className="mt-1 rounded border-gray-300 text-sm"
                onChange={handleAvailabilityChange}
                value={availability}
              >
                <option value="">All</option>
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

{/* Product Listing */}
<div className="lg:col-span-3">
  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {/* Map through filtered products and render each product */}
    {filteredProducts.map(product => (
      <li key={product._id}>
        <a href="#" className="group block overflow-hidden" onClick={() => openModal(product)}>
          {/* Product image */}
          <img src={product.productPhotos[0]} alt={product.name} className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]" />
          
          {/* Product details */}
          <div className="relative bg-white pt-3">
            <h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">{product.name}</h3>
            <p className="mt-2">
              <span className="sr-only"> Regular Price </span>
              <span className="tracking-wider text-gray-900">{product.price} PHP</span>
            </p>
          </div>
        </a>
      </li>
    ))}
  </ul>
</div>

{/* Product Modal */}
{selectedProduct && (
  <ProductModal product={selectedProduct} onClose={closeModal} addToCart={addToCart} />
)}
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default LandingPage;

