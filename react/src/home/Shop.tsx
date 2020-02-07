import React from 'react';
import { connectWithoutDone } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText, Button, Col, Row } from 'reactstrap';
import { History } from 'history';

interface Props {
    history:History
}

class Shop extends React.Component<Props> {

    render() {
        return <div>
            <h3>Shop</h3>
            <div>
                <Row>
                    {[1,2,3,4,5,6].map(item=> <Col sm={12} md={6} lg={4} key={item}>
                        <Card className="mb-3">
                            <CardImg top width="100%" src="https://picsum.photos/200" />
                            <CardBody>
                                <CardTitle>Card title</CardTitle>
                                <CardSubtitle>Card subtitle</CardSubtitle>
                                <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText>
                                <Button onClick={()=>this.props.history.push('/dashboard/payment')}>Buy</Button>
                            </CardBody>
                        </Card>
                    </Col>)}
                </Row>
            </div>
        </div>
    }
}

export default connectWithoutDone(
    (state:RootState)=>({}),
    (dispatch:Dispatch)=>({}),
    Shop
)