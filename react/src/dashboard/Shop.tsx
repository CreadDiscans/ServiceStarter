import React from 'react';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button, Col, Row } from 'reactstrap';
import { History } from 'history';
import { DashboardAction, DashboardState } from './Dashboard.action';
import { Paginator } from 'component/Paginator';
import { U } from 'app/core/U';
import { translation } from 'component/I18next';

interface Props {
    dashboard:DashboardState
    DashboardAction: typeof DashboardAction
    history:History
}

class Shop extends React.Component<Props> {

    t = translation('shop',[
        "shop",
        "subscription",
        "subscribe",
        "product",
        "show",
        "month",
        "won"
    ])

    componentDidMount() {
        const { DashboardAction } = this.props;
        DashboardAction.loadShopProducts(1)
        DashboardAction.loadShopSubscriptions()
    }

    render() {
        const { dashboard, history } = this.props;
        return <div>
            <h3>{this.t.shop}</h3>
            <div>
                <h4>{this.t.subscription}</h4>
                <Row>
                    {dashboard.shopSubscriptions.map(item=> <Col sm={12} md={6} lg={4} key={item.id}>
                        <Card className="mb-3">
                            <CardBody>
                                <CardTitle>{item.name}</CardTitle>
                                <CardSubtitle>{this.t.month} {U.comma(item.price)}{this.t.won}</CardSubtitle>
                                <CardBody></CardBody>
                                <Button onClick={()=>history.push('/mypage/billing/'+item.id)}>{this.t.subscribe}</Button>
                            </CardBody>
                        </Card>
                    </Col>)}
                </Row>
            </div>
            <div>
                <h4>{this.t.product}</h4>
                <Row>
                    {dashboard.shopProducts.map(item=> <Col sm={12} md={6} lg={4} key={item.id}>
                        <Card className="mb-3">
                            <CardBody>
                                <CardTitle>{item.name}</CardTitle>
                                <CardSubtitle>{U.comma(item.price)}{this.t.won}</CardSubtitle>
                                <CardBody></CardBody>
                                <Button onClick={()=>history.push('/dashboard/shop/'+item.id)}>{this.t.show}</Button>
                            </CardBody>
                        </Card>
                    </Col>)}
                </Row>
                <div className="d-flex flex-row justify-content-center">
                    <Paginator 
                        currentPage={dashboard.shopCurrentPage}
                        totalPage={dashboard.shopTotalPage}
                        onSelect={(page:number)=>DashboardAction.loadShopProducts(page)}/>
                </div>
            </div>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({
        dashboard: state.dashboard
    }),
    (dispatch:Dispatch)=>({
        DashboardAction:binding(DashboardAction, dispatch)
    }),
    Shop
)