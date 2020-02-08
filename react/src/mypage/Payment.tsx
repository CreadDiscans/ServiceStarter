import React from 'react';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Button, FormGroup, Label, Input, ListGroup, ListGroupItem } from 'reactstrap';
import { MypageState, MypageAction } from './Mypage.action';
import { U } from 'app/core/U';

declare var IMP:any;
if (process.env.APP_ENV === 'browser') {
    IMP.init('imp54267999')
}

interface Props {
    location:Location
    mypage:MypageState
    MypageAction:typeof MypageAction
}
class Payment extends React.Component<Props> {

    state = {
        name:'김동삼',
        email:'creaddiscans@gmail.com',
        tel:'010-4045-0565',
        method:'card',
        type:''
    }

    static getDerivedStateFromProps(props:Props, state:any) {
        const {location} = props;
        console.log(location)
        return null;
    }

    componentDidMount() {
        const {MypageAction, location} = this.props;
        const path = location.pathname.split('/')
        if (path.length > 2) {
            this.setState({type:path[2]})
            MypageAction.loadPayment(path[2], U.getId(location))
        }
    }

    payImp() {
        const {mypage} = this.props;
        const productName = mypage.products[0].name + (mypage.products.length > 1 && ' 외' + (mypage.products.length-1)+'개')
        IMP.request_pay({
            pg: 'html5_inicis',
            pay_method: this.state.method,
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: productName,
            amount: mypage.products.map(product=>product.price).reduce((a,b)=>a+b),
            buyer_email: this.state.email,
            buyer_name: this.state.name,
            buyer_tel: this.state.tel,
            m_redirect_url: '/payment',
        }, (rsp:any)=> {
            if(rsp.success) {
                this.postImpPayment(rsp.imp_uid, rsp.merchant_uid)
            } else {
                alert('결제가 실패하였습니다.\n 내용 : '+rsp.error_msg);
            }
            console.log(rsp);
        })
    }

    postImpPayment(imp_uid:string, merchant_uid:string) {
        console.log(imp_uid, merchant_uid)
        // Api.create<any>('/api/my/my_iamport/validate/auth', {
        //     imp_uid: imp_uid,
        //     merchant_uid: merchant_uid,
        //     imp_id: PaymentService.imp_id
        // }).then(res=> {
        //     if(res.status === 'success') {
        //         console.log('성공');
        //     } else if (res.static === 'ready') {
        //         console.log('가상계좌 입금 대기');
        //     }
        //     console.log(res);
        // })

//         success: true
// imp_uid: "imp_531792725018"
// pay_method: "card"
// merchant_uid: "merchant_1581061792469"
// name: "Test Product"
// paid_amount: 1000
// currency: "KRW"
// pg_provider: "html5_inicis"
// pg_type: "payment"
// pg_tid: "StdpayCARDINIpayTest20200207165053574350"
// apply_num: "99580626"
// buyer_name: "김동삼"
// buyer_email: "creaddiscans@gmail.com"
// buyer_tel: "010-4045-0565"
// buyer_addr: ""
// buyer_postcode: ""
// custom_data: null
// status: "paid"
// paid_at: 1581061854
// receipt_url: "https://iniweb.inicis.com/DefaultWebApp/mall/cr/cm/mCmReceipt_head.jsp?noTid=StdpayCARDINIpayTest20200207165053574350&noMethod=1"
// card_name: "삼성카드"
// bank_name: null
// card_quota: 0
    }

    render() {
        const {mypage} = this.props;
        if (mypage.products.length === 0) return <div></div>
        return <div>
            <h3>Payment</h3>
            
            <div className="border border-rounded p-3">
                <h4>{mypage.products[0].name}{mypage.products.length > 1 && ' 외' + (mypage.products.length-1)+'개'}</h4>
                <ListGroup className="my-3">
                    {mypage.products.map(item=><ListGroupItem className="d-flex flex-row justify-content-between" key={item.id}>
                        <div>{item.name}</div>
                        <div>{U.comma(item.price)}원</div>
                    </ListGroupItem>)}
                </ListGroup>
                
                <FormGroup>
                    <Label>Name</Label>
                    <Input value={this.state.name} onChange={(e)=>this.setState({name:e.target.value})}/> 
                </FormGroup>
                <FormGroup>
                    <Label>Email</Label>
                    <Input value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})}/> 
                </FormGroup>
                <FormGroup>
                    <Label>Tel</Label>
                    <Input value={this.state.tel} onChange={(e)=>this.setState({tel:e.target.value})}/> 
                </FormGroup>
                <FormGroup>
                    <Label>Amount</Label>
                    <Input value={U.comma(mypage.products.map(product=>product.price).reduce((a,b)=>a+b))+'원'} readOnly />
                </FormGroup>
                <FormGroup>
                    <Label>Method</Label>
                    <Input value={this.state.method} type="select" onChange={(e)=>this.setState({method:e.target.value})}>
                        <option value={'card'}>카드</option>
                        <option value={'trans'}>실시간계좌이체</option>
                        <option value={'vbank'}>가상계좌</option>
                        <option value={'phone'}>핸드폰소액결제</option>
                    </Input>
                </FormGroup>
                <div className="text-right">
                    <Button color="primary"
                        onClick={()=>this.payImp()}>Pay</Button>
                </div>
            </div>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        mypage:state.mypage
    }),
    (dispatch:Dispatch)=>({
        MypageAction:binding(MypageAction, dispatch)
    }),
    Payment
)