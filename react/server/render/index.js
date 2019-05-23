const fs = require('fs');
const path = require('path');
const render = require('./render').default; // ES6 형식으로 만들어진 모듈이므로, 뒤에 .default 를 붙여주어야합니다.

// html 내용을 해당 상수에 저장합니다
const template = fs.readFileSync(path.join(__dirname, '../../build/index.html'), { encoding: 'utf8'});

module.exports = (ctx) => {
    // 요청이 들어올 때 현재 경로를 render 함수에 전달시켜서 문자열을 생성합니다
    const location = ctx.path;
    const rendered = render(location);
    // 해당 문자열을, 템플릿에 있는 '<div id="root"></div> 사이에 넣어줍니다.
    const page = template.replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);

    // 렌더링된 페이지를 반환합니다.
    ctx.body = page;
}