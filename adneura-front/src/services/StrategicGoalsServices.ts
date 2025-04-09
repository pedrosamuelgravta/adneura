import { api } from "@/lib/api";

export const getStrategicGoals = async (data?: any) => {
  try {
    const response = await api.get("strategic-goals/", { params: data });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * data = {
 *      goal: string,
 *      brand_id: string,
 * }
 */
export const createStrategicGoal = async (data: any) => {
  try {
    const response = await api.post("strategic-goals/", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteStrategicGoal = async (id: string) => {
  try {
    const response = await api.delete(`strategic-goals/${id}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
