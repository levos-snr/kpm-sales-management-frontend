import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig, loadEnv } from "vite";
import react from '@vitejs/plugin-react'
import path from "path"

// export default defineConfig({
//   //change port for production
//   test: {
//      globals: true,
//      environment: 'jsdom',
//      setupFiles: ['src/__tests__/setup.js'],
//    },

//   preview: {
//     port: 3001,
//     },

//   // for dev
//   server: {
//     port: 3000,
//     },

//   plugins: [react(), sentryVitePlugin({
//     org: "future-software-agency",
//     project: "javascript-react"
//   })],

//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },

//   build: {
//     sourcemap: true
//   }
// })



export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	return {
	   test: {
          globals: true,
          environment: 'jsdom',
          setupFiles: ['src/__tests__/setup.js'],
		},
		
		server: {
		    port: env.VITE_PORT,
			proxy: {
				"/api": {
					target: env.VITE_API_BASE_URL_DEV,
					changeOrigin: true,
					secure: false,
					rewrite: (p) => p.replace(/^\/api/, ""),
				},
			},
			cors: false,
		},
		
		preview: {
			proxy: {
				"/api": {
					target: env.VITE_API_BASE_URL_PROD,
					changeOrigin: true,
					secure: false,
					rewrite: (p) => p.replace(/^\/api/, ""),
				},
			},
		},
		
	    plugins: [react(), sentryVitePlugin({
			org: "future-software-agency",
			project: "javascript-react"
		})],
		
			
		resolve: {
			alias: {
			"@": path.resolve(__dirname, "./src"),
			},
		},

		build: {
		sourcemap: true
		},

	};
});
