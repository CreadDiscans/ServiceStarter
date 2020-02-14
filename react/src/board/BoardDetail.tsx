import React from 'react';
import { connectWithDone, binding } from 'app/core/connection';
import { RootState } from 'app/Reducers';
import { Dispatch } from 'redux';
import { Api } from 'app/core/Api';
import * as ApiType from 'types/api.types';
import { InputGroup, FormGroup, InputGroupAddon, Button, InputGroupText, CardBody, Card, CardHeader } from 'reactstrap';
import { AuthState } from 'auth/Auth.action';
import { FaPaperPlane, FaPen, FaTrash } from 'react-icons/fa';
import moment from 'moment';
import { Paginator } from 'component/Paginator';
import autoresize from 'autoresize';
import { History } from 'history';
import { U } from 'app/core/U';
import { SharedAction } from 'component/Shared.action';

interface Props {
    auth:AuthState
    SharedAct:typeof SharedAction
    location:Location
    history:History
    done:any
}

type CommentWrap = {
    d:ApiType.BoardComment,
    children:CommentWrap[]
}

class BoardDetail extends React.Component<Props> {
    textarea:any;
    state:{
        item?:ApiType.BoardItem
        comments:CommentWrap[]
        commentInput:string
        currentPage:number
        totalPage:number
        nestTarget:number
    } = {
        comments:[],
        commentInput:'',
        currentPage:1,
        totalPage:1,
        nestTarget:-1
    }

    UNSAFE_componentWillMount() {
        const {location, done, history} = this.props;
        Api.retrieve<ApiType.BoardItem>('/api-board/item/',U.getId(location), {
        }).then(async(item)=> {
            item.author = typeof item.author === 'number' ? await Api.retrieve<ApiType.Profile>('/api-profile/',item.author,{}) : item.author
            this.loadComment(item, 1).then(done, done)
        }).catch(err=> {
            history.push('/board')
            done()
        })
    }

    componentDidUpdate() {
        if (this.textarea) {
            autoresize(this.textarea)
        }
    }

    async loadNestComment(comments:CommentWrap[]) {
        return new Promise(resolve=> {
            Api.list<ApiType.BoardComment[]>('/api-board/comment/', {
                'parent__in[]':comments.map(com=> com.d.id),
            }).then(async(items)=> {
                if (items.length === 0) {
                    resolve()
                } else {
                    const commentWraps = await this.mappingAuthor(items)
                    comments.forEach(item=> {
                        commentWraps.filter(child=> child.d.parent === item.d.id)
                        .forEach(child=>item.children.push(child))
                    })
                    this.loadNestComment(commentWraps).then(()=> resolve())
                }
            })
        })
    }

    async mappingAuthor(items:ApiType.BoardComment[]) {
        const profiles = await Api.list<ApiType.Profile[]>('/api-profile/',{
            'pk__in[]':items.map(item=>item.author)
        })
        items.forEach(item=>item.author = profiles.filter(profile=>profile.id === item.author)[0])
        const commentWraps:CommentWrap[] = items.map(item=>({d:item, children:[]}))
        return Promise.resolve(commentWraps)
    }

    async loadComment(item:ApiType.BoardItem, page:number) {
        const res = await Api.list<{total_page:number,items:ApiType.BoardComment[]}>('/api-board/comment/',{
            item:item.id,
            page:page,
            count_per_page:10,
            parent__isnull:true
        })
        let comments:CommentWrap[] = []
        if (res.items.length > 0) {
            comments = await this.mappingAuthor(res.items)
            await this.loadNestComment(comments)
        }
        this.setState({
            item:item,
            currentPage:page,
            totalPage:res.total_page,
            comments:comments
        })
        return Promise.resolve()
    }

    comment(parent:ApiType.BoardComment|null=null) {
        const {auth} = this.props;
        if (this.state.item && auth.userProfile) {
            Api.create<ApiType.BoardComment>('/api-board/comment/', {
                content:this.state.commentInput,
                item:this.state.item.id,
                parent:parent ? parent.id : null,
                author:auth.userProfile.id
            }).then(res=> {
                this.state.item && this.loadComment(this.state.item, 1)
                this.setState({commentInput:'', nestTarget: -1})
            })
        }
    }

