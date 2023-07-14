import { App } from 'vue'

import CButton from './button'

const components = [
    CButton,
]

export default {
    install(app: App) {
        components.map(item => {
            app.use(item)
        })
    }
}
