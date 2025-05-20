import { Author } from './author';
import { Category } from './category';

export interface Book {
  id: String;
  title: string;
  isbn?: string;
  pages: number;
  price: number;
  stock: number;
  author: Author;
  categories: Category[];
}