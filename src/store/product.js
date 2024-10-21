import { create } from 'zustand';

// Replace with your actual backend URL
const BACKEND_URL = 
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000/products'
    : 'https://vercel-server-theta-five.vercel.app/products';

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    
    createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
            return { success: false, message: 'Please fill all fields' };
        }
        const res = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });
        const data = await res.json();
        set((state) => ({ products: [...state.products, data.data] }));
        return { success: true, message: 'Product created successfully' };
    },
    fetchProducts: async () => {
        try {
            const res = await fetch(BACKEND_URL);
            if (!res.ok) {
                throw new Error(`Failed to fetch products: ${res.statusText}`);
            }
            const data = await res.json();
            set({ products: data.data });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    },
    updateProduct: async (pid, updatedProduct) => {
        const res = await fetch(`${BACKEND_URL}/${pid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        // Updates the product in the store and updates the UI immediately
        set((state) => ({
            products: state.products.map((product) => product._id === pid ? data.data : product)
        }));
        return { success: true, message: 'Product updated successfully' };
    },
    deleteProduct: async (pid) => {
        const res = await fetch(`${BACKEND_URL}/${pid}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        // Removes the product from the store and updates the UI immediately
        set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
        return { success: true, message: 'Product deleted successfully' };
    }
}));
