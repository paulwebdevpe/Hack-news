import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  server: {
    port: Number(process.env.VITE_PORT),
  }
})