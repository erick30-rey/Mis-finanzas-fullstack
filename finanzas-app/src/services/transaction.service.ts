import api from "../api/api";
import { Transaction } from "../models/Transaction";

export const TransactionService = {

    async getAll(): Promise<Transaction[]> {

        const response = await api.get("/transacciones");

        return response.data.map((t: any) => ({
            id: t.idTransaccion.toString(),
            type:
            t.tipoCategoria?.toUpperCase() === "INGRESO"
            ? "income"
            : "expense",
            amount: t.monto,
            categoryId: t.idCategoria.toString(),
            description: t.descripcion ?? t.titulo,
            date: t.fechaTransaccion
        }));
    }

};
