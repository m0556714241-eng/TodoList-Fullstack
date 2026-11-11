import axios from 'axios';

axios.defaults.baseURL = "http://localhost:5267";

// מיירט בקשה - מצרף את האסימון לכל בקשה שיוצאת לשרת
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// מיירט תשובה - רושם ללוג כל שגיאה שחוזרת מהשרת
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response ? error.response.data : error.message);
    // אסימון לא תקף (לא בבקשת התחברות) - מוחקים אותו ועוברים לדף ההתחברות
    if (error.response?.status === 401 && !error.config.url.includes("/login")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  })

export default {
  getTasks: async () => {
    const result = await axios.get(`/items`)
    return result.data;
  },

  addTask: async (name) => {
    const result = await axios.post(`/items`, { name, isComplete: false })
    return result.data;
  },

  setCompleted: async (id, isComplete) => {
    const res = await axios.get(`/items/${id}`)
    const updatedTask = { ...res.data, isComplete };
    await axios.put(`/items/${id}`, updatedTask)



    return res.data;
  },

  deleteTask: async (id) => {
    const res = await axios.delete(`/items/${id}`)
    return res.data;
  },

  // הרשמה - יוצר משתמש חדש ושומר את האסימון שהתקבל
  register: async (username, password) => {
    const result = await axios.post(`/register`, { username, password });
    localStorage.setItem("token", result.data.token);
  },

  // התחברות - בודק שם וסיסמה ושומר את האסימון שהתקבל
  login: async (username, password) => {
    const result = await axios.post(`/login`, { username, password });
    localStorage.setItem("token", result.data.token);
  },

  // התנתקות - מוחק את האסימון
  logout: () => {
    localStorage.removeItem("token");
  }
};
