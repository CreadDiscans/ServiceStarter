import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Jumbotron, Button, Form, FormGroup, Label, Input } from 'reactstrap';

declare var IMP:any;
IMP.init('imp54267999')

type PayInfo = {
    pg: string; // PG'kakao':카카오페이, html5_inicis':이니시스(웹표준결제), 'nice':나이스페이, 'jtnet':제이티넷, 'uplus':LG유플러스, 'danal':다날, 'payco':페이코, 'syrup':시럽페이, 'paypal':페이팔
    pay_method: string; // 'samsung':삼성페이, 'card':신용카드, 'trans':실시간계좌이체, 'vbank':가상계좌, 'phone':휴대폰소액결제
    email: string;
    amount: number; // 결제금액
    buyer_tel: string;
    buyer_name: string;
    user_detail_id: string;
    paid_name: string;
    score_type_id: string;
    customer_uid?: string;
}

interface Props {

}

class Payment extends React.Component<Props> {
    
    state = {
        productName: 'Test Product',
        name:'김동삼',
        email:'creaddiscans@gmail.com',
        tel:'010-4045-0565',
        amount:1000,
        method:'card'
    }

    payImp() {
        IMP.request_pay({
            pg: 'html5_inicis',
            pay_method: 'card',
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: this.state.productName,
            amount: this.state.amount,
            buyer_email: this.state.email,
            buyer_name: this.state.name,
            buyer_tel: this.state.tel,
            m_redirect_url: '/payment/redirect',
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
        return <div>
            <h3>Payment</h3>
            <Jumbotron>
                <h1 className="display-3">Hello, world!</h1>
                <p className="lead">This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.</p>
                <hr className="my-2" />
                <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                <p className="lead">
                </p>
            </Jumbotron>
            <div className="border border-rounded p-3">
                <h4>{this.state.productName}</h4>
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
                    <Input value={this.state.amount} disabled />
                </FormGroup>
                <FormGroup>
                    <Label>Method</Label>
                    <Input value={this.state.method} type="select">
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
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({}),
    Payment
)