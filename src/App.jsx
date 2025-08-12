import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Search, Filter, Star, X } from 'lucide-react';
import productData from './assets/pacad.json';
import logo from './assets/Logo.png';


const App = () => {
  [
      {
    id: 1,
    img: [logo],
    yulduz: 4.5,
    nom: "Gur Amir maqbarasi",
    narx: 25000
  }
  ]
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filterBy, setFilterBy] = useState({
    priceRange: [0, 3000],
    colors: [],
    minRating: 0
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const normalizedProducts = productData.map(product => ({
      ...product,
      rating: product.yulduz || product.stars || 0,
      images: product.img || []
    }));
    setProducts(normalizedProducts);
    setFilteredProducts(normalizedProducts);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(product =>
      product.price >= filterBy.priceRange[0] && product.price <= filterBy.priceRange[1]
    );

    filtered = filtered.filter(product => product.rating >= filterBy.minRating);

    if (filterBy.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.color && product.color.some(color => filterBy.colors.includes(color))
      );
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, sortBy, filterBy, products]);

  const renderStars = (rating) => {
    const maxStars = 5;
    const starValue = Math.round(rating / 200);
    return (
      <div className="flex items-center">
        {[...Array(maxStars)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < starValue ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
          
        ))}
        
        <span className="ml-1 text-sm text-gray-600">({starValue})
          <img src={logo} alt="Logo" className="inline-block w-4 h-4" />
        </span>
      </div>
      
    );
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.images[0] || "https://via.placeholder.com/300x200"}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {product.off && (
          <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
            -{product.off}%
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        
        <div className="mb-2">
          {renderStars(product.rating)}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-blue-600">${product.price}</span>
            {product.oldPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">
                ${product.oldPrice}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {product.color && product.color.slice(0, 3).map((color, index) => (
            <span
              key={index}
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          {product.color && product.color.length > 3 && (
            <span className="text-xs text-gray-500">+{product.color.length - 3}</span>
          )}
        </div>

        <button
          onClick={() => setSelectedProduct(product)}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );

  const ProductDetailModal = ({ product, onClose }) => {
    if (!product) return null;

    const hasDiscount = product.off && product.oldPrice;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <button
              onClick={onClose}
              className="float-right text-gray-500 hover:text-gray-700 text-2xl"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <div className="relative mb-4">
                  <img
                    src={product.images[currentImageIndex] || product.images[0] || "https://via.placeholder.com/400"}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentImageIndex(Math.min(product.images.length - 1, currentImageIndex + 1))}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
                
                {product.images.length > 1 && (
                  <div className="flex space-x-2">
                    {product.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt=""
                        className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${
                          index === currentImageIndex ? "border-blue-500" : "border-gray-200"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center mb-2">
                  {renderStars(product.rating)}
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.rating} reviews)
                  </span>
                </div>

                <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                  {product.name}
                </h1>

                <p className="text-gray-600 mb-4">{product.description}</p>

                {product.color && product.color.length > 0 && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-600 block mb-2">
                      Available Colors:
                    </span>
                    <div className="flex items-center space-x-2">
                      {product.color.map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer hover:border-blue-500"
                          style={{
                            backgroundColor: color === "silver" ? "#C0C0C0" : color,
                          }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-3xl font-semibold text-blue-600">
                    ${product.price}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ${product.oldPrice}
                      </span>
                      <span className="bg-yellow-400 text-black text-sm px-2 py-1 rounded">
                        {product.off}% OFF
                      </span>
                    </>
                  )}
                </div>

                {/* Quantity + Buttons */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center py-2 border-0 focus:outline-none"
                      />
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 flex items-center space-x-2">
                      <ShoppingCart className="w-4 h-4" />
                      <span>ADD TO CART</span>
                    </button>
                    <button className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
                      BUY NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get unique colors for filter
  const allColors = [...new Set(products.flatMap(p => p.color || []))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Product Store</h1>
          <p className="text-gray-600 mt-1">Discover amazing products at great prices</p>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name: A to Z</option>
            </select>

            {/* Price Range */}
            <select
              onChange={(e) => {
                const [min, max] = e.target.value.split('-').map(Number);
                setFilterBy({ ...filterBy, priceRange: [min, max] });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="0-3000">All Prices</option>
              <option value="0-100">Under $100</option>
              <option value="100-500">$100 - $500</option>
              <option value="500-1000">$500 - $1000</option>
              <option value="1000-3000">$1000+</option>
            </select>

            {/* Color Filter */}
            <select
              onChange={(e) => {
                const color = e.target.value;
                if (color === 'all') {
                  setFilterBy({ ...filterBy, colors: [] });
                } else {
                  setFilterBy({ ...filterBy, colors: [color] });
                }
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Colors</option>
              {allColors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal 
        product={selectedProduct} 
        onClose={() => {
          setSelectedProduct(null);
          setCurrentImageIndex(0);
          setQuantity(1);
        }} 
      />
    </div>
  );
};

export default App;
