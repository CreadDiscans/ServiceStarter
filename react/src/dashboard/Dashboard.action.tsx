import { getHandleActions } from "app/core/connection"
import * as ApiType from 'types/api.types';
import { Api } from "app/core/Api";
import { U } from "app/core/U";

export type DashboardState = {
    shopProducts:ApiType.ShopProduct[],
    shopProduct?:ApiType.ShopProduct
    shopCurrentPage:number
    shopTotalPage:number
    shopSubscriptions:ApiType.ShopSubscription[]
    chatRooms:ApiType.ChatRoom[]
}

const initState:DashboardState = {
    shopProducts:[],
    shopCurrentPage:1,
    shopTotalPage:1,
    shopSubscriptions:[],
    chatRooms:[]
}

export const DashboardAction = {
    loadShopProducts:async(page:number)=> {
        const res = await Api.list<{total_page:number, items:ApiType.ShopProduct[]}>('/api-shop/product/', {
            page:1,
            valid:1,
            count_per_page: 12
        })
        return Promise.resolve({
            shopProducts:res.items,
            shopCurrentPage:page,
            shopTotalPage:res.total_page
        })
    },
    loadShopProduct:async(id:string)=> {
        const res = await Api.retrieve<ApiType.ShopProduct>('/api-shop/product/', id, {})
        return Promise.resolve({shopProduct:res})
    },
    loadShopSubscriptions:async()=> {
        const subs = await Api.list<ApiType.ShopSubscription[]>('/api-shop/subscription/', {
            valid:1
        })
        return Promise.resolve({
            shopSubscriptions:subs
        })
    },
    loadChatRoom:async(profile:ApiType.Profile)=>{
        const rooms = await Api.list<ApiType.ChatRoom[]>('/api-chat/room/',{
            'user':profile.id,
        })
        const profiles = await Api.list<ApiType.Profile[]>('/api-profile/',{
            'pk__in[]':U.union(rooms.map(room=>room.user))
        })
        rooms.forEach(room=>{
            room.user = (room.user as number[]).map(user=> profiles.filter(p=>p.id === user)[0])
        })
        return Promise.resolve({chatRooms:rooms})
    },
    exitChatRoom:async(profile:ApiType.Profile, room:ApiType.ChatRoom)=> {
        const chatRoom = await Api.retrieve<ApiType.ChatRoom>('/api-chat/room/', room.id,{})
        if (chatRoom.user.length === 1) {
            await Api.delete('/api-chat/room/',chatRoom.id)
        } else {
            await Api.update('/api-chat/room/',chatRoom.id,{
                user:(chatRoom.user as number[]).filter(user=> user !== profile.id)
            })
        }
        return DashboardAction.loadChatRoom(profile)
    }
}

export default getHandleActions(DashboardAction, initState)