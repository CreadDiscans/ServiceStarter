import * as custom from './custom.types'

export type Profile = {
    id:number
    user:number|custom.auth.User
}
export type BoardItem = {
    id:number
    title:string
    content:string
    created:string
    modified:string
    author_name:string
    group:number|BoardGroup
    author:number|Profile
}
export type BoardComment = {
    id:number
    content:string
    created:string
    item:number|BoardItem
    parent:number|BoardComment
    author:number|Profile
}
export type BoardGroup = {
    id:number
    name:string
}
