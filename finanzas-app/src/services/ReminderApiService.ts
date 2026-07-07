import api from "../api/api";
import { Reminder } from "../models/Reminder";

export const ReminderApiService = {
  async getAll(): Promise<Reminder[]> {
    const response = await api.get("/recordatorios");

    return response.data.map((r: any) => ({
      id: String(r.idRecordatorio),
      categoryId: r.idCategoria ? String(r.idCategoria) : undefined,
      categoryName: r.nombreCategoria,
      title: r.titulo,
      description: r.descripcion,
      amount: r.monto ? Number(r.monto) : undefined,
      date: r.fechaRecordatorio,
      status: r.estado,
      active: r.activo,
    }));
  },

  async add(reminder: any) {
    const response = await api.post("/recordatorios", reminder);
    return response.data;
  },

  async update(id: number, reminder: any) {
    const response = await api.put(`/recordatorios/${id}`, reminder);
    return response.data;
  },

  async delete(id: number) {
    await api.delete(`/recordatorios/${id}`);
  },
};