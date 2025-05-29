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
    const response = await api.get(`audiences/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching audience by id:", error);
  }
};

export const postAudience = async (data: any) => {
  try {
    const response = await api.post(`audiences/generate_batch/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const analyzeAudience = async (id: string | number) => {
  try {
    const response = await api.post(`audiences/analyze/`, { audience_id: id });
    return response.data;
  } catch (error) {
    console.error("Error patching audience:", error);
  }
};

export const patchAudience = async (data: any, pk: string | number) => {
  try {
    const response = await api.patch(`audiences/${pk}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postTriggers = async (id: string | number) => {
  try {
    const response = await api.post(`audiences/generate_batch_triggers/`, {
      audience_id: id,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting triggers:", error);
    throw error;
  }
};

export const postGenerateAudienceImg = async (
  brand_id: string | number,
  audience_id?: string | number
) => {
  try {
    const response = await api.post(`audiences/generate_audience_image/`, {
      brand_id: brand_id,
      ...(audience_id && { audience_id }),
    });
    return response.data;
  } catch (error) {
    console.error("Error generating audience image:", error);
  }
};

export const postGenerateTriggerImg = async (
  brand_id: string | number,
  trigger_id?: string | number
) => {
  try {
    const response = await api.post(`audiences/generate_trigger_image/`, {
      brand_id: brand_id,
      ...(trigger_id && { trigger_id }),
    });
    return response.data;
  } catch (error) {
    console.error("Error generating trigger image:", error);
  }
};

export const postTerritories = async (data: any) => {
  try {
    const response = await api.post(`territories/`, data);
    return response.data;
  } catch (error) {
    console.error("Error posting territories:", error);
  }
};

export const patchTrigger = async (data: any, pk: string | number) => {
  try {
    const response = await api.patch(`audiences/triggers/${pk}/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
