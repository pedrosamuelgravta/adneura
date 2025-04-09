import { api } from "@/lib/api";

export const getBrand = async () => {
  try {
    const response = await api.get("brands/");
    return response.data;
  } catch (error) {
    console.error("Error fetching brand info:", error);
  }
};

export const getBrandById = async (id: any) => {
  try {
    const response = await api.get(`brands/`, { params: { id } });
    return response.data;
  } catch (error) {
    console.error("Error fetching brand info by id:", error);
  }
};

export const createBrand = async (data: any) => {
  try {
    const response = await api.post("brands/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBrand = async (data: any) => {
  try {
    const response = await api.patch("brands/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
