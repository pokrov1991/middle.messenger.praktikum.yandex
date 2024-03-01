import { defineConfig } from 'vite'
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';


// const pageData = {
//   '/index.html': {
//     title: 'Main Page',
//   },
//   '/nested/subpage.html': {
//     title: 'Sub Page',
//   },
// };

// export default defineConfig({
//   plugins: [
//     handlebars({
//       context(pagePath) {
//         return pageData[pagePath];
//       },
//     })
//   ],
// })



export default defineConfig({
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'partials'),
    }),
  ],
}) 