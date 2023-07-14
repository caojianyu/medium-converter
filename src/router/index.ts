import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../view/HomeView.vue'
import SplashscreenView from '../view/SplashscreenView.vue'

import Video from '../components/Video.vue'
import Audio from '../components/Audio.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: HomeView,
            redirect: '/video',
            children: [
                {
                    path: '/video',
                    component: Video,
                    meta: {
                        keepAlive: true
                    }
                },
                {
                    path: '/audio',
                    component: Audio,
                    meta: {
                        keepAlive: true
                    }
                }
            ]
        },
        {
            path: '/splashscreen',
            component: SplashscreenView
        }
    ],
})

export default router
