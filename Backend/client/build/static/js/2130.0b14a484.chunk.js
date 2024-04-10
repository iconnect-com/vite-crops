"use strict";(self.webpackChunkcommodityvirtualdashboard=self.webpackChunkcommodityvirtualdashboard||[]).push([[2130],{14341:(e,t,a)=>{a.r(t),a.d(t,{default:()=>g});var l=a(65043),c=a(6051),i=a(87021),s=a(62423),n=a(1210),r=a(59357),d=a(48668),o=a(48649),A=a(73216),h=a(50867),m=a(46362),u=a(70579);const g=()=>{const e=(0,h.KQ)(),t=null===e||void 0===e?void 0:e.map(((e,t)=>({...e,index:t}))),a=(0,m.C)(),[g,v]=l.useState(null),[x,p]=(0,l.useState)(!1),{mutate:f}=(0,h.SO)(),[w,j]=l.useState(null),[y,N]=l.useState(!1),[b,S]=l.useState(!1),C=(0,A.Zp)(),B=[{title:"S/N",dataIndex:"number",width:80,align:"center",render:(e,t,a)=>((E.current||1)-1)*(E.pageSize||5)+a+1},{title:"Title",dataIndex:"name",align:"left",width:250,render:e=>(0,u.jsx)("div",{style:{whiteSpace:"nowrap",maxHeight:"40px",height:"40px",display:"flex",alignItems:"center"},children:e})},{title:"Previous Price",dataIndex:"previous_price",align:"left",width:150,render:e=>(0,u.jsx)("div",{style:{height:"40px",display:"flex",alignItems:"center"},children:e})},{title:"Current Price",dataIndex:"current_price",align:"left",width:150,render:e=>(0,u.jsx)("div",{style:{height:"40px",display:"flex",alignItems:"center"},children:e})},{title:"Analysis",dataIndex:"analysis",align:"left",width:800,render:e=>(0,u.jsx)("div",{style:{whiteSpace:"normal",overflow:"hidden",textOverflow:"ellipsis",maxHeight:"40px",height:"40px",display:"flex",alignItems:"center"},children:e})},{title:"Actions",dataIndex:"actions",align:"left",width:150,render:(e,t)=>(0,u.jsxs)(c.A,{size:"middle",children:[(0,u.jsx)("img",{src:r,alt:"View",style:{width:"20px",cursor:"pointer",alignItems:"center"},onClick:()=>(e=>{v(e),p(!0)})(t)}),(0,u.jsx)("img",{src:d,alt:"Delete",style:{width:"20px",cursor:"pointer"},onClick:()=>(e=>{j(e),S(!0)})(t)})]})}],[E,I]=(0,l.useState)({pageSize:5});return(0,u.jsxs)(o.A,{pageTitle:"All Commodity",children:[(0,u.jsxs)(i.Ay,{onClick:()=>{C(-1)},type:"text",className:"w-30 h-10 mb-6",style:{background:"#65812729",color:"black",borderRadius:"50px",boxShadow:"none"},children:["Back"," "]}),(0,u.jsxs)("div",{className:"h-full mx-auto pr-0 sm:pr-9 w-full overflow-auto",children:[(0,u.jsx)(s.A,{columns:B,dataSource:t,size:"middle",loading:!!a,rowKey:"_id",onChange:(e,t,a,l)=>{I(e)},pagination:{...E,pageSizeOptions:["5","10","15"],showSizeChanger:!1}}),(0,u.jsx)("div",{children:(0,u.jsxs)(n.A,{title:"View Commodity Detail",open:x,onOk:()=>{p(!1)},onCancel:()=>{p(!1)},width:500,centered:!0,footer:null,children:[(0,u.jsx)(u.Fragment,{children:(0,u.jsx)("img",{alt:"User",style:{width:"100%",height:"50%"},src:null===g||void 0===g?void 0:g.image})}),(0,u.jsxs)("div",{className:"mt-6 grid sm:grid-cols-1 md:grid-cols-2 gap-6 w-full",style:{marginBottom:"3rem",marginTop:"3rem"},children:[(0,u.jsxs)("div",{className:"mt-15 ",children:[(0,u.jsx)("h5",{className:"mb-1 font-bold",children:"Name"}),(0,u.jsx)("p",{className:"mb-4",children:null===g||void 0===g?void 0:g.name})]}),(0,u.jsxs)("div",{className:"mt-15 ",children:[(0,u.jsx)("h5",{className:"mb-1 font-bold",children:"Previous Price"}),(0,u.jsx)("p",{className:"mb-4",children:null===g||void 0===g?void 0:g.previous_price})]}),(0,u.jsxs)("div",{className:"mt-15 ",children:[(0,u.jsx)("h5",{className:"mb-1 font-bold",children:"Current Price"}),(0,u.jsx)("p",{className:"mb-4",children:null===g||void 0===g?void 0:g.current_price})]}),(0,u.jsxs)("div",{className:"mt-15 ",children:[(0,u.jsx)("h5",{className:"mb-1 font-bold",children:"Analysis"}),(0,u.jsx)("p",{className:"mb-4",children:null===g||void 0===g?void 0:g.analysis})]})]})]})}),(0,u.jsx)(n.A,{title:"Are you sure?",open:b,onOk:()=>{N(!0),setTimeout((()=>{S(!1),N(!1)}),2e3),w&&(S(!1),f(w._id))},okButtonProps:{loading:y,className:"!bg-[#39462D]"},onCancel:()=>{S(!1)},width:400,centered:!0,children:(0,u.jsx)("div",{className:"mt-5 ",children:(0,u.jsxs)("p",{className:"mb-4",children:[" ","Do you want to delete commodity"," ",(0,u.jsxs)("span",{style:{fontWeight:"bold"},children:[null===w||void 0===w?void 0:w.name,"?"]})]})})})]})]})}},67937:(e,t,a)=>{a.d(t,{A:()=>r});var l=a(58168),c=a(65043);const i={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M946.5 505L534.6 93.4a31.93 31.93 0 00-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z"}}]},name:"home",theme:"filled"};var s=a(22172),n=function(e,t){return c.createElement(s.A,(0,l.A)({},e,{ref:t,icon:i}))};const r=c.forwardRef(n)},31765:(e,t,a)=>{a.d(t,{A:()=>r});var l=a(58168),c=a(65043);const i={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M280 752h80c4.4 0 8-3.6 8-8V280c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8v464c0 4.4 3.6 8 8 8zm192-280h80c4.4 0 8-3.6 8-8V280c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8v184c0 4.4 3.6 8 8 8zm192 72h80c4.4 0 8-3.6 8-8V280c0-4.4-3.6-8-8-8h-80c-4.4 0-8 3.6-8 8v256c0 4.4 3.6 8 8 8zm216-432H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"}}]},name:"project",theme:"outlined"};var s=a(22172),n=function(e,t){return c.createElement(s.A,(0,l.A)({},e,{ref:t,icon:i}))};const r=c.forwardRef(n)},15834:(e,t,a)=>{a.d(t,{A:()=>r});var l=a(58168),c=a(65043);const i={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512.5 390.6c-29.9 0-57.9 11.6-79.1 32.8-21.1 21.2-32.8 49.2-32.8 79.1 0 29.9 11.7 57.9 32.8 79.1 21.2 21.1 49.2 32.8 79.1 32.8 29.9 0 57.9-11.7 79.1-32.8 21.1-21.2 32.8-49.2 32.8-79.1 0-29.9-11.7-57.9-32.8-79.1a110.96 110.96 0 00-79.1-32.8zm412.3 235.5l-65.4-55.9c3.1-19 4.7-38.4 4.7-57.7s-1.6-38.8-4.7-57.7l65.4-55.9a32.03 32.03 0 009.3-35.2l-.9-2.6a442.5 442.5 0 00-79.6-137.7l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.2 28.9c-30-24.6-63.4-44-99.6-57.5l-15.7-84.9a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52-9.4-106.8-9.4-158.8 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.3a353.44 353.44 0 00-98.9 57.3l-81.8-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a445.93 445.93 0 00-79.6 137.7l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.2 56.5c-3.1 18.8-4.6 38-4.6 57 0 19.2 1.5 38.4 4.6 57l-66 56.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.3 44.8 96.8 79.6 137.7l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.8-29.1c29.8 24.5 63 43.9 98.9 57.3l15.8 85.3a32.05 32.05 0 0025.8 25.7l2.7.5a448.27 448.27 0 00158.8 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-84.9c36.2-13.6 69.6-32.9 99.6-57.5l81.2 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.5-87.4 79.6-137.7l.9-2.6c4.3-12.4.6-26.3-9.5-35zm-412.3 52.2c-97.1 0-175.8-78.7-175.8-175.8s78.7-175.8 175.8-175.8 175.8 78.7 175.8 175.8-78.7 175.8-175.8 175.8z"}}]},name:"setting",theme:"filled"};var s=a(22172),n=function(e,t){return c.createElement(s.A,(0,l.A)({},e,{ref:t,icon:i}))};const r=c.forwardRef(n)},53722:(e,t,a)=>{a.d(t,{A:()=>r});var l=a(58168),c=a(65043);const i={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"}}]},name:"user",theme:"outlined"};var s=a(22172),n=function(e,t){return c.createElement(s.A,(0,l.A)({},e,{ref:t,icon:i}))};const r=c.forwardRef(n)},43244:(e,t,a)=>{a.d(t,{A:()=>r});var l=a(58168),c=a(65043);const i={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M892 772h-80v-80c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v80h-80c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h80v80c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-80h80c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM373.5 498.4c-.9-8.7-1.4-17.5-1.4-26.4 0-15.9 1.5-31.4 4.3-46.5.7-3.6-1.2-7.3-4.5-8.8-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 01-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6 24.7-25.3 57.9-39.1 93.2-38.7 31.9.3 62.7 12.6 86 34.4 7.9 7.4 14.7 15.6 20.4 24.4 2 3.1 5.9 4.4 9.3 3.2 17.6-6.1 36.2-10.4 55.3-12.4 5.6-.6 8.8-6.6 6.3-11.6-32.5-64.3-98.9-108.7-175.7-109.9-110.8-1.7-203.2 89.2-203.2 200 0 62.8 28.9 118.8 74.2 155.5-31.8 14.7-61.1 35-86.5 60.4-54.8 54.7-85.8 126.9-87.8 204a8 8 0 008 8.2h56.1c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5 29.4-29.4 65.4-49.8 104.7-59.7 3.8-1.1 6.4-4.8 5.9-8.8zM824 472c0-109.4-87.9-198.3-196.9-200C516.3 270.3 424 361.2 424 472c0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 00-86.4 60.4C357 742.6 326 814.8 324 891.8a8 8 0 008 8.2h56c4.3 0 7.9-3.4 8-7.7 1.9-58 25.4-112.3 66.7-153.5C505.8 695.7 563 672 624 672c110.4 0 200-89.5 200-200zm-109.5 90.5C690.3 586.7 658.2 600 624 600s-66.3-13.3-90.5-37.5a127.26 127.26 0 01-37.5-91.8c.3-32.8 13.4-64.5 36.3-88 24-24.6 56.1-38.3 90.4-38.7 33.9-.3 66.8 12.9 91 36.6 24.8 24.3 38.4 56.8 38.4 91.4-.1 34.2-13.4 66.3-37.6 90.5z"}}]},name:"usergroup-add",theme:"outlined"};var s=a(22172),n=function(e,t){return c.createElement(s.A,(0,l.A)({},e,{ref:t,icon:i}))};const r=c.forwardRef(n)},59357:e=>{e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAASCAYAAABIB77kAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIzSURBVHgBpVXRbdswEH1HaQB1gjobyOgAle3+N54gVoF+J5nAyQRNvgtE8gRp/+uEncDaoNqgHsAme0cRrWpHDJEcIEgkj+/dHe9RhEjLqyLDPilANuPhyE9vYUyDFG1T6jYGh54jUVDnFrTokQxZS6BvBrvbEDkFiJZMdNHN2C27Nhb2OyQrqNbPZzA2J0XveVD0QGuD/fVTxEeE+deioDSpuoxsa4FbwNS8eYuAuZJDnTLgkmFHkrHFvuR9epDw3d3szBBqFzuII/xxhRdYXn24Itilw7FYNJ/WqyPCvJpJdPddVmbOkTV4hXHGOUHdS7Z9UvKLI0LyKGfCZOPYjosgZVy1ERour8NNZUEh4QbBiJ/yOTI5YyhVuIExuvn8/xn1TbDyanrJWVXM8YWn5uSz+yWl3JQPJ4FouUQJl+hIHtIck1Cg42rG1UPBfm8UjDqVSc7uOkDmS+6qUPMz56aa8NnIucjaRnyG9ksDug+jLlLW0Mcu/Yd6aAMDikz4fOmSO/emt6S5ZJoFX3mfydMIO27ABKJXxfy58CGQHTpR6wMy9ALV4tNp8di8hluBU90NQhpDtktH8rLG/hxy6a3lgz4Wcks16aZcTxCydLeVcoAoG3JRit5ahI116K5JQoSNq+lvr6WTwyuup2GEuvxvcIgw38EZIX3sd2NHljqpsM8qBisqQwd+N7shwrkfat6a+YaTgFZNuV7E4EQTOtJqumAJnOHfr0jzL2sVktSh/QFGWvVZrPk5AgAAAABJRU5ErkJggg=="},48668:e=>{e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAEgSURBVHgB7Va7bcMwEH0SjLRZQUiRX0V5AmUCaQRnhGyiDZIRnAmiCSx2caooG7hNCjKPNgwINmmfPxBc8AHCSY/kPfJ04B0QcWYk0omfShU0RWC4edC6wTGCdJz5HKdpWlprK6+TJJkaY97h30jXJ0aeSQUdvG6SFEMIbiNcU3n4Z5q3PpdiYHj/oQsrd/zt3q+A7KZtfyCAZN3gJxxJJ34pVTFzSoZkcTubvThuPh7X/L4GE+ZO66nEj/iEBlBMgonpZ6q15ZLjmNTP4CGNglEwCm5BfNOwVix4q3RYPWt06zEIIRZ81Lqmqfvcfds+4UBcXkj/WLXneY5zIdjTUOQD4R5mH5pQuHc2USyoE5oMB8Al0C/bilxrcSJFnIR/tk5dwuqEBdgAAAAASUVORK5CYII="},46362:(e,t,a)=>{a.d(t,{C:()=>r});var l=a(65043),c=a(68664),i=a(49939),s=a(28873),n=a(59781);function r(e,t,a){const[r,d={}]=(0,c.b_)(e,t,a),o=(0,n.jE)({context:d.context}),A=o.getQueryCache();return(0,s.r)(l.useCallback((e=>A.subscribe(i.j.batchCalls(e))),[A]),(()=>o.isFetching(r)),(()=>o.isFetching(r)))}}}]);
//# sourceMappingURL=2130.0b14a484.chunk.js.map