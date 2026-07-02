import axios from '../bootstrap';

export const dashboardAPI = {
    getStats: async () => {
        const response = await axios.get('/dashboard/stats');
        return response.data.data;
    },
};

export const categoryAPI = {
    getList: async (page = 1, search = '', perPage = 15) => {
        const response = await axios.get('/categories', {
            params: { page, search, per_page: perPage },
        });
        return response.data;
    },

    getById: async (id) => {
        const response = await axios.get(`/categories/${id}`);
        return response.data.data;
    },

    create: async (data) => {
        const response = await axios.post('/categories', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await axios.put(`/categories/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await axios.delete(`/categories/${id}`);
        return response.data;
    },
};

export const productAPI = {
    getList: async (page = 1, search = '', categoryId = null, perPage = 15) => {
        const response = await axios.get('/products', {
            params: { page, search, category_id: categoryId, per_page: perPage },
        });
        return response.data;
    },

    getById: async (id) => {
        const response = await axios.get(`/products/${id}`);
        return response.data.data;
    },

    create: async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === 'images' && data[key]) {
                data[key].forEach((image) => {
                    formData.append('images[]', image);
                });
            } else {
                formData.append(key, data[key]);
            }
        });

        const response = await axios.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    update: async (id, data) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === 'images' && data[key]) {
                data[key].forEach((image) => {
                    if (image instanceof File) {
                        formData.append('images[]', image);
                    }
                });
            } else {
                formData.append(key, data[key]);
            }
        });

        const response = await axios.post(`/products/${id}?_method=PUT`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await axios.delete(`/products/${id}`);
        return response.data;
    },

    deleteImage: async (id, mediaId) => {
        const response = await axios.post(`/products/${id}/delete-image`, { media_id: mediaId });
        return response.data;
    },

    reorderGallery: async (id, mediaIds) => {
        const response = await axios.post(`/products/${id}/reorder-gallery`, {
            media_ids: mediaIds,
        });
        return response.data;
    },
};

export const catalogAPI = {
    getList: async (page = 1, search = '', perPage = 15) => {
        const response = await axios.get('/catalogs', {
            params: { page, search, per_page: perPage },
        });
        return response.data;
    },

    getById: async (id) => {
        const response = await axios.get(`/catalogs/${id}`);
        return response.data.data;
    },

    getWithProducts: async (id) => {
        const response = await axios.get(`/catalogs/${id}/with-products`);
        return response.data.data;
    },

    getProducts: async (id, page = 1, search = '', perPage = 15) => {
        const response = await axios.get(`/catalogs/${id}/products`, {
            params: { page, search, per_page: perPage },
        });
        return response.data;
    },

    create: async (data) => {
        const response = await axios.post('/catalogs', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await axios.put(`/catalogs/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await axios.delete(`/catalogs/${id}`);
        return response.data;
    },

    clone: async (id) => {
        const response = await axios.post(`/catalogs/${id}/clone`);
        return response.data;
    },

    attachProducts: async (id, products) => {
        const response = await axios.post(`/catalogs/${id}/attach-products`, {
            products,
        });
        return response.data;
    },

    detachProduct: async (catalogId, productId) => {
        const response = await axios.delete(`/catalogs/${catalogId}/products/${productId}`);
        return response.data;
    },

    updateProductPrice: async (catalogId, productId, customPrice) => {
        const response = await axios.patch(
            `/catalogs/${catalogId}/products/${productId}/price`,
            { custom_price_usd: customPrice }
        );
        return response.data;
    },

    createLink: async (id, data) => {
        const response = await axios.post(`/catalogs/${id}/links`, data);
        return response.data;
    },

    getLinks: async (id) => {
        const response = await axios.get(`/catalogs/${id}/links`);
        return response.data;
    },

    deleteLink: async (id, linkId) => {
        const response = await axios.delete(`/catalogs/${id}/links`, {
            data: { link_id: linkId },
        });
        return response.data;
    },
};

export const orderAPI = {
    getList: async (page = 1, search = '', status = null, perPage = 15) => {
        const response = await axios.get('/orders', {
            params: { page, search, status, per_page: perPage },
        });
        return response.data;
    },

    getById: async (id) => {
        const response = await axios.get(`/orders/${id}`);
        return response.data.data;
    },

    updateStatus: async (id, status) => {
        const response = await axios.patch(`/orders/${id}/status`, { status });
        return response.data.data;
    },
};

export const currencyAPI = {
    getRate: async () => {
        const response = await axios.get('/currency/rate');
        return response.data.data;
    },

    updateRate: async (rate, source = null) => {
        const response = await axios.post('/currency/rate', { rate, source });
        return response.data;
    },

    getHistory: async (days = 30) => {
        const response = await axios.get('/currency/history', {
            params: { days },
        });
        return response.data.data;
    },
};
