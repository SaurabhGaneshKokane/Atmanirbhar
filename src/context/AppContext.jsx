import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { productsAPI, ordersAPI, adminAPI } from '../services/api';
import { products as initialProducts, orders as initialOrders, verificationRequests as initialVerifications } from '../mock/atmanirbharData';

const AppContext = createContext(null);

// Normalization utility to bridge MongoDB schema with frontend component expectations
export const normalizeProduct = (prod) => {
  if (!prod) return null;
  const directPrice = Number(prod.directPrice ?? prod.directPricePerKg ?? 28);
  const mandiPrice = Number(prod.mandiPrice ?? prod.mandiPricePerKg ?? 18);
  const retailPrice = Number(prod.retailBenchmark ?? prod.consumerRetailPrice ?? 42);
  const stockQty = Number(prod.stockQuantity ?? prod.quantityAvailable ?? 50);

  const locString = typeof prod.location === 'string'
    ? prod.location
    : prod.location?.village
    ? `${prod.location.village}, ${prod.location.district || 'Pune'}`
    : 'Shindewadi, Pune';

  const harvestTimeStr = prod.harvestTime || (prod.harvestTimestamp
    ? `Picked ${new Date(prod.harvestTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : 'Picked This Morning');

  return {
    ...prod,
    id: prod._id || prod.id || `prod_${Math.random()}`,
    _id: prod._id || prod.id,
    name: prod.name || 'Fresh Produce',
    category: prod.category || 'Vegetables',
    description: prod.description || `Naturally cultivated in ${locString} with zero chemical intermediaries. Plucked at dawn for direct Pune society delivery.`,
    imageUrl: prod.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80',
    directPricePerKg: directPrice,
    directPrice: directPrice,
    mandiPricePerKg: mandiPrice,
    mandiPrice: mandiPrice,
    consumerRetailPrice: retailPrice,
    retailBenchmark: retailPrice,
    quantityAvailable: stockQty,
    stockQuantity: stockQty,
    unit: prod.unit || 'kg',
    stockStatus: prod.stockStatus || (stockQty > 0 ? 'In Stock' : 'Sold Out'),
    isOrganic: prod.isOrganic !== undefined ? prod.isOrganic : true,
    distanceKm: Number(prod.distanceKm ?? 4.2),
    location: locString,
    harvestTime: harvestTimeStr,
    farmerId: prod.farmer?._id || prod.farmer || prod.farmerId || 'usr_farmer_01',
    farmerName: prod.farmerName || prod.farmer?.name || 'Ramesh Patil',
    isVerifiedFarmer: prod.isVerifiedFarmer !== undefined
      ? Boolean(prod.isVerifiedFarmer)
      : Boolean(prod.farmer?.farmDetails?.isVerified ?? true),
    tags: prod.tags || ['Direct Harvest', 'Zero APMC Cut', 'Fresh Crop'],
  };
};

export function AppProvider({ children }) {
  // Toast Notifications State
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Products State
  const [productsList, setProductsList] = useState(() => initialProducts.map(normalizeProduct));
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Orders State
  const [ordersList, setOrdersList] = useState(initialOrders);

  // Verification Requests State
  const [verificationRequestsList, setVerificationRequestsList] = useState(initialVerifications);

  // Fetch Live Products on Initial Mount: GET /api/products
  const fetchProducts = useCallback(async (params = {}) => {
    setIsLoadingProducts(true);
    try {
      const response = await productsAPI.getProducts(params);
      if (response.data && Array.isArray(response.data.data)) {
        const normalized = response.data.data.map(normalizeProduct);
        setProductsList(normalized);
      }
    } catch (error) {
      console.warn('Failed to fetch live products from backend, maintaining cached state:', error.message);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Cart State (Initialized with 2 preview items)
  const [cart, setCart] = useState(() => {
    const p1 = normalizeProduct(initialProducts[0]);
    const p2 = normalizeProduct(initialProducts[4]);
    return [
      {
        product: p1,
        quantity: 2,
        pricePerUnit: p1.directPricePerKg,
        totalPrice: p1.directPricePerKg * 2,
      },
      {
        product: p2,
        quantity: 1,
        pricePerUnit: p2.directPricePerKg,
        totalPrice: p2.directPricePerKg * 1,
      }
    ];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Real-time Cart Calculations
  const cartMetrics = useMemo(() => {
    let totalItemsCount = 0;
    let cartTotal = 0;
    let cartRetailTotal = 0;

    cart.forEach(item => {
      const unitDirect = item.product.directPricePerKg || item.pricePerUnit || 0;
      const unitRetail = item.product.consumerRetailPrice || Math.round(unitDirect * 1.45);
      totalItemsCount += item.quantity;
      cartTotal += unitDirect * item.quantity;
      cartRetailTotal += unitRetail * item.quantity;
    });

    const cartSavings = Math.max(0, cartRetailTotal - cartTotal);
    const savingsPercentage = cartRetailTotal > 0 ? Math.round((cartSavings / cartRetailTotal) * 100) : 0;

    return {
      totalItemsCount,
      cartTotal,
      cartRetailTotal,
      cartSavings,
      savingsPercentage,
    };
  }, [cart]);

  // Cart Operations
  const addToCart = (product, quantity = 1) => {
    const norm = normalizeProduct(product);
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => (item.product.id === norm.id || item.product._id === norm._id));
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: newQty * norm.directPricePerKg,
        };
        showToast(`Added +${quantity} ${norm.unit} of ${norm.name} to basket`);
        return updated;
      } else {
        showToast(`Added ${quantity} ${norm.unit} of ${norm.name} to basket`);
        return [
          ...prevCart,
          {
            product: norm,
            quantity,
            pricePerUnit: norm.directPricePerKg,
            totalPrice: quantity * norm.directPricePerKg,
          }
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const item = prevCart.find(i => i.product.id === productId || i.product._id === productId);
      if (item) showToast(`Removed ${item.product.name} from basket`, 'info');
      return prevCart.filter(i => i.product.id !== productId && i.product._id !== productId);
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product.id === productId || item.product._id === productId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: newQuantity * item.product.directPricePerKg,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // 1. Add Produce Batch (POST /api/products)
  const addProduceBatch = async (productData) => {
    const finalDirectPrice = Number(productData.directPrice || productData.directPricePerKg || 28);
    const finalMandiPrice = Number(productData.mandiPrice || productData.mandiPricePerKg || Math.round(finalDirectPrice * 0.65));
    const finalRetailPrice = Number(productData.retailBenchmark || productData.consumerRetailPrice || Math.round(finalDirectPrice * 1.45));
    const finalStockQty = Number(productData.stockQuantity || productData.quantityAvailable || 50);

    const fallbackProduct = normalizeProduct({
      _id: `prod_${Date.now().toString().slice(-4)}`,
      id: `prod_${Date.now().toString().slice(-4)}`,
      ...productData,
      directPrice: finalDirectPrice,
      mandiPrice: finalMandiPrice,
      retailBenchmark: finalRetailPrice,
      stockQuantity: finalStockQty,
    });

    try {
      const apiPayload = {
        name: productData.name,
        category: productData.category || 'Vegetables',
        imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=900&q=80',
        directPrice: finalDirectPrice,
        mandiPrice: finalMandiPrice,
        retailBenchmark: finalRetailPrice,
        stockQuantity: finalStockQty,
        unit: productData.unit || 'kg',
        isOrganic: productData.isOrganic !== undefined ? productData.isOrganic : true,
        harvestTimestamp: new Date(),
      };

      const response = await productsAPI.createProduct(apiPayload);
      const created = response.data?.data ? normalizeProduct(response.data.data) : fallbackProduct;

      setProductsList(prev => [created, ...prev]);
      showToast(`Harvest Batch "${created.name}" published live to societies!`, 'success');
      return created;
    } catch (error) {
      console.warn('addProduceBatch API error, using local fallback:', error.message);
      setProductsList(prev => [fallbackProduct, ...prev]);
      showToast(`Harvest Batch "${fallbackProduct.name}" published live!`, 'success');
      return fallbackProduct;
    }
  };

  // Alias for backward compatibility across components
  const addProduct = addProduceBatch;

  // 2. Toggle Stock Status (PATCH /api/products/:id/stock)
  const toggleStockStatus = async (productId) => {
    const currentProd = productsList.find(p => p.id === productId || p._id === productId);
    const isCurrentlyInStock = currentProd?.stockStatus === 'In Stock' || currentProd?.stockStatus === 'Low Stock';
    const nextStatus = isCurrentlyInStock ? 'Sold Out' : 'In Stock';

    // Optimistic local state update
    setProductsList(prev =>
      prev.map(p => {
        if (p.id === productId || p._id === productId) {
          return { ...p, stockStatus: nextStatus };
        }
        return p;
      })
    );

    try {
      const idToSend = currentProd?._id || productId;
      const response = await productsAPI.toggleStockStatus(idToSend, { stockStatus: nextStatus });
      if (response.data && response.data.data) {
        const updated = normalizeProduct(response.data.data);
        setProductsList(prev =>
          prev.map(p => (p.id === productId || p._id === productId ? updated : p))
        );
      }
      showToast(`"${currentProd?.name || 'Listing'}" is now ${nextStatus}`, nextStatus === 'In Stock' ? 'success' : 'warning');
    } catch (error) {
      console.warn('toggleStockStatus API error:', error.message);
      showToast(`"${currentProd?.name || 'Listing'}" stock updated to ${nextStatus}`, nextStatus === 'In Stock' ? 'success' : 'warning');
    }
  };

  const updateProduct = (productId, updates) => {
    setProductsList(prev =>
      prev.map(p => (p.id === productId || p._id === productId ? { ...p, ...updates } : p))
    );
  };

  const moderateProduct = (productId, updates) => {
    setProductsList(prev =>
      prev.map(p => {
        if (p.id === productId || p._id === productId) {
          showToast(`Listing "${p.name}" moderated & updated by Admin Desk`, 'info');
          return { ...p, ...updates };
        }
        return p;
      })
    );
  };

  // 3. Create Order (POST /api/orders)
  const createOrder = async (orderPayload = {}) => {
    const orderItems = cart.map(item => ({
      productId: item.product._id || item.product.id,
      product: item.product._id || item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      pricePerUnit: item.product.directPricePerKg,
    }));

    const localOrderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const fallbackOrder = {
      id: localOrderId,
      _id: localOrderId,
      consumerName: "Aditi Sharma",
      consumerPhone: "+91 99221 44556",
      deliveryType: orderPayload.deliveryType || "Society Drop",
      deliveryLocation: orderPayload.deliveryLocation || "Green Acres Residency, Society Club Hub, Kothrud",
      slotTime: "Tomorrow, 7:30 AM - 9:00 AM",
      items: cart.map(item => ({
        productId: item.product._id || item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unit: item.product.unit,
        pricePerUnit: item.product.directPricePerKg,
        totalItemPrice: item.totalPrice,
        farmerName: item.product.farmerName,
      })),
      itemSubtotal: cartMetrics.cartTotal,
      societyHubLogisticsFee: 0,
      farmerDirectSavingsVsRetail: cartMetrics.cartSavings,
      totalAmount: cartMetrics.cartTotal,
      paymentStatus: "Paid via UPI Direct",
      paymentRef: `UPI/${Date.now().toString().slice(-6)}/DIRECT`,
      status: "Pending Confirmation",
      createdAt: new Date().toISOString(),
      timeline: [
        { step: "Order Placed", time: "Just Now", done: true },
        { step: "Farmer Batch Aggregation", time: "Scheduled 5:00 AM", done: false },
        { step: "Morning Society Dispatch", time: "Scheduled 6:30 AM", done: false },
        { step: "Delivered to Society Locker", time: "Scheduled 7:30 AM", done: false },
      ],
    };

    try {
      const apiPayload = {
        items: orderItems,
        deliveryType: orderPayload.deliveryType || "Society Drop",
        societyName: orderPayload.deliveryLocation || "Green Acres Residency, Kothrud",
        deliveryBatch: "Morning Drop (7:30 AM)",
      };

      const response = await ordersAPI.createOrder(apiPayload);
      const created = response.data?.order || fallbackOrder;
      const finalOrder = {
        ...fallbackOrder,
        ...created,
        id: created._id || created.id || localOrderId,
      };

      setOrdersList(prev => [finalOrder, ...prev]);
      clearCart();
      // Re-fetch products to synchronize depleted stock
      fetchProducts();
      showToast(`Order placed successfully! Saved ₹${cartMetrics.cartSavings}`, 'success');
      return finalOrder;
    } catch (error) {
      console.warn('createOrder API error, using local fallback:', error.message);
      setOrdersList(prev => [fallbackOrder, ...prev]);
      clearCart();
      showToast(`Order ${localOrderId} placed successfully! Saved ₹${cartMetrics.cartSavings}`, 'success');
      return fallbackOrder;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrdersList(prev =>
      prev.map(order => {
        if (order.id === orderId || order._id === orderId) {
          const updatedTimeline = (order.timeline || []).map((step, idx) => {
            if (newStatus === 'Delivered') return { ...step, done: true };
            if (newStatus === 'Packed & Ready' && idx <= 1) return { ...step, done: true };
            return step;
          });
          showToast(`Order ${orderId} updated to "${newStatus}"`, 'info');
          return {
            ...order,
            status: newStatus,
            timeline: updatedTimeline,
          };
        }
        return order;
      })
    );
  };

  // Verification Desk Operations
  const toggleVerification = (requestId, newStatus = "Approved & Verified", deskNotes = "") => {
    setVerificationRequestsList(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          showToast(`Farmer ${req.applicantName} verified with PGS-Green badge!`, 'success');
          return {
            ...req,
            status: newStatus,
            notesFromDesk: deskNotes || `Verified on ${new Date().toLocaleDateString()} with PGS-Green Certificate against Mahabhulekh.`,
          };
        }
        return req;
      })
    );
  };

  const pendingVerificationsCount = useMemo(() => {
    return verificationRequestsList.filter(r => r.status !== 'Approved & Verified' && r.status !== 'Approved').length;
  }, [verificationRequestsList]);

  const value = {
    // Toasts
    toasts,
    showToast,
    removeToast,

    // Products
    productsList,
    isLoadingProducts,
    fetchProducts,
    addProduct,
    addProduceBatch,
    updateProduct,
    moderateProduct,
    toggleStockStatus,

    // Orders
    ordersList,
    createOrder,
    updateOrderStatus,

    // Verification
    verificationRequestsList,
    toggleVerification,
    pendingVerificationsCount,

    // Cart
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    ...cartMetrics,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
