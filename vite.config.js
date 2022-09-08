import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'@': '/src'
		}
	},
	css: {
		//css预处理
		preprocessorOptions: {
			scss: {
				additionalData: `@import "@/assets/style/style.scss";`
			}
		}
	}
});