import Surreal from 'surrealdb.js';
import {DB_URL} from '../config';
export const db = new Surreal(DB_URL);
