/* Importando api para fazer as requisições */
import api from "../lib/api";
/* Importando Category de events */
import { Category } from "../types/events";

/** Buscar todas as categorias */
export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get("categories/");
    return response.data.results;
};