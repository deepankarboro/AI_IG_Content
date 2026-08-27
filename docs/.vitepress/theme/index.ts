import DefaultTheme from 'vitepress/theme'
import Extractor from './components/Extractor.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Extractor', Extractor)
  }
}
