import axios from './Axios';

export const fetchNotifications = async () => {
  const res = await axios.get('/notifications');
  return res.data;
};

export const markAsRead = async (id: string) => {
  await axios.post(`/notifications/${id}/read`);
};
