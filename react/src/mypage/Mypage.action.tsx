import { getHandleActions } from "app/core/connection"
import * as ApiType from 'types/api.types';
import { Api } from "app/core/Api";
import { U } from "app/core/U";

export type MypageState = {
    carts:ApiType.ShopCart[]
    cartCurrentPage:number
    cartTotalPage:number
    products:ApiType.ShopProduct[]
    payments:ApiType.ShopPayment[]
    subscription?:ApiType.ShopSubscription
    cards:ApiType.ShopCard[]
    billings:ApiType.ShopBilling[]
}

const initState:MypageState = {
    carts:[],
    cartCurrentPage:1,
    cartTotalPage:1,
    products:[],
    payments:[],
    cards:[],
    billings:[]
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
            'pk__in[]':pid,
            valid:1
        })
        res.items.forEach(item=>{
            item.product = U.union((item.product as number[]).map(id=> products.filter(p=> p.id === id)))
        })
        const payments = await Api.list<ApiType.ShopPayment[]>('/api-shop/payment/', {
            'cart__in[]':res.items.map(item=>item.id)
        })
        return Promise.resolve({
            cartCurrentPage:page,
            cartTotalPage:res.total_page,
            carts:res.items,
            payments:payments
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
    },
    loadPayment:async(type:string, id:string)=> {
        if (type === 'cart') {
            const cart = await Api.retrieve<ApiType.ShopCart>('/api-shop/cart/', id, {})
            const products = await Api.list<ApiType.ShopProduct[]>('/api-shop/product/', {
                'id__in[]':cart.product,
                valid:1
            })
            return Promise.resolve({products:products})
        } else if (type === 'payment') {
            const product = await Api.retrieve<ApiType.ShopProduct>('/api-shop/product/', id,{})
            if (product.valid)
                return Promise.resolve({products:[product]})
            else
                return Promise.reject()
        }
    },
    postPayment:async(type:string, id:string, imp_uid:string, profile:ApiType.Profile)=> {
        const res = await Api.create<{pk:number, status:string}>('/payment/', {
            imp_uid:imp_uid,
            type:type,
            id:id
        })
        let cart!:ApiType.ShopCart
        if (type === 'cart') {
            cart = await Api.patch<ApiType.ShopCart>('/api-shop/cart/', id, {
                isOpen:0,
            })
        } else if (type === 'payment') {
            cart = await Api.create<ApiType.ShopCart>('/api-shop/cart/', {
                isOpen:0,
                product:[id],
                profile:profile.id
            })
        }
        await Api.patch<ApiType.ShopPayment>('/api-shop/payment/', res.pk, {
            cart:cart.id
        })
        return Promise.resolve({})
    },
    loadSubscription:async(id:string)=> {
        const sub = await Api.retrieve<ApiType.ShopSubscription>('/api-shop/subscription/', id, {})
        return Promise.resolve({subscription:sub})
    },
    loadMyCards:async(profile:ApiType.Profile)=> {
        const cards = await Api.list<ApiType.ShopCard[]>('/api-shop/card/', {
            profile:profile.id
        })
        return Promise.resolve({cards:cards})
    },
    registerCard:async(customer_uid:string, profile:ApiType.Profile, cardname:string, name:string, email:string, tel:string)=> {
        await Api.create<ApiType.ShopCard>('/api-shop/card/',{
            customer_uid:customer_uid,
            profile:profile.id,
            name:cardname,
            buyer_name:name,
            buyer_email:email,
            buyer_tel:tel
        })
        return MypageAction.loadMyCards(profile)
    },
    deleteCard:async(profile:ApiType.Profile, card:ApiType.ShopCard) => {
        await Api.create('/billings/', {
            type:'deleteCard',
            card_id:card.id
        })
        await Api.delete('/api-shop/card/', card.id)
        const res1 = await MypageAction.loadBilling(profile)
        const res2 = await MypageAction.loadMyCards(profile)
        return Promise.resolve({...res1, ...res2})
    },
    billing:async(profile:ApiType.Profile, card:ApiType.ShopCard, subscription:ApiType.ShopSubscription)=> {
        await Api.create('/billings/', {
            type:'subscribe',
            card_id:card.id,
            subscription_id:subscription.id
        })
        return MypageAction.loadBilling(profile)
    },
    unbilling:async(profile:ApiType.Profile, billing:ApiType.ShopBilling)=>{
        await Api.create('/billings/',{
            type:'unsubscribe',
            billing_id:billing.id
        })
        return MypageAction.loadBilling(profile)
    },
    expandBilling:async(profile:ApiType.Profile, billing:ApiType.ShopBilling)=>{
        await Api.create('/billings/',{
            type:'expand',
            imp_uid:billing.imp_uid
        })
        return MypageAction.loadBilling(profile)
    },
    loadBilling:async(profile:ApiType.Profile)=>{
        const res = await Api.list<{total_page:Number, items:ApiType.ShopBilling[]}>('/api-shop/billing/',{
            page:1,
            count_per_page:10,
            profile:profile.id
        })
        const subs = await Api.list<ApiType.ShopSubscription[]>('/api-shop/subscription/', {
            'pk__in[]':res.items.map(item=>item.id)
        })
        res.items.forEach(billing=> {
            billing.subscription = subs.filter(sub=>billing.subscription == sub.id)[0]
        })
        return Promise.resolve({billings:res.items})
    }
}

export default getHandleActions(MypageAction, initState)