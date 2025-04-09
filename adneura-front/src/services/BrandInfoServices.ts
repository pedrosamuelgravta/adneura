import { api } from "@/lib/api";

export const getBrandInfoById = async (id: string | number) => {
  try {
    const response = await api.get(`brand-info/`, { params: { id } });
    return response.data;
  } catch (error) {
    console.error("Error fetching brand info by id:", error);
  }
};

export const createBrandInfo = async (data: any) => {
  try {
    const response = await api.post("brand-info/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBrandInfo = async (data: any) => {
  try {
    const response = await api.put("brand-info/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patchBrandInfo = async (data: any) => {
  try {
    const response = await api.patch("brand-info/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
