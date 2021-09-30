/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */


module.exports = {
  ssr: false,
  target: 'static',
  head: {
    title: '标注检查工具',
    meta: [{ charset: "utf-8" }]
  },
  loading: false,
  plugins: [
    {ssr: true, src: '@/plugins/icons.js'},
    {src: '~/plugins/element.js', ssr: false},//UI框架
  ],
  css: [
    '~/assets/style/transition.css',
    '~/assets/style/comment.css',
    '~/assets/style/font.css',
    '~/assets/style/google.css',
    'element-ui/lib/theme-chalk/index.css'
  ],
  buildModules: [
    
  ],
  modules: [
    '@nuxtjs/vuetify',
  ],
          vuetify: {
            theme: {
              themes: {
                light: {
                  primary: '#1867c0',
                  secondary: '#b0bec5',
                  accent: '#8c9eff',
                  error: '#b71c1c',
                },
              },
            }
          }
};
