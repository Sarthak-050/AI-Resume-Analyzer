import API from "./api";

export const registerUser = async (userData) => {
  const { data } = await API.post("/auth/register", userData);
  return data;
};

export const loginUser = async (userData) => {
  const { data } = await API.post("/auth/login", userData);
  return data;
};

export const updateProfile = async (name) => {
  const { data } = await API.put("/auth/profile", { name });
  return data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await API.put("/auth/change-password", {
    currentPassword,
    newPassword,
  });
  return data;
};