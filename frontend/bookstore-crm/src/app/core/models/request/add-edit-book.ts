export interface AddEditBookRequestParameter {
    id: string;
    title: string;
    isbn?: string;
    pages: number;
    price: number;
    stock: number;
    authorId: string;
    categoryIds: string[];
}