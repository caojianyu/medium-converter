import { App } from 'vue'
import CButton from './CButton.vue'

export default {
    install(app: App) {
        app.component('CButton', CButton)
    }
}
