import * as custom from './custom.types'

export type Device<A=number> = {
    id:number
    fcm_token:string
    type:string
    refresh_token:string
    profile:A // Profile
}
export type Media<A=number,B=number,C=number> = {
    id:number
    file:string
    boarditem:A // BoardItem
    shopproduct:B // ShopProduct
    profile:C // Profile
    extra:string
}
export type Profile<A=number> = {
    id:number
    user:A // custom.auth.User
    name:string
    profile_img:string
}
export type MonitorUsage<A=number,B=number> = {
    id:number
    percent:number
    dt:string
    cpu:A // MonitorCpu
    memory:B // MonitorMemory
}
export type MonitorCpu<A=number> = {
    id:number
    name:string
    server:A // MonitorServer
}
export type MonitorMemory<A=number> = {
    id:number
    total:number
    server:A // MonitorServer
}
export type MonitorServer = {
    id:number
    address:string
    keep_day:number
}
export type ChatMessage<A=number,B=number> = {
    id:number
    sender:A // Profile
    content:string
    created:string
    room:B // ChatRoom
}
export type ChatRoom<A=number> = {
    id:number
    user:A[] // Profile[]
}
export type BoardComment<A=number,B=number,C=number> = {
    id:number
    content:string
    created:string
    author:A // Profile
    item:B // BoardItem
    parent:C // BoardComment
}
export type BoardItem<A=number,B=number> = {
    id:number
    title:string
    content:string
    created:string
    modified:string
    author:A // Profile
    valid:boolean
    group:B // BoardGroup
}
export type BoardGroup = {
    id:number
    name:string
    readonly:boolean
}
export type ShopCart<A=number,B=number> = {
    id:number
    isOpen:boolean
    profile:A // Profile
    product:B[] // ShopProduct
}
export type ShopProduct = {
    id:number
    name:string
    price:number
    valid:boolean
    content:string
}
export type ShopSubscription = {
    id:number
    name:string
    price:number
    valid:boolean
}
export type ShopPayment<A=number> = {
    id:number
    imp_uid:string
    status:string
    vbank:string
    cart:A // ShopCart
}
export type ShopBilling<A=number,B=number,C=number> = {
    id:number
    profile:A // Profile
    created:string
    expired:string
    scheduled:boolean
    imp_uid:string
    merchant_uid:string
    subscription:B // ShopSubscription
    card:C // ShopCard
}
export type ShopCard<A=number> = {
    id:number
    name:string
    customer_uid:string
    profile:A // Profile
    buyer_name:string
    buyer_email:string
    buyer_tel:string
}
export type TaskWork<A=number> = {
    id:number
    owner:A // Profile
    progress:number
    status:string
    body:string
}
export type TaskClient<A=number> = {
    id:number
    channel_name:string
    work:A // TaskWork
}
