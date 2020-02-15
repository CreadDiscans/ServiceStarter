import * as custom from './custom.types'

export type Device = {
    id:number
    fcm_token:string
    profile:number|Profile
}
export type Media = {
    id:number
    file:string
    boarditem:number|BoardItem
    shopproduct:number|ShopProduct
    profile:number|Profile
}
export type Profile = {
    id:number
    user:number|custom.auth.User
    name:string
    profile_img:string
}
export type BoardItem = {
    id:number
    title:string
    content:string
    created:string
    modified:string
    author:number|Profile
    valid:boolean
    group:number|BoardGroup
}
export type BoardComment = {
    id:number
    content:string
    created:string
    author:number|Profile
    item:number|BoardItem
    parent:number|BoardComment
}
export type BoardGroup = {
    id:number
    name:string
    readonly:boolean
}
export type TaskClient = {
    id:number
    channel_name:string
    work:number|TaskWork
}
export type TaskWork = {
    id:number
    owner:number|Profile
    progress:number
    status:string
    body:string
}
export type ShopSubscription = {
    id:number
    name:string
    price:number
    valid:boolean
}
export type ShopBilling = {
    id:number
    profile:number|Profile
    created:string
    expired:string
    scheduled:boolean
    imp_uid:string
    merchant_uid:string
    subscription:number|ShopSubscription
    card:number|ShopCard
}
export type ShopCart = {
    id:number
    isOpen:boolean
    profile:number|Profile
    product:number[]|ShopProduct[]
}
export type ShopCard = {
    id:number
    name:string
    customer_uid:string
    profile:number|Profile
    buyer_name:string
    buyer_email:string
    buyer_tel:string
}
export type ShopProduct = {
    id:number
    name:string
    price:number
    valid:boolean
    content:string
}
export type ShopPayment = {
    id:number
    imp_uid:string
    status:string
    vbank:string
    cart:number|ShopCart
}
export type ChatRoom = {
    id:number
    user:number[]|Profile[]
}
export type ChatMessage = {
    id:number
    sender:number|Profile
    content:string
    created:string
    room:number|ChatRoom
}
