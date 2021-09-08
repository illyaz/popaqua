/// <reference types="vite/client" />

declare module '*.vue' {
    import {DefineComponent} from 'vue'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare namespace Intl {
    class DisplayNames {
        constructor(a1: string[], a2: {type: string});
        public of: (code: string) => string;
    }
}

interface ImportMetaEnv {
    VITE_LEADERBOARD_URL: string;
    VITE_RECAPTCHA_PUBLIC_KEY: string;
}