
export default class EnvironmentService {

    static ENV = {
        dev: {
            apiUrl: 'https://localhost:8000/'
        }, 
        prod: {
            apiUrl: '/'
        }
    }

    static getEnv() {
        if (process.env.NODE_ENV === 'development') {
            return EnvironmentService.ENV.dev
        } else if ('production') {
            return EnvironmentService.ENV.prod
        }
    }
}