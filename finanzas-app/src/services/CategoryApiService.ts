import api from "../api/api";

export const CategoryApiService = {

  async getAll() {
    const response = await api.get("/categorias");
    return response.data;
  },

  async add(category: any) {
    const response = await api.post("/categorias", category);
    return response.data;
  },

  async update(id: number, category: any) {
    const response = await api.put(`/categorias/${id}`, category);
    return response.data;
  },

  async delete(id: number) {
    await api.delete(`/categorias/${id}`);
  }

};