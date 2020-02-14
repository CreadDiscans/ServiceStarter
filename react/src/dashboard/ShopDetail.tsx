import React from 'react';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Jumbotron, Button } from 'reactstrap';
import { DashboardAction, DashboardState } from './Dashboard.action';
import { U } from 'app/core/U';
import { History } from 'history';
import { AuthState } from 'auth/Auth.action';
import { MypageAction } from 'mypage/Mypage.action';
import { SharedAction } from 'component/Shared.action';

interface Props {
    auth:AuthState
    dashboard:DashboardState
    DashboardAction: typeof DashboardAction
    MypageAction: typeof MypageAction
    SharedAct: typeof SharedAction
    location: Location
    history: History
}

class Payment extends React.Component<Props> {

    componentDidMount() {
        const { DashboardAction, location } = this.props;
        DashboardAction.loadShopProduct(U.getId(location))
    }

    addToCart() {
        const { auth, dashboard, history, MypageAction, SharedAct } = this.props;
        if (auth.userProfile && dashboard.shopProduct) {
            MypageAction.addShopCart(auth.userProfile, dashboard.shopProduct)
            .then(()=> {
                SharedAct.alert({
                    title:'Add to cart',
                    content:'장바구니에 상품을 담았습니다.\n 장바구니를 확인하시겠습니까?',
                    onConfirm:()=> {
                        history.push('/mypage/cart')
                        SharedAct.alert(undefined)
                    },
                    onCancel:()=> SharedAct.alert(undefined)
                })
            })
        }
    }

    render() {
        const { dashboard, history } = this.props;
        if (!dashboard.shopProduct) return <div></div>
        return <div>
            <h3>Shop Detail</h3>
            <Jumbotron>
                <h1 className="display-3">{dashboard.shopProduct.name}</h1>
                <div dangerouslySetInnerHTML={{__html:dashboard.shopProduct.content}}></div>
            </Jumbotron>
            <div className="text-right">
                <Button className="m-1" color="info" 
                onClick={()=>dashboard.shopProduct && history.push('/mypage/payment/'+dashboard.shopProduct.id)}>Buy</Button>
                <Button className="m-1" color="info" onClick={()=>this.addToCart()}>Add to cart</Button>
            </div>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth:state.auth,
        dashboard:state.dashboard
    }),
    (dispatch:Dispatch)=>({
        DashboardAction:binding(DashboardAction, dispatch),
        MypageAction:binding(MypageAction, dispatch),
        SharedAct:binding(SharedAction, dispatch)
    }),
    Payment
)