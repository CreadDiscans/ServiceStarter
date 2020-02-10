import React from 'react';
import { connectWithoutDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button, Col, Row } from 'reactstrap';
import { History } from 'history';
import { DashboardAction, DashboardState } from './Dashboard.action';
import { Paginator } from 'component/Paginator';
import { U } from 'app/core/U';

interface Props {
    dashboard:DashboardState
    DashboardAction: typeof DashboardAction
    history:History
}

class Shop extends React.Component<Props> {

    componentDidMount() {
        const { DashboardAction } = this.props;
        DashboardAction.loadShopProducts(1)
        DashboardAction.loadShopSubscriptions()
    }

    render() {
        const { dashboard, history } = this.props;
        return <div>
            <h3>Shop</h3>
            <div>
                <h4>Subscription</h4>
                <Row>
                    {dashboard.shopSubscriptions.map(item=> <Col sm={12} md={6} lg={4} key={item.id}>
                        <Card className="mb-3">
                            <CardBody>
                                <CardTitle>{item.name}</CardTitle>
                                <CardSubtitle>월 {U.comma(item.price)}원</CardSubtitle>
                                <CardBody></CardBody>
                                <Button onClick={()=>history.push('/mypage/billing/'+item.id)}>구독</Button>
                            </CardBody>
                        </Card>
                    </Col>)}
                </Row>
            </div>
            <div>
                <h4>Product</h4>
                <Row>
                    {dashboard.shopProducts.map(item=> <Col sm={12} md={6} lg={4} key={item.id}>
                        <Card className="mb-3">
                            <CardBody>
                                <CardTitle>{item.name}</CardTitle>
                                <CardSubtitle>{U.comma(item.price)}원</CardSubtitle>
                                <CardBody></CardBody>
                                <Button onClick={()=>history.push('/dashboard/shop/'+item.id)}>Show</Button>
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