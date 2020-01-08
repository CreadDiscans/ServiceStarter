import { Singletone } from "./Singletone";
import InAppBilling, { ISubscriptionDetails, IProductDetails } from 'react-native-billing';

export class BillingService extends Singletone<BillingService> {

    subscriptions!:ISubscriptionDetails[]
    products!:IProductDetails[]
    ownedSubscription!:string[]
    ownedProducts!:string[]

    constructor() {
        super()
        this.init()
    }

    private async action(func:Function) {
        let result;
        try {
            await InAppBilling.open()
            result = await func()
        } catch(e) {
            Promise.reject(e)
        } finally {
            InAppBilling.close()
        }
        return Promise.resolve(result)
    }

    async init() {
        return this.action(async()=> {
            await InAppBilling.loadOwnedPurchasesFromGoogle()
            this.subscriptions = await InAppBilling.getSubscriptionDetailsArray([
                // Subsciption ID
            ]);
            this.products = await InAppBilling.getProductDetailsArray([
                // Product ID
            ]);
            this.ownedSubscription = await InAppBilling.listOwnedSubscriptions()
            this.ownedProducts = await InAppBilling.listOwnedProducts()
            return Promise.resolve()
        })
    }

    async purchase(productId:string, withConsume=false) {
        return this.action(async()=> {
            const details = await InAppBilling.purchase(productId);
            if (withConsume) {
                await InAppBilling.consumePurchase(productId)
            }
            this.ownedProducts = await InAppBilling.listOwnedProducts()
            return Promise.resolve(details)
        })
    }

    async consume(productId:string) {
        return this.action(async()=> {
            await InAppBilling.consumePurchase(productId)
            this.ownedProducts = await InAppBilling.listOwnedProducts()
            return Promise.resolve()
        })
    }

    async subscribe(productId:string) {
        return this.action(async()=> {
            await InAppBilling.subscribe(productId)
            this.ownedSubscription = await InAppBilling.listOwnedSubscriptions()
            return Promise.resolve()
        })
    }

    async updateSubscription(oldProductId:string, productId:string) {
        return this.action(async()=> {
            await InAppBilling.updateSubscription([oldProductId], productId)
            return Promise.resolve()
        })
    }
}