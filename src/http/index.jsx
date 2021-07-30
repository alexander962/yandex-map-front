import axios from "axios";

export const API_URL = `http://localhost:8000/api`;

const $api = axios.create({
  // для того, чтобы каждому запросу cookie цеплялись автоматически
  withCredentials: true,
  // теперь когда с помощью этого instance мы будем отправлять запросы нам не надо будет каждый раз указывать адресс
  baseURL: API_URL
})

// intercepter на запрос
// теперь на каждый запрос будет цепляться токен
$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

// intercepter на ответ
// делаем обновление access токена после смерти
$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    // содержит информацию для запроса
    const originalRequest = error.config;
    // если токен умер
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        // делаем запрос на обновление токена
        const response = await axios.get(`${API_URL}/refresh`, {
          withCredentials: true,
        });
        // добавляем его в localStorage
        localStorage.setItem("token", response.data.accessToken);
        // делаем запрос повторно
        return $api.request(originalRequest);
      } catch (e) {
        console.log("Не авторизован!");
      }
    }
    // если if не отработало, то пробрасываем ошибку на верхний уровень
    throw error;
  }
);

export default $api;