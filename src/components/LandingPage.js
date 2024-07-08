import React, { useState, useEffect } from "react";
import Footer from '../components/footer.js';
import ProductModal from "../components/ProductModal";
import CartModal from "../components/CartModal";
import FilterSort from "../components/FilterSort";
import ProductList from "../components/ProductList";
import { useNavigate } from "react-router-dom";
import '../styles/LandingPage.css';


const LandingPage = ({ cartItems, setCartItems }) => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("");
  const [priceRange, setPriceRange] = useState({ minPrice: '', maxPrice: '' });
  const [availability, setAvailability] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

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
        if (response.ok) {
          setProducts(data.data);
        } else {
          throw new Error("Failed to fetch products.");
        }
      } catch (error) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, sortBy, priceRange, availability, searchQuery]);

  const applyFilters = () => {
    let filteredProducts = [...products];

    if (availability === "In Stock") {
      filteredProducts = filteredProducts.filter(product => product.stock > 0);
    } else if (availability === "Out of Stock") {
      filteredProducts = filteredProducts.filter(product => product.stock === 0);
    }

    filteredProducts = filteredProducts.filter(product => {
      const minPrice = parseFloat(priceRange.minPrice);
      const maxPrice = parseFloat(priceRange.maxPrice);
      return (!minPrice || product.price >= minPrice) && (!maxPrice || product.price <= maxPrice);
    });

    if (sortBy === "name, ASC") {
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name, DESC") {
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "price, ASC") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price, DESC") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating, DESC") {
      filteredProducts.sort((a, b) => b.averageRatingValue - a.averageRatingValue);
    } else if (sortBy === "newest") {
      filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      filteredProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (searchQuery) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <section className="relative bg-[url(https://www.capgros.com/uploads/s1/10/48/04/1/istock-1053271298.jpeg)] bg-cover bg-center bg-no-repeat" style={{ height: '50vh' }}>
      <div className="absolute inset-0 bg-white/75 sm:bg-transparent sm:from-white/95 sm:to-white/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l blur" style={{ backdropFilter: 'blur(1px)' }}></div>
      <div className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8" style={{ height: '50vh' }}>
        <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
          <h1 className="text-3xl font-extrabold sm:text-5xl text-gray-900">
            Satisfy your cravings
            <strong className="block font-extrabold text-green-800"> with Alabites. </strong>
          </h1>
          <p className="mt-4 max-w-lg sm:text-xl text-gray-700">
            Ordering your favorite meals has never been faster - only here on Alabites.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a href="/login/student" className="block w-full rounded bg-green-800 px-8 py-3 text-sm font-medium text-white shadow-lg hover:bg-yellow-500 focus:outline-none focus:ring active:bg-rose-500 sm:w-auto">
              Get Started
            </a>
            <a href="/help-center" className="block w-full rounded bg-white px-8 py-3 text-sm font-medium text-green-800 shadow-lg hover:text-yellow-500 focus:outline-none focus:ring active:text-rose-500 sm:w-auto mt-4 sm:mt-0">
              Learn More
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Menu</h2>
          <p className="mt-4 max-w-md text-gray-700">
            Explore our vast menu of delicious food!
          </p>
        </header>

        <div className="mt-8 block lg:hidden">
          <button
            onClick={toggleFilters}
            className="flex items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600 focus:outline-none"
          >
            <span className="text-sm font-medium">Filters & Sorting</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`h-4 w-4 ${showFilters ? 'transform rotate-180' : ''}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {showFilters && (
            <FilterSort
              sortBy={sortBy}
              handleSortChange={handleSortChange}
              priceRange={priceRange}
              handlePriceRangeChange={handlePriceRangeChange}
              availability={availability}
              handleAvailabilityChange={handleAvailabilityChange}
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
            />
          )}
        </div>

        <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="hidden lg:block">
            <FilterSort
              sortBy={sortBy}
              handleSortChange={handleSortChange}
              priceRange={priceRange}
              handlePriceRangeChange={handlePriceRangeChange}
              availability={availability}
              handleAvailabilityChange={handleAvailabilityChange}
              searchQuery={searchQuery}
              handleSearchChange={handleSearchChange}
            />
          </div>

          <div className="lg:col-span-3">
            <ProductList filteredProducts={filteredProducts} openModal={openModal} />
          </div>

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
