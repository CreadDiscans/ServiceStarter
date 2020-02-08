import * as custom from './custom.types'

export type Media = {
    id:number
    file:string
    boarditem:number|BoardItem
    shopproduct:number|ShopProduct
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
    author:number|Profile
    author_name:string
    valid:boolean
    group:number|BoardGroup
}
export type BoardComment = {
    id:number
    content:string
    created:string
    author:number|Profile
    author_name:string
    item:number|BoardItem
    parent:number|BoardComment
}
export type BoardGroup = {
    id:number
    name:string
    readonly:boolean
}
export type ShopCart = {
    id:number
    isOpen:boolean
    profile:number|Profile
    product:number[]|ShopProduct[]
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
    name:string
    paid_amount:number
    buyer_name:string
    buyer_email:string
    buyer_tel:string
    buyer_addr:string
    buyer_postcode:string
    cart:number|ShopCart
}
