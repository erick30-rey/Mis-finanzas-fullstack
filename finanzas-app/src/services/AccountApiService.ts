import api from "../api/api";
import { Account } from "../models/Account";

export const AccountApiService = {

    async getAll(): Promise<Account[]> {

        const response = await api.get("/cuentas");

        return response.data.map((c: any) => ({

            id: String(c.idCuenta),

            name: c.nombre,

            type: c.tipo,

            currency: c.moneda,

            active: c.activo

        }));

    },

    async add(account: any) {
  try {
    console.log("Enviando cuenta:", account);

    const response = await api.post("/cuentas", account);

    console.log("Respuesta cuenta:", response.data);

    return response.data;
  } catch (error: any) {
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", JSON.stringify(error.response?.data, null, 2));
    alert(JSON.stringify(error.response?.data, null, 2));
    throw error;
  }
},

    async update(id: number, account: any) {

        const response = await api.put(`/cuentas/${id}`, account);

        return response.data;

    },

    async delete(id: number) {

        await api.delete(`/cuentas/${id}`);

    }

};