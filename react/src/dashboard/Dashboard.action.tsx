import { getHandleActions } from "app/core/connection"
import * as ApiType from 'types/api.types';
import { Api } from "app/core/Api";

export type DashboardState = {
    shopProducts:ApiType.ShopProduct[],
    shopProduct?:ApiType.ShopProduct
    shopCurrentPage:number
    shopTotalPage:number
    shopSubscriptions:ApiType.ShopSubscription[]
}

const initState:DashboardState = {
    shopProducts:[],
    shopCurrentPage:1,
    shopTotalPage:1,
    shopSubscriptions:[]
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
    }
}

export default getHandleActions(DashboardAction, initState)