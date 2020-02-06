import * as ApiType from 'types/api.types';
import { getHandleActions } from 'app/core/connection';
import { Api } from 'app/core/Api';

export type BoardState = {
    groups: ApiType.BoardGroup[]
    activeGroup?: ApiType.BoardGroup
    list: ApiType.BoardItem[]
    currentPage:number
    totalPage:number
}

const initState:BoardState = {
    groups:[],
    activeGroup:undefined,
    list:[],
    currentPage:1,
    totalPage:1
}

export const BoardAction = {
    boardGroup: async ()=> {
        const groups = await Api.list<ApiType.BoardGroup[]>('/api-board/group/',{})
        return Promise.resolve({
            groups:groups,
            activeGroup: groups.length > 0 ? groups[0] : undefined
        })
    },
    boardList: async (page:number, group:ApiType.BoardGroup) => {
        const res = await Api.list<{total_page:number, items:ApiType.BoardItem[]}>('/api-board/item/', {
            page:page,
            count_per_page:10,
            group:group.id,
            valid:1
        })
        return Promise.resolve({
            totalPage:res.total_page,
            currentPage:page,
            list:res.items
        })
    }
}

export default getHandleActions(BoardAction, initState)