export const U = {
    comma:(val:string|number) => {
        if(val==0) return 0;
        if(typeof val === 'string') val = parseFloat(val)
        var reg = /(^[+-]?\d+)(\d{3})/;
        var n = (val + '');
     
        while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
     
        return n;
    },
    getId:(location:Location) => {
        const path = location.pathname.split('/')
        return path[path.length-1]
    },
    union:(arr:Array<Array<any>>) => {
        const out:any = []
        arr.forEach(arr_2=>arr_2.forEach(item=> {
            if (out.indexOf(item) === -1) {
                out.push(item)
            }
        }))
        return out
    }
}
