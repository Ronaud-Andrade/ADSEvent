/* Importando api para fazer as requisições */
import api from "../lib/api";
/* Importando Category de events */
import { Category, PaginatedResponse } from "../types/events";

/** Buscar todas as categorias */
export const getCategories = async (): Promise<Category[]> => {
    let allCategories: Category[] = [];
    let url = "categories/";

    while (url) {
        const response = await api.get<PaginatedResponse<Category>>(url);
        allCategories = allCategories.concat(response.data.results);
        url = response.data.next || "";
    }

    return allCategories;
};