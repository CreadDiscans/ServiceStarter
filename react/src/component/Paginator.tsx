import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

interface Props {
    currentPage:number
    totalPage:number
    onSelect:Function
}

export class Paginator extends React.Component<Props> {

    couning = 5

    getPages() {
        const {currentPage, totalPage} = this.props;
        const max = Math.min(this.couning, totalPage)
        const pages = []
        if (currentPage < this.couning/2) {
            for(let i=1; i<=max; i++) pages.push(i)
        } else if (currentPage > totalPage - this.couning/2) {
            for(let i=1; i<=max; i++) pages.unshift(totalPage-i+1)
        } else {
            for(let i=0; i<this.couning;i++) pages.push(currentPage-2+i)
        }
        return pages
    }

    render() {
        const {currentPage, totalPage, onSelect} = this.props;
        return <Pagination  aria-label="Page navigation example">
            {currentPage !== 1 && <PaginationItem>
                <PaginationLink first href="#" onClick={()=>onSelect(1)}/>
            </PaginationItem>}
            {currentPage !== 1 && <PaginationItem>
                <PaginationLink previous href="#" onClick={()=>onSelect(currentPage-1)}/>
            </PaginationItem>}
            {this.getPages().map(page=><PaginationItem active={page === currentPage} key={page} 
                onClick={()=>page !== currentPage && onSelect(page)}>
                <PaginationLink href="#">
                    {page}
                </PaginationLink>
            </PaginationItem>)}
            {currentPage !== totalPage && <PaginationItem onClick={()=>onSelect(currentPage+1)}>
                <PaginationLink next href="#" />
            </PaginationItem>}
            {currentPage !== totalPage && <PaginationItem onClick={()=>onSelect(totalPage)}>
                <PaginationLink last href="#" />
            </PaginationItem>}
        </Pagination >
    }
}