    deleteComment(item:CommentWrap) {
        const {SharedAct} = this.props
        SharedAct.alert({
            title:'Alert',
            content:'The comment will be deleted',
            onConfirm:()=>{
                Api.delete('/api-board/comment/', item.d.id).then(()=>{
                    this.state.item && this.loadComment(this.state.item, 1)
                })
                SharedAct.alert(undefined)
            },
            onCancel:()=>SharedAct.alert(undefined)
        })
    }

    deleteItem() {
        const {SharedAct} = this.props
        SharedAct.alert({
            title:'Alert',
            content:'The board item will be deleted',
            onConfirm:()=>{
                this.state.item && Api.delete('/api-board/item/', this.state.item.id).then(()=> {
                    this.props.history.push('/board')
                })
                SharedAct.alert(undefined)
            },
            onCancel:()=>SharedAct.alert(undefined)
        })
    }

    renderInput(item:CommentWrap|null) {
        const {auth} = this.props;
        return <FormGroup className="mt-3">
            <InputGroup>
                <InputGroupAddon addonType="prepend">
                    <InputGroupText>{auth.userProfile && auth.userProfile.name}</InputGroupText>
                </InputGroupAddon>
                <textarea className="form-control" ref={c=>this.textarea=c} value={this.state.commentInput} onChange={(e)=>{
                    this.setState({commentInput:e.target.value})
                }} rows={1} style={{resize:'none'}}/>
                <InputGroupAddon addonType="append">
                    <Button onClick={()=>this.comment(item ? item.d:null)}><FaPaperPlane /></Button>
                </InputGroupAddon>
            </InputGroup>
        </FormGroup>
    }

    renderComment(item:CommentWrap) {
        const {auth} = this.props;
        return <Card key={item.d.id} className="border-0">
            <CardHeader className="py-1" style={{color:'gray'}}>
                {typeof item.d.author !== 'number' && item.d.author.name}
                <span className="float-right">{moment(item.d.created).fromNow()}</span>
            </CardHeader>
            <CardBody className="pt-1" style={{whiteSpace:'pre'}}>
                {item.d.content}
                {auth.userProfile && <div className="float-right">
                    <Button className="btn-sm ml-1" color="dark" 
                        onClick={()=>this.setState({nestTarget: item.d.id === this.state.nestTarget ? -1 : item.d.id, commentInput:''})}>
                            <FaPen />
                    </Button> 
                    {auth.userProfile && auth.userProfile.id == item.d.author && <Button className="btn-sm ml-1" color="danger"
                        onClick={()=> this.deleteComment(item)}>
                        <FaTrash></FaTrash>
                    </Button>}
                </div>}
                {auth.userProfile && item.d.id === this.state.nestTarget && this.renderInput(item)}
            </CardBody>
            <div className="pl-4">{item.children.map(child=> this.renderComment(child))}</div>
        </Card>
    }

    render() {
        const {auth, history} = this.props;
        if (!this.state.item) return <div></div>
        return <div>
            <h4>{this.state.item.title}</h4>
            <hr />
            <div className="text-right" style={{color:'gray'}}>{new Date(this.state.item.created).toLocaleString()}</div>
            <div className="text-right" style={{color:'gray'}}>{typeof this.state.item.author !== 'number' && this.state.item.author.name}</div>
            <div dangerouslySetInnerHTML={{__html:this.state.item.content}}></div>
            {auth.userProfile && auth.userProfile.id === this.state.item.author && <div className="text-right">
                <Button className="mx-1" color="info" onClick={()=>this.state.item && history.push('/board/write/'+this.state.item.id)}>
                    <FaPen />
                </Button>
                <Button className="mx-1" color="danger" onClick={()=>this.deleteItem()}>
                    <FaTrash />
                </Button>
            </div>}
            <hr />
            {this.state.comments.map(item=> this.renderComment(item))}
            {auth.userProfile && this.state.nestTarget === -1 && this.renderInput(null)}
            <div className="d-flex justify-content-center">
                <Paginator 
                    currentPage={this.state.currentPage}
                    totalPage={this.state.totalPage}
                    onSelect={(page:number)=>this.state.item && this.loadComment(this.state.item, page)}/>
            </div>
        </div>
    }
}

export default connectWithDone(
    (state:RootState)=>({
        auth:state.auth
    }),
    (dispatch:Dispatch)=>({
        SharedAct:binding(SharedAction, dispatch)
    }),
    BoardDetail
)