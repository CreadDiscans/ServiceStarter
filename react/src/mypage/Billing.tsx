import React from 'react';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { U } from 'app/core/U';
import { MypageAction, MypageState } from './Mypage.action';
import { AuthState } from 'auth/Auth.action';
import { Button, Card, CardTitle, CardBody, FormGroup, Label, Input, Col, Row, ListGroup, ListGroupItem } from 'reactstrap';
import { History } from 'history'
import * as ApiType from 'types/api.types';
import moment from 'moment';
import { SharedAction } from 'component/Shared.action';
import { translation } from 'component/I18next';
declare var IMP:any;

interface Props {
    location:Location
    auth:AuthState
    mypage:MypageState
    MypageAction: typeof MypageAction
    SharedAct: typeof SharedAction
    history:History
}

class Billing extends React.Component<Props> {

    t = translation('billing',[
        "alert",
        "alreadysub",
        "failregister",
        "deletecard",
        "deletecardbody",
        "selectcard",
        "subscription",
        "creditcard",
        "delete",
        "name",
        "email",
        "tel",
        "register",
        "newsub",
        "month",
        "won",
        "subscribe",
        "history",
        "until",
        "cancel",
        "extention"
    ])

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
        const {MypageAction, location, auth, history, SharedAct} = this.props;
        const id = U.getId(location);
        if (auth.userProfile) {
            MypageAction.loadMyCards(auth.userProfile)
            MypageAction.loadBilling(auth.userProfile)
        }
        if (isNaN(Number(id))) {
            this.setState({isRequest:false})
        } else {
            this.setState({isRequest:true})
            auth.userProfile && MypageAction.loadSubscription(auth.userProfile, id).then(({subscription})=> {
                if (!subscription.valid) {
                    history.push('/dashboard/shop')
                }
            }).catch(()=> {
                SharedAct.alert({
                    title:this.t.alert,
                    content:this.t.alreadysub,
                    onConfirm:()=>{
                        history.push('/mypage/billing')
                        SharedAct.alert(undefined)
                    },
                    onCancel:undefined
                })
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
                    alert(this.t.failregister)
                }
            })
        }
    }

    deleteCard(item:ApiType.ShopCard) {
        const {SharedAct} = this.props
        SharedAct.alert({
            title:this.t.deletecard,
            content:this.t.deletecardbody,
            onConfirm:()=>{
                const {MypageAction, auth} = this.props;
                auth.userProfile && MypageAction.deleteCard(auth.userProfile, item)
                SharedAct.alert(undefined)
            },
            onCancel:()=>SharedAct.alert(undefined)
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
            const {SharedAct} = this.props
            SharedAct.alert({
                title:this.t.alert,
                content: this.t.selectcard,
                onConfirm:()=>{
                    SharedAct.alert(undefined)
                },
                onCancel:()=>SharedAct.alert(undefined)
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
            <h3>{this.t.subscription}</h3>
            <h4>{this.t.creditcard}</h4>
            <Row>
                <Col md={6}>
                    {mypage.cards.map(item=><Card 
                        color={(this.state.card && this.state.card.id === item.id) ? "success": ''} 
                        outline className="mb-3" key={item.id} 
                        onClick={()=>this.setState({card:item})}
                        style={{transition:'0.5s', cursor:'pointer'}}>
                        <CardBody>
                            <CardTitle>{item.name}</CardTitle>
                            <Button className="float-right" color="danger" onClick={()=>this.deleteCard(item)}>{this.t.delete}</Button>
                        </CardBody>
                    </Card>)}
                </Col>
                <Col md={6}>
                    <div className="p-3 border border-rounded">
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
                        <Button color="primary" onClick={()=>this.registerCard()}>{this.t.register}</Button>
                    </div>
                </Col>
            </Row>
            {this.state.isRequest ? <div className="my-3"> 
                <h4>{this.t.newsub}</h4>
                {mypage.subscription && <ListGroup>
                    <ListGroupItem>
                        {mypage.subscription.name} - {this.t.month} {U.comma(mypage.subscription.price)}{this.t.won}
                        <Button className="btn-sm float-right" color={"success"} onClick={()=>this.subscribe()}>{this.t.subscribe}</Button>
                    </ListGroupItem>
                </ListGroup>}
            </div>:<div className="my-3">
                <h4>{this.t.history}</h4>
                <ListGroup>
                    {mypage.billings.map(item=><ListGroupItem key={item.id}>
                        {item.subscription && typeof item.subscription !== 'number' && item.subscription.name}
                        {' - '}
                        {moment(item.expired).format('YYYY.MM.DD')} {this.t.until}
                        {item.scheduled && <Button className="btn-sm float-right" color="danger" onClick={()=>this.unsubscribe(item)}>{this.t.cancel}</Button>}
                        {!item.scheduled && moment() < moment(item.expired) && item.card && item.subscription
                            && <Button className="btn-sm float-right" color="success" onClick={()=>this.subscribe(item)}>{this.t.extention}</Button>}
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
        MypageAction:binding(MypageAction, dispatch),
        SharedAct:binding(SharedAction, dispatch)
    }),
    Billing
)