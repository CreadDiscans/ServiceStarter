import React from 'react';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Button, FormGroup, Label, Input, ListGroup, ListGroupItem } from 'reactstrap';
import { MypageState, MypageAction } from './Mypage.action';
import { U } from 'app/core/U';
import { History } from 'history';
import { AuthState } from 'auth/Auth.action';
import { translation } from 'component/I18next';
declare var IMP:any;
const impId = 'imp54267999'
if (process.env.APP_ENV === 'browser') {
    IMP.init(impId)
}

interface Props {
    location:Location
    auth:AuthState
    mypage:MypageState
    MypageAction:typeof MypageAction
    history:History
}
class Payment extends React.Component<Props> {

    t = translation('payment',[
        "payment",
        "except",
        "ea",
        "name",
        "email",
        "tel",
        "amount",
        "method",
        "pay",
        "won",
        "failtopay"
    ])

    state = {
        name:'',
        email:'',
        tel:'',
        method:'card',
        type:'',
        pending: false
    }

    static getDerivedStateFromProps(props:Props, state:any) {
        const {location, MypageAction, auth, history} = props;
        const query = U.parseQuery(location.search);
        if (query.imp_uid && auth.userProfile && !state.pending) {
            const path = location.pathname.split('/')
            MypageAction.postPayment(path[2], U.getId(location), query.imp_uid, auth.userProfile)
            .then(()=> history.push('/mypage/cart'))
            return {pending:true}
        }
        return null;
    }

    componentDidMount() {
        const {MypageAction, location} = this.props;
        const path = location.pathname.split('/')
        if (path.length > 3) {
            this.setState({type:path[2]})
            MypageAction.loadPayment(path[2], U.getId(location))
        }
    }

    payImp() {
        const {mypage, history, location} = this.props;
        const productName = mypage.products[0].name + (mypage.products.length > 1 ? this.t.except + (mypage.products.length-1)+this.t.ea : '')
        const path = '/mypage/'+this.state.type+'/'+U.getId(location)
        IMP.request_pay({
            pg: 'html5_inicis',
            pay_method: this.state.method,
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: productName,
            amount: mypage.products.map(product=>product.price).reduce((a,b)=>a+b),
            buyer_email: this.state.email,
            buyer_name: this.state.name,
            buyer_tel: this.state.tel,
            m_redirect_url: location.origin + path
        }, (rsp:any)=> {
            if(rsp.success) {
                history.push(path+'?imp_uid='+rsp.imp_uid)
            } else {
                alert(this.t.failtopay+rsp.error_msg);
            }
        })
    }

    render() {
        const {mypage} = this.props;
        if (mypage.products.length === 0) return <div></div>
        return <div>
            <h3>Payment</h3>
            
            <div className="border border-rounded p-3">
                <h4>{mypage.products[0].name}{mypage.products.length > 1 && this.t.except + (mypage.products.length-1)+this.t.ea}</h4>
                <ListGroup className="my-3">
                    {mypage.products.map(item=><ListGroupItem className="d-flex flex-row justify-content-between" key={item.id}>
                        <div>{item.name}</div>
                        <div>{U.comma(item.price)}{this.t.won}</div>
                    </ListGroupItem>)}
                </ListGroup>
                
                <FormGroup>
                    <Label>{this.t.name}</Label>
                    <Input value={this.state.name} onChange={(e)=>this.setState({name:e.target.value})}/> 
                </FormGroup>
                <FormGroup>
                    <Label>{this.t.email}</Label>
                    <Input value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})}/> 
                </FormGroup>
                <FormGroup>
                    <Label>{this.t.tel}</Label>
                    <Input value={this.state.tel} onChange={(e)=>this.setState({tel:e.target.value})}/> 
                </FormGroup>
                <FormGroup>
                    <Label>{this.t.amount}</Label>
                    <Input value={U.comma(mypage.products.map(product=>product.price).reduce((a,b)=>a+b))+this.t.won} readOnly />
                </FormGroup>
                <FormGroup>
                    <Label>{this.t.method}</Label>
                    <Input value={this.state.method} type="select" onChange={(e)=>this.setState({method:e.target.value})}>
                        <option value={'card'}>카드</option>
                        <option value={'trans'}>실시간계좌이체</option>
                        <option value={'vbank'}>가상계좌</option>
                    </Input>
                </FormGroup>
                <div className="text-right">
                    <Button color="primary"
                        onClick={()=>this.payImp()}>{this.t.pay}</Button>
                </div>
            </div>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        auth:state.auth,
        mypage:state.mypage
    }),
    (dispatch:Dispatch)=>({
        MypageAction:binding(MypageAction, dispatch)
    }),
    Payment
)