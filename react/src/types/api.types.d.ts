import * as custom from './custom.types'

export type Media = {
    id:number
    file:string
    boarditem:number|BoardItem
}
export type Profile = {
    id:number
    user:number|custom.auth.User
    name:string
}
export type BoardItem = {
    id:number
    title:string
    content:string
    created:string
    modified:string
    author_name:string
    valid:boolean
    group:number|BoardGroup
    author:number|Profile
}
export type BoardComment = {
    id:number
    content:string
    created:string
    author_name:string
    item:number|BoardItem
    parent:number|BoardComment
    author:number|Profile
}
export type BoardGroup = {
    id:number
    name:string
}
