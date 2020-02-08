import { getHandleActions } from "app/core/connection"
import * as ApiType from 'types/api.types';
import { Api } from "app/core/Api";
import { U } from "app/core/U";

export type MypageState = {
    carts:ApiType.ShopCart[]
    cartCurrentPage:number
    cartTotalPage:number
}

const initState:MypageState = {
    carts:[],
    cartCurrentPage:1,
    cartTotalPage:1
}

export const MypageAction = {
    loadCart:async(page:number, profile:ApiType.Profile)=>{
        const res = await Api.list<{total_page:number, items:ApiType.ShopCart[]}>('/api-shop/cart/',{
            page:page,
            profile:profile.id,
            count_per_page:10,
        })
        const pid = U.union(res.items.map(item=>item.product))
        const products = await Api.list<ApiType.ShopProduct[]>('/api-shop/product/', {
            'pk__in[]':pid
        })
        res.items.forEach(item=>{
            item.product = U.union((item.product as number[]).map(id=> products.filter(p=>p.id === id)))
        })
        return Promise.resolve({
            cartCurrentPage:page,
            cartTotalPage:res.total_page,
            carts:res.items
        })
    },
    addShopCart:async(profile:ApiType.Profile, product:ApiType.ShopProduct)=> {
        const res = await Api.list<ApiType.ShopCart[]>('/api-shop/cart/', {
            isOpen:1
        })
        let cart;
        if (res.length === 0) {
            cart = await Api.create<ApiType.ShopCart>('/api-shop/cart/',{
                isOpen:1,
                profile:profile.id
            })
        } else {
            cart = res[0];
        }
        await Api.patch<ApiType.ShopCart>('/api-shop/cart/', cart.id, {
            product:(cart.product as number[]).concat([product.id])
        })
        return Promise.resolve({})
    },
    removeShopCart:async(cart:ApiType.ShopCart, product:ApiType.ShopProduct) => {
        await Api.patch<ApiType.ShopCart>('/api-shop/cart/', cart.id, {
            product:    (cart.product as ApiType.ShopProduct[])
                .filter(item=> item.id !== product.id)
                .map(item=>item.id)
        })
        return Promise.resolve({})
    }
}

export default getHandleActions(MypageAction, initState)