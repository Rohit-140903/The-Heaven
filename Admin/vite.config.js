import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  plugins: [react()],server : {port : 1776},
})


// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
