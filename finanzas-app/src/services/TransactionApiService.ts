import api from "../api/api";
import { Transaction } from "../models/Transaction";

export const TransactionApiService = {

    async getAll(): Promise<Transaction[]> {

        const response = await api.get("/transacciones");

        return response.data.map((t: any) => ({

            id: t.idTransaccion.toString(),

            type:
                t.tipoCategoria?.toUpperCase() === "INGRESO"
                    ? "income"
                    : "expense",

            amount: Number(t.monto),

            accountId: String(t.idCuenta),

            categoryId: String(t.idCategoria),

            description: t.descripcion ?? t.titulo,

            date: t.fechaTransaccion

        }));
    },

    async add(transaction: any) {

        const response = await api.post("/transacciones", transaction);

        return response.data;

    },

    async update(id: number, transaction: any) {

        const response = await api.put(`/transacciones/${id}`, transaction);

        return response.data;

    },

    async delete(id: number) {

        await api.delete(`/transacciones/${id}`);

    }

};