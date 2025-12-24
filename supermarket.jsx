// Icons will be loaded from index.html
const { useState, useEffect } = React;

const SupermarketManagementSystem = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Default data
  const defaultProducts = [
    { id: 1, name: 'Rice 5kg', barcode: '8901234567890', category: 'Grains', costPrice: 450, sellingPrice: 650, stock: 45, reorderLevel: 10, supplier: 'Grain Traders Ltd' },
    { id: 2, name: 'Cooking Oil 2L', barcode: '8901234567891', category: 'Oils', costPrice: 280, sellingPrice: 380, stock: 8, reorderLevel: 15, supplier: 'Oil Distributors' },
    { id: 3, name: 'Sugar 1kg', barcode: '8901234567892', category: 'Sweeteners', costPrice: 95, sellingPrice: 135, stock: 120, reorderLevel: 20, supplier: 'Sugar Corp' },
    { id: 4, name: 'Milk 1L', barcode: '8901234567893', category: 'Dairy', costPrice: 55, sellingPrice: 80, stock: 5, reorderLevel: 25, supplier: 'Dairy Fresh' },
    { id: 5, name: 'Bread Loaf', barcode: '8901234567894', category: 'Bakery', costPrice: 35, sellingPrice: 55, stock: 30, reorderLevel: 10, supplier: 'Local Bakery' },
    { id: 6, name: 'Tea 250g', barcode: '8901234567895', category: 'Beverages', costPrice: 180, sellingPrice: 250, stock: 60, reorderLevel: 15, supplier: 'Tea Corp' },
  ];
  
  const defaultSuppliers = [
    { id: 1, name: 'Grain Traders Ltd', contact: '+254712345678', email: 'info@graintraders.co.ke', products: 15 },
    { id: 2, name: 'Oil Distributors', contact: '+254723456789', email: 'sales@oildist.co.ke', products: 8 },
    { id: 3, name: 'Sugar Corp', contact: '+254734567890', email: 'orders@sugarcorp.co.ke', products: 5 },
    { id: 4, name: 'Dairy Fresh', contact: '+254745678901', email: 'contact@dairyfresh.co.ke', products: 12 },
  ];

  const defaultSales = [
    { id: 1, date: '2025-11-10', time: '10:30', items: 3, total: 265, profit: 85, customer: 'Walk-in', paymentMethod: 'Cash', cashier: 'Admin', itemDetails: [] },
    { id: 2, date: '2025-11-10', time: '11:15', items: 5, total: 580, profit: 180, customer: 'Walk-in', paymentMethod: 'M-Pesa', cashier: 'Admin', itemDetails: [] },
    { id: 3, date: '2025-11-09', time: '14:20', items: 2, total: 435, profit: 140, customer: 'John Doe', paymentMethod: 'Card', cashier: 'Admin', itemDetails: [] },
    { id: 4, date: '2025-11-09', time: '16:45', items: 7, total: 890, profit: 295, customer: 'Jane Smith', paymentMethod: 'Cash', cashier: 'Admin', itemDetails: [] },
  ];

  const defaultCustomers = [
    { id: 1, name: 'John Doe', phone: '+254700111222', email: 'john@email.com', points: 450, totalSpent: 12500 },
    { id: 2, name: 'Jane Smith', phone: '+254700333444', email: 'jane@email.com', points: 780, totalSpent: 23400 },
    { id: 3, name: 'Bob Wilson', phone: '+254700555666', email: 'bob@email.com', points: 320, totalSpent: 8900 },
  ];

  // Initialize state with localStorage or defaults
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('supermarket_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });
  
  const [suppliers, setSuppliers] = useState(() => {
    const saved = localStorage.getItem('supermarket_suppliers');
    return saved ? JSON.parse(saved) : defaultSuppliers;
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem('supermarket_sales');
    return saved ? JSON.parse(saved) : defaultSales;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('supermarket_customers');
    return saved ? JSON.parse(saved) : defaultCustomers;
  });

  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastReceipt, setLastReceipt] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const users = [
    { username: 'admin', password: 'admin123', role: 'Admin', name: 'Store Manager' },
    { username: 'cashier', password: 'cashier123', role: 'Cashier', name: 'Sales Assistant' }
  ];

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('supermarket_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('supermarket_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('supermarket_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('supermarket_customers', JSON.stringify(customers));
  }, [customers]);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === loginForm.username && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginForm({ username: '', password: '' });
    } else {
      alert('Invalid credentials! Try: admin/admin123 or cashier/cashier123');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
    setCart([]);
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity < product.stock) {
        setCart(cart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        alert('Cannot add more than available stock!');
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else if (newQuantity <= product.stock) {
      setCart(cart.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    } else {
      alert('Cannot exceed available stock!');
    }
  };

  const completeSale = () => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
    const cost = cart.reduce((sum, item) => sum + (item.costPrice * item.quantity), 0);
    const profit = total - cost;
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const updatedProducts = products.map(product => {
      const cartItem = cart.find(item => item.id === product.id);
      return cartItem ? { ...product, stock: product.stock - cartItem.quantity } : product;
    });
    setProducts(updatedProducts);

    const pointsEarned = Math.floor(total / 10);

    if (selectedCustomer) {
      setCustomers(customers.map(c => 
        c.id === selectedCustomer.id 
          ? { ...c, points: c.points + pointsEarned, totalSpent: c.totalSpent + total }
          : c
      ));
    }

    const newSale = {
      id: sales.length + 1,
      date: new Date().toISOString().split('T')[0],
      time: currentTime,
      items: cart.reduce((sum, item) => sum + item.quantity, 0),
      total: total,
      profit: profit,
      customer: selectedCustomer ? selectedCustomer.name : 'Walk-in',
      paymentMethod: paymentMethod,
      cashier: currentUser.name,
      itemDetails: [...cart]
    };
    setSales([newSale, ...sales]);

    setLastReceipt({
      ...newSale,
      pointsEarned,
      customerPoints: selectedCustomer ? selectedCustomer.points + pointsEarned : 0
    });
    setShowReceipt(true);
    setCart([]);
    setSelectedCustomer(null);
  };

  const scanBarcode = () => {
    const product = products.find(p => p.barcode === barcodeInput);
    if (product) {
      if (product.stock > 0) {
        addToCart(product);
        setBarcodeInput('');
      } else {
        alert('Product out of stock!');
      }
    } else {
      alert('Product not found!');
    }
  };

  const exportToCSV = (data, filename) => {
    const headers = Object.keys(data[0]).filter(k => k !== 'itemDetails').join(',');
    const rows = data.map(obj => 
      Object.entries(obj).filter(([k]) => k !== 'itemDetails').map(([, v]) => v).join(',')
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const printReceipt = () => window.print();

  const deleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const saveProduct = (productData) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...productData, id: editingProduct.id } : p));
    } else {
      setProducts([...products, { ...productData, id: Math.max(...products.map(p => p.id)) + 1 }]);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const deleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const saveCustomer = (customerData) => {
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? { ...customerData, id: editingCustomer.id } : c));
    } else {
      setCustomers([...customers, { ...customerData, id: Math.max(...customers.map(c => c.id)) + 1, points: 0, totalSpent: 0 }]);
    }
    setShowCustomerForm(false);
    setEditingCustomer(null);
  };

  const lowStockItems = products.filter(p => p.stock <= p.reorderLevel);
  const todaySales = sales.filter(s => s.date === new Date().toISOString().split('T')[0]);
  const todayRevenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const todayProfit = todaySales.reduce((sum, s) => sum + s.profit, 0);
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.sellingPrice * p.stock), 0);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <ShoppingCart className="text-blue-600" size={48} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Supermarket Manager</h1>
            <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Enter password"
                required
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              Sign In
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 font-semibold mb-2">Demo Credentials:</p>
            <p className="text-xs text-gray-600">Admin: admin / admin123</p>
            <p className="text-xs text-gray-600">Cashier: cashier / cashier123</p>
          </div>
        </div>
      </div>
    );
  }

  const ReceiptModal = () => {
    if (!showReceipt || !lastReceipt) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
          <div className="p-6">
            <div className="text-center border-b-2 border-dashed pb-4 mb-4">
              <h2 className="text-2xl font-bold">SUPERMARKET</h2>
              <p className="text-sm text-gray-600">Tax Invoice</p>
              <p className="text-xs text-gray-500 mt-1">PIN: P051234567X</p>
            </div>

            <div className="space-y-1 text-sm mb-4">
              <p><strong>Receipt:</strong> #{lastReceipt.id}</p>
              <p><strong>Date:</strong> {lastReceipt.date}</p>
              <p><strong>Time:</strong> {lastReceipt.time}</p>
              <p><strong>Cashier:</strong> {lastReceipt.cashier}</p>
              <p><strong>Customer:</strong> {lastReceipt.customer}</p>
            </div>

            <div className="border-t border-b py-3 mb-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Item</th>
                    <th className="text-center pb-2">Qty</th>
                    <th className="text-right pb-2">Price</th>
                    <th className="text-right pb-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lastReceipt.itemDetails && lastReceipt.itemDetails.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-1">{item.name}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-right">{item.sellingPrice}</td>
                      <td className="text-right">{(item.sellingPrice * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-1 text-sm mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>KES {lastReceipt.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>TOTAL:</span>
                <span>KES {lastReceipt.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment:</span>
                <span>{lastReceipt.paymentMethod}</span>
              </div>
            </div>

            {lastReceipt.customer !== 'Walk-in' && (
              <div className="bg-green-50 p-3 rounded mb-4">
                <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
                  <Gift size={16} /> Loyalty Points
                </p>
                <p className="text-xs text-green-700">Earned: {lastReceipt.pointsEarned} points</p>
                <p className="text-xs text-green-700">Total: {lastReceipt.customerPoints} points</p>
              </div>
            )}

            <div className="text-center border-t-2 border-dashed pt-4 text-xs text-gray-600">
              <p className="font-semibold">Thank you for shopping with us!</p>
              <p className="mt-1">Keep this receipt for returns</p>
            </div>
          </div>

          <div className="flex gap-2 p-4 border-t bg-gray-50">
            <button
              onClick={printReceipt}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700"
            >
              <Printer size={18} />
              Print
            </button>
            <button
              onClick={() => setShowReceipt(false)}
              className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DashboardView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today Revenue</p>
              <p className="text-2xl font-bold text-gray-800">KES {todayRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">{todaySales.length} transactions</p>
            </div>
            <DollarSign className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today Profit</p>
              <p className="text-2xl font-bold text-gray-800">KES {todayProfit.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">{todayRevenue > 0 ? ((todayProfit/todayRevenue)*100).toFixed(1) : 0}% margin</p>
            </div>
            <TrendingUp className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-800">KES {totalInventoryValue.toFixed(0)}</p>
              <p className="text-xs text-gray-500 mt-1">{products.length} products</p>
            </div>
            <Package className="text-purple-500" size={32} />
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-800">{lowStockItems.length}</p>
              <p className="text-xs text-gray-500 mt-1">Need reorder</p>
            </div>
            <AlertCircle className="text-orange-500" size={32} />
          </div>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 mr-3 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Low Stock Alert</h3>
              <ul className="text-sm text-red-700 space-y-1">
                {lowStockItems.map(item => (
                  <li key={item.id}>{item.name} - Only {item.stock} units left (Reorder: {item.reorderLevel})</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Sales</h3>
          <button 
            onClick={() => exportToCSV(sales, 'sales-report.csv')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Time</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Customer</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Items</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Total</th>
                <th className="px-4 py-2 text-left text-sm font-semibold">Payment</th>
              </tr>
            </thead>
            <tbody>
              {sales.slice(0, 10).map(sale => (
                <tr key={sale.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{sale.date}</td>
                  <td className="px-4 py-2 text-sm">{sale.time}</td>
                  <td className="px-4 py-2 text-sm">{sale.customer}</td>
                  <td className="px-4 py-2 text-sm">{sale.items}</td>
                  <td className="px-4 py-2 text-sm font-semibold text-green-600">KES {sale.total.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm">{sale.paymentMethod}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const POSView = () => {
    const cartTotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Point of Sale</h2>
          
          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Scan barcode"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && scanBarcode()}
                className="px-4 py-2 border rounded-lg w-40"
              />
              <button onClick={scanBarcode} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700">
                <Barcode size={20} />
                Scan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-2">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                onClick={() => product.stock > 0 && addToCart(product)}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  product.stock > 0 
                    ? 'hover:bg-blue-50 hover:border-blue-300 hover:shadow-md' 
                    : 'opacity-50 cursor-not-allowed bg-gray-50'
                }`}
              >
                <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                <p className="text-lg font-bold text-blue-600">KES {product.sellingPrice}</p>
                <p className={`text-xs ${product.stock <= product.reorderLevel ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                  Stock: {product.stock}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg h-fit sticky top-4">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShoppingCart size={24} />
            Shopping Cart
          </h3>
          
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Cart is empty</p>
          ) : (
            <>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">KES {item.sellingPrice} each</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >-</button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={item.quantity >= item.stock}
                      >+</button>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-red-500 font-bold text-lg"
                      >×</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Customer (Optional)</label>
                <select
                  value={selectedCustomer?.id || ''}
                  onChange={(e) => {
                    const cust = customers.find(c => c.id === parseInt(e.target.value));
                    setSelectedCustomer(cust || null);
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Walk-in Customer</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.points} pts)</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: 'Cash', icon: Banknote },
                    { name: 'Card', icon: CreditCard },
                    { name: 'M-Pesa', icon: Smartphone }
                  ].map(({ name, icon: Icon }) => (
                    <button
                      key={name}
                      onClick={() => setPaymentMethod(name)}
                      className={`py-2 px-3 rounded-lg border text-sm flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === name ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} />
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>TOTAL:</span>
                  <span>KES {cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={completeSale}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Complete Sale
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const ProductsView = () => {
    const ProductForm = ({ product, onSave, onCancel }) => {
      const [formData, setFormData] = useState(product || {
        name: '', barcode: '', category: '', costPrice: 0, sellingPrice: 0, stock: 0, reorderLevel: 10, supplier: ''
      });

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{product ? 'Edit Product' : 'Add New Product'}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Barcode</label>
                <input
                  type="text"
                  value={formData.barcode}
                  onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cost Price (KES)</label>
                <input
                  type="number"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({...formData, costPrice: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Selling Price (KES)</label>
                <input
                  type="number"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({...formData, sellingPrice: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reorder Level</label>
                <input
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({...formData, reorderLevel: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => onSave(formData)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Save Product
              </button>
              <button 
                onClick={onCancel}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
          <button 
            onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {showProductForm && (
          <ProductForm 
            product={editingProduct}
            onSave={saveProduct}
            onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
          />
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Barcode</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Cost</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Stock</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Supplier</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{product.name}</td>
                    <td className="px-4 py-3 text-sm">{product.barcode}</td>
                    <td className="px-4 py-3 text-sm">{product.category}</td>
                    <td className="px-4 py-3 text-sm">KES {product.costPrice}</td>
                    <td className="px-4 py-3 text-sm font-semibold">KES {product.sellingPrice}</td>
                    <td className={`px-4 py-3 text-sm ${product.stock <= product.reorderLevel ? 'text-red-600 font-semibold' : ''}`}>
                      {product.stock}
                    </td>
                    <td className="px-4 py-3 text-sm">{product.supplier}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const CustomersView = () => {
    const CustomerForm = ({ customer, onSave, onCancel }) => {
      const [formData, setFormData] = useState(customer || {
        name: '', phone: '', email: ''
      });

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">{customer ? 'Edit Customer' : 'Add New Customer'}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button 
                onClick={() => onSave(formData)}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Save Customer
              </button>
              <button 
                onClick={onCancel}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
          <button 
            onClick={() => { setEditingCustomer(null); setShowCustomerForm(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <UserPlus size={20} />
            Add Customer
          </button>
        </div>

        {showCustomerForm && (
          <CustomerForm 
            customer={editingCustomer}
            onSave={saveCustomer}
            onCancel={() => { setShowCustomerForm(false); setEditingCustomer(null); }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map(customer => (
            <div key={customer.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => { setEditingCustomer(customer); setShowCustomerForm(true); }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => deleteCustomer(customer.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Email:</span> {customer.email}</p>
                <p><span className="text-gray-600">Loyalty Points:</span> <span className="font-semibold text-green-600">{customer.points}</span></p>
                <p><span className="text-gray-600">Total Spent:</span> <span className="font-semibold">KES {customer.totalSpent.toFixed(2)}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SuppliersView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Suppliers</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map(supplier => (
          <div key={supplier.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Package className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{supplier.name}</h3>
                  <p className="text-sm text-gray-600">{supplier.products} products</p>
                </div>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <p><span className="text-gray-600">Contact:</span> {supplier.contact}</p>
              <p><span className="text-gray-600">Email:</span> {supplier.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ReportsView = () => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);
    const totalSales = sales.length;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Sales Reports</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">KES {totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-gray-600">Total Profit</p>
            <p className="text-2xl font-bold text-gray-800">KES {totalProfit.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">{totalRevenue > 0 ? ((totalProfit/totalRevenue)*100).toFixed(1) : 0}% margin</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-800">{totalSales}</p>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">All Sales Transactions</h3>
            <button 
              onClick={() => exportToCSV(sales, 'complete-sales-report.csv')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700"
            >
              <Download size={16} />
              Export Full Report
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Time</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Customer</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Items</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Total</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Profit</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Payment</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Cashier</th>
                </tr>
              </thead>
              <tbody>
                {sales.map(sale => (
                  <tr key={sale.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm">#{sale.id}</td>
                    <td className="px-4 py-2 text-sm">{sale.date}</td>
                    <td className="px-4 py-2 text-sm">{sale.time}</td>
                    <td className="px-4 py-2 text-sm">{sale.customer}</td>
                    <td className="px-4 py-2 text-sm">{sale.items}</td>
                    <td className="px-4 py-2 text-sm font-semibold text-blue-600">KES {sale.total.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm font-semibold text-green-600">KES {sale.profit.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm">{sale.paymentMethod}</td>
                    <td className="px-4 py-2 text-sm">{sale.cashier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, allowed: ['Admin', 'Cashier'] },
    { id: 'pos', label: 'Point of Sale', icon: ShoppingCart, allowed: ['Admin', 'Cashier'] },
    { id: 'products', label: 'Products', icon: Package, allowed: ['Admin'] },
    { id: 'customers', label: 'Customers', icon: Users, allowed: ['Admin', 'Cashier'] },
    { id: 'suppliers', label: 'Suppliers', icon: PackagePlus, allowed: ['Admin'] },
    { id: 'reports', label: 'Reports', icon: FileText, allowed: ['Admin'] },
  ];

  const filteredMenuItems = menuItems.filter(item => item.allowed.includes(currentUser?.role));

  return (
    <div className="min-h-screen bg-gray-100">
      <ReceiptModal />
      
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <ShoppingCart className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Supermarket Manager</h1>
              <p className="text-xs text-gray-600">{currentUser?.name} ({currentUser?.role})</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {filteredMenuItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition whitespace-nowrap ${
                    currentView === item.id 
                      ? 'border-blue-600 text-blue-600 bg-blue-50' 
                      : 'border-transparent text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'pos' && <POSView />}
        {currentView === 'products' && <ProductsView />}
        {currentView === 'customers' && <CustomersView />}
        {currentView === 'suppliers' && <SuppliersView />}
        {currentView === 'reports' && <ReportsView />}
      </div>
    </div>
  );
};

export default SupermarketManagementSystem;
