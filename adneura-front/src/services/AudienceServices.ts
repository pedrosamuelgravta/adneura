import { api } from "@/lib/api";

export const getAudienceByBrandId = async (id: string | number) => {
  try {
    const response = await api.get(`audiences/`, { params: { brand_id: id } });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAudienceById = async (id: string | number) => {
  try {
    const response = await api.get(`audiences/`, {
      params: { audience_id: id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching audience by id:", error);
  }
};

export const postAudience = async (data: any) => {
  try {
    const response = await api.post(`audiences/`, data);
    return response.data;
  } catch (error) {
    console.error("Error posting audience:", error);
  }
};

export const pathAudience = async (id: string | number) => {
  try {
    const response = await api.patch(`audiences/`, { audience_id: id });
    return response.data;
  } catch (error) {
    console.error("Error patching audience:", error);
  }
};

export const putAudience = async (data: any, pk: string | number) => {
  try {
    const response = await api.put(`audiences/${pk}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postTriggers = async (data: any) => {
  try {
    const response = await api.post(`audiences/trigger/`, data);
    return response.data;
  } catch (error) {
    console.error("Error posting triggers:", error);
    throw error;
  }
};

export const postGenerateAudienceImg = async (data: any) => {
  try {
    const response = await api.post(`audiences/generate-image-audience/`, data);
    return response.data;
  } catch (error) {
    console.error("Error generating audience image:", error);
  }
};

export const postGenerateTriggerImg = async (data: any) => {
  try {
    const response = await api.post(`audiences/generate-image-trigger/`, data);
    return response.data;
  } catch (error) {
    console.error("Error generating trigger image:", error);
  }
};

export const postTerritories = async (data: any) => {
  try {
    const response = await api.post(`audiences/territories/`, data);
    return response.data;
  } catch (error) {
    console.error("Error posting territories:", error);
  }
};

export const putTriggers = async (data: any, pk: string | number) => {
  try {
    const response = await api.put(`audiences/trigger/${pk}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
