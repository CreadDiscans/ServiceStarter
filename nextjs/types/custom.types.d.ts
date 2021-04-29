export namespace auth {
    type User = {
        id:number
        username:string
        email:string
        groups:Group[]|number[]
        is_staff:boolean
        is_active:boolean
        date_joined:string
        last_login:string
        is_superuser:boolean
        user_permissions:string
    }
    type Group = {
        id:number
        name:string
    }
}