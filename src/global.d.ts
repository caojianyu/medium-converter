import CButton from "./components/cui/button/CButton.vue"

declare module 'vue' {
    export interface GlobalComponents {
        CButton: typeof CButton
    }
}