import * as custom from './custom.types'

export type Device<A=number> = {
    id:number
    fcm_token:string
    type:string
    refresh_token:string
    profile:A
}
export type Media<A=number,B=number,C=number> = {
    id:number
    file:string
    boarditem:A
    shopproduct:B
    profile:C
    extra:string
}
export type Profile<A=number> = {
    id:number
    user:A
    name:string
    profile_img:string
}
export type MonitorUsage<A=number,B=number> = {
    id:number
    percent:number
    dt:string
    cpu:A
    memory:B
}
export type MonitorCpu<A=number> = {
    id:number
    name:string
    server:A
}
export type MonitorMemory<A=number> = {
    id:number
    total:number
    server:A
}
export type MonitorServer = {
    id:number
    address:string
    keep_day:number
}
export type ChatMessage<A=number,B=number> = {
    id:number
    sender:A
    content:string
    created:string
    room:B
}
export type ChatRoom<A=number> = {
    id:number
    user:A[]
}
export type BoardComment<A=number,B=number,C=number> = {
    id:number
    content:string
    created:string
    author:A
    item:B
    parent:C
}
export type BoardItem<A=number,B=number> = {
    id:number
    title:string
    content:string
    created:string
    modified:string
    author:A
    valid:boolean
    group:B
}
export type BoardGroup = {
    id:number
    name:string
    readonly:boolean
}
export type ShopCart<A=number,B=number> = {
    id:number
    isOpen:boolean
    profile:A
    product:B[]
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
    cart:A
}
export type ShopBilling<A=number,B=number,C=number> = {
    id:number
    profile:A
    created:string
    expired:string
    scheduled:boolean
    imp_uid:string
    merchant_uid:string
    subscription:B
    card:C
}
export type ShopCard<A=number> = {
    id:number
    name:string
    customer_uid:string
    profile:A
    buyer_name:string
    buyer_email:string
    buyer_tel:string
}
export type TaskWork<A=number> = {
    id:number
    owner:A
    progress:number
    status:string
    body:string
}
export type TaskClient<A=number> = {
    id:number
    channel_name:string
    work:A
}
