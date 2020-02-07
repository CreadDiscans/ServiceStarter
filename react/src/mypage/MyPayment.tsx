import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Button } from 'reactstrap';

declare var IMP:any;
// IMP.init('imp54267999')

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
class Payment extends React.Component {

    payImp(info: PayInfo) {
        IMP.request_pay({
            pg: info.pg, // version 1.1.0부터 지원.
            pay_method: info.pay_method,
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: info.paid_name,
            amount: info.amount,
            buyer_email: info.email,
            buyer_name: info.buyer_name,
            buyer_tel: info.buyer_tel,
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
    }

    render() {
        return <div>
            <h3>Payment</h3>

            <Button>pay</Button>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({}),
    Payment
)