import React from 'react';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { AuthState } from 'auth/Auth.action';
import { MypageAction, MypageState } from './Mypage.action';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import * as ApiType from 'types/api.types';
import { U } from 'app/core/U';
import { History } from 'history';
import { Paginator } from 'component/Paginator';
interface Props {
    auth:AuthState
    mypage:MypageState
    MypageAction: typeof MypageAction
    history:History
}

class Cart extends React.Component<Props> {

    componentDidMount() {
        const {MypageAction, auth} = this.props;
        if (auth.userProfile) {
            MypageAction.loadCart(1, auth.userProfile)
        }
    }

    addToCart(item:ApiType.ShopProduct) {
        const { MypageAction, auth} = this.props;
        if (auth.userProfile) {
            MypageAction.addShopCart(auth.userProfile, item)
            .then(()=> auth.userProfile && MypageAction.loadCart(1, auth.userProfile))
        }
    }

    remove(product:ApiType.ShopProduct, cart:ApiType.ShopCart) {
        const { MypageAction, auth } = this.props;
        MypageAction.removeShopCart(cart, product)
        .then(()=> auth.userProfile && MypageAction.loadCart(1, auth.userProfile))
    }

    render() {
        const { MypageAction, mypage, history, auth } = this.props;
        return <div>
            <h3>Cart</h3>
            <ListGroup>
                {mypage.carts.filter(item=>item.product.length > 0).map(item=> <ListGroupItem key={item.id}>
                        <h5>{!item.isOpen && '[구매완료] '} 
                        {(item.product[0] as ApiType.ShopProduct).name}
                        {item.product.length > 1 && ' 외 '+ (item.product.length-1) +'개'}</h5>
                        <div className="p-3">
                            {(item.product as ApiType.ShopProduct[]).map(product=><div key={product.id}>
                                <a onClick={()=>product.valid && history.push('/dashboard/shop/'+product.id)}>{product.name} - {U.comma(product.price)}원</a>
                                {item.isOpen ? 
                                <Button className="btn-sm float-right" onClick={()=>this.remove(product, item)}>삭제</Button>:
                                <Button className="btn-sm float-right" onClick={()=>this.addToCart(product)}>장바구니 담기</Button>}
                            </div>)}
                        </div>
                        합계 : {U.comma((item.product as ApiType.ShopProduct[]).map(p=>p.price).reduce((a,b)=>a+b))}원
                        {item.isOpen && <Button className="float-right" color="primary" onClick={()=>history.push('/mypage/cart/'+item.id)}>구매하기</Button>}
                </ListGroupItem>)}
            </ListGroup>
            <div className="my-3 d-flex flex-row justify-content-center">
                <Paginator 
                    currentPage={mypage.cartCurrentPage}
                    totalPage={mypage.cartTotalPage}
                    onSelect={(page:number)=> auth.userProfile && MypageAction.loadCart(page, auth.userProfile)}/>
            </div>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        mypage:state.mypage,
        auth:state.auth
    }),
    (dispatch:Dispatch)=>({
        MypageAction:binding(MypageAction, dispatch),
    }),
    Cart
)