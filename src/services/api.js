import axios from 'axios'

const API_URL = 'https://cloudtask-api.onrender.com/api'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Auth
export const authAPI = {
    register: (data) => api.post('/register', data),
    login: (data) => api.post('/login', data),
    logout: () => api.post('/logout'),
    me: () => api.get('/me'),
    switchOrganization: (organizationId) => api.post('/switch-organization', { organization_id: organizationId }),
}

// Dashboard
export const dashboardAPI = {
    getData: () => api.get('/dashboard'),
}

// Organizations
export const organizationAPI = {
    getAll: () => api.get('/organizations'),
    getOne: (id) => api.get(`/organizations/${id}`),
    update: (id, data) => api.put(`/organizations/${id}`, data),
    delete: (id) => api.delete(`/organizations/${id}`),
    updatePlan: (id, plan) => api.post(`/organizations/${id}/update-plan`, { plan }),
    getUsage: (id) => api.get(`/organizations/${id}/usage`),
    uploadLogo: (id, formData) =>
        api.post(`/organizations/${id}/logo`, formData, {
            headers: {"Content-Type": "multipart/form-data"},
        }),
}

// Projects
export const projectAPI = {
    getAll: () => api.get('/projects'),
    getOne: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`),
    addMember: (projectId, userId) => api.post(`/projects/${projectId}/members`, { user_id: userId }),
    removeMember: (projectId, userId) => api.delete(`/projects/${projectId}/members/${userId}`),
}

// Tasks
export const taskAPI = {
    getAll: (params) => api.get('/tasks', { params }),
    getOne: (id) => api.get(`/tasks/${id}`),
    create: (data) => api.post('/tasks', data),
    update: (id, data) => api.put(`/tasks/${id}`, data),
    delete: (id) => api.delete(`/tasks/${id}`),
    addComment: (taskId, comment) => api.post(`/tasks/${taskId}/comments`, { comment }),
    updateOrder: (tasks) => api.post('/tasks/update-order', { tasks }),
}

//Payment
export const paymentAPI = {
    createCheckoutSession: (plan) => api.post('/payment/create-checkout', { plan }),
    getSubscription: () => axios.get("/api/payment/get-subscription"), // ✅ new line
    cancelSubscription: () => api.post('/payment/cancel-subscription'),
    resumeSubscription: () => api.post('/payment/resume-subscription'),
}

// Search API
export const searchAPI = {
    search: (query) => api.get('/search', { params: { q: query } }),
}

// Notifications API
export const notificationAPI = {
    getAll: () => api.get('/notifications'),
    getUnreadCount: () => api.get('/notifications/unread-count'),
    markAsRead: (id) => api.post(`/notifications/${id}/read`),
    markAllAsRead: () => api.post('/notifications/mark-all-read'),
}

// Team
export const teamAPI = {
    getAll: () => api.get('/team'),
    invite: (data) => api.post('/team/invite', data),
    updateRole: (userId, role) => api.put(`/team/${userId}/role`, { role }),
    remove: (userId) => api.delete(`/team/${userId}`),
}

export default api