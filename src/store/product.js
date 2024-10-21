import { create } from 'zustand';
import axios from 'axios';

// Set the base URL without the `/products` endpoint
const BACKEND_URL = 
  window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://vercel-server-theta-five.vercel.app';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});


export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    
    createProduct: async (newProduct) => {
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
            return { success: false, message: 'Please fill all fields' };
        }
        try {
            const res = await api.post('/products', newProduct);
            set((state) => ({ products: [...state.products, res.data.data] }));
            return { success: true, message: 'Product created successfully' };
        } catch (error) {
            console.error('Error creating product:', error);
            return { success: false, message: 'Failed to create product' };
        }
    },
    fetchProducts: async () => {
        try {
            const res = await api.get('/products');
            set({ products: res.data.data });
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    },
    updateProduct: async (pid, updatedProduct) => {
        try {
            const res = await api.put(`/products/${pid}`, updatedProduct);
            if (!res.data.success) {
                return { success: false, message: res.data.message };
            }

            // Update the product in the store
            set((state) => ({
                products: state.products.map((product) => 
                    product._id === pid ? res.data.data : product
                )
            }));
            return { success: true, message: 'Product updated successfully' };
        } catch (error) {
            console.error('Error updating product:', error);
            return { success: false, message: 'Failed to update product' };
        }
    },
    deleteProduct: async (pid) => {
        try {
            const res = await api.delete(`/products/${pid}`);
            if (!res.data.success) {
                return { success: false, message: res.data.message };
            }

            // Remove the product from the store
            set((state) => ({ products: state.products.filter((product) => product._id !== pid) }));
            return { success: true, message: 'Product deleted successfully' };
        } catch (error) {
            console.error('Error deleting product:', error);
            return { success: false, message: 'Failed to delete product' };
        }
    }
}));
