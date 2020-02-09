import React from 'react';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { U } from 'app/core/U';
import { MypageAction, MypageState } from './Mypage.action';
import { AuthState } from 'auth/Auth.action';
import { Button, Card, CardTitle, CardBody, FormGroup, Label, Input, Col, Row, ListGroup, ListGroupItem } from 'reactstrap';
import { History } from 'history'
import { AlertSubject } from 'component/Alert';
import * as ApiType from 'types/api.types';
import moment from 'moment';
declare var IMP:any;

interface Props {
    location:Location
    auth:AuthState
    mypage:MypageState
    MypageAction: typeof MypageAction
    history:History
}

class Billing extends React.Component<Props> {

    state:any = {
        name:'',
        email:'',
        tel:'',
        isRequest:false,
        card:undefined
    }

    static getDerivedStateFromProps(props:Props, state:any) {
        if (state.isRequest) {
            const {location, auth} = props;
            if (isNaN(Number(U.getId(location))) && auth.userProfile) {
                MypageAction.loadBilling(auth.userProfile)
                return {isRequest:false}
            }
        }
        return null;
    }

    componentDidMount() {
        const {MypageAction, location, auth, history} = this.props;
        const id = U.getId(location);
        if (auth.userProfile) {
            MypageAction.loadMyCards(auth.userProfile)
            MypageAction.loadBilling(auth.userProfile)
        }
        if (isNaN(Number(id))) {
            this.setState({isRequest:false})
        } else {
            this.setState({isRequest:true})
            MypageAction.loadSubscription(id).then(({subscription})=> {
                if (!subscription.valid) {
                    history.push('/dashboard/shop')
                }
            })
        }
    }

    registerCard() {
        const {auth, MypageAction} = this.props;
        if (auth.userProfile) {
            const customer_uid = auth.userProfile.id+'_'+new Date().getTime()
            IMP.request_pay({
                pg:'"html5_inicis.INIBillTst"',
                pay_method:'card',
                merchant_uid:'issue_'+new Date().getTime(),
                customer_uid:customer_uid,
                name:'최초인증결제',
                amount:0,
                buyer_email:this.state.email,
                buyer_name:this.state.name,
                buyer_tel:this.state.tel
            }, (rsp:any)=> {
                if (rsp.success) {
                    auth.userProfile && MypageAction.registerCard(
                        customer_uid, 
                        auth.userProfile,
                        rsp.card_name,
                        rsp.buyer_name,
                        rsp.buyer_email,
                        rsp.buyer_tel)
                } else {
                    alert('카드 등록 실패')
                }
            })
        }
    }

    deleteCard(item:ApiType.ShopCard) {
        AlertSubject.next({
            title:'카드 삭제',
            content:'해당 카드로 구독중인 상품이 자동으로 해지됩니다.\n 계속하시겠습니까?',
            onConfirm:()=>{
                const {MypageAction, auth} = this.props;
                auth.userProfile && MypageAction.deleteCard(auth.userProfile, item)
                AlertSubject.next(undefined)
            },
            onCancel:()=>AlertSubject.next(undefined)
        })
    }

    subscribe(item:ApiType.ShopBilling|undefined = undefined) {
        if (this.state.card) {
            const {MypageAction, mypage, history, auth} = this.props;
            if (item) {
                auth.userProfile && MypageAction.expandBilling(auth.userProfile, item)
            } else if (mypage.subscription) {
                auth.userProfile && MypageAction.billing(auth.userProfile, this.state.card, mypage.subscription)
                .then(()=>history.push('/mypage/billing'))
            }
        } else {
            AlertSubject.next({
                title:'알림',
                content:'구독에 사용할 카드를 선택해주세요.\n등록된 카드가 없으면 카드 등록 후 구독해주세요.',
                onConfirm:()=>{
                    AlertSubject.next(undefined)
                },
                onCancel:()=>AlertSubject.next(undefined)
            })
        }
    }

    unsubscribe(item:ApiType.ShopBilling) {
        const { MypageAction, auth } = this.props;
        auth.userProfile && MypageAction.unbilling(auth.userProfile, item)
    }

    render() {
        const { mypage } = this.props;
        return <div>
            <h3>Subscription</h3>
            <h4>Credit Card</h4>
            <Row>
                <Col md={6}>
                    {mypage.cards.map(item=><Card 
                        color={(this.state.card && this.state.card.id === item.id) ? "success": ''} 
                        outline className="mb-3" key={item.id} 
                        onClick={()=>this.setState({card:item})}
                        style={{transition:'0.5s', cursor:'pointer'}}>
                        <CardBody>
                            <CardTitle>{item.name}</CardTitle>
                            <Button className="float-right" color="danger" onClick={()=>this.deleteCard(item)}>삭제</Button>
                        </CardBody>
                    </Card>)}
                </Col>
                <Col md={6}>
                    <div className="p-3 border border-rounded">
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
                        <Button color="primary" onClick={()=>this.registerCard()}>카드 등록</Button>
                    </div>
                </Col>
            </Row>
            {this.state.isRequest ? <div className="my-3"> 
                <h4>신규 구독</h4>
                {mypage.subscription && <ListGroup>
                    <ListGroupItem>
                        {mypage.subscription.name} - 월 {U.comma(mypage.subscription.price)}원
                        <Button className="btn-sm float-right" color={"success"} onClick={()=>this.subscribe()}>구독하기</Button>
                    </ListGroupItem>
                </ListGroup>}
            </div>:<div className="my-3">
                <h4>구독 내역</h4>
                <ListGroup>
                    {mypage.billings.map(item=><ListGroupItem key={item.id}>
                        {typeof item.subscription !== 'number' && item.subscription.name}
                        {' - '}
                        {moment(item.expired).format('YYYY.MM.DD')} 까지
                        {item.scheduled && <Button className="btn-sm float-right" color="danger" onClick={()=>this.unsubscribe(item)}>자동연장 취소</Button>}
                        {!item.scheduled && moment() < moment(item.expired) && item.card && item.subscription
                            && <Button className="btn-sm float-right" color="success" onClick={()=>this.subscribe(item)}>연장</Button>}
                    </ListGroupItem>)}
                </ListGroup>
            </div>}
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
    Billing
)