import { Author } from './author';
import { Category } from './category';

export interface Book {
  id: string;
  title: string;
  isbn?: string;
  pages: number;
  price: number;
  stock: number;
  author: Author;
  categories: Category[];
}