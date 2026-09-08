import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./react-BZJXY1be.js";import{t as n}from"./jsx-runtime-DeHZSEgm.js";import{n as r,t as i}from"./utils-Dm4OyE3Q.js";import{n as a,r as o,t as s}from"./toggle-group--cCjTNIG.js";function c({options:e,value:t,onValueChange:n,className:r}){return(0,l.jsx)(s,{spacing:0,value:[t],onValueChange:e=>{let t=e[0];t&&n(t)},className:i(`gap-0.5 rounded-full bg-sel p-0.5`,r),children:e.map(e=>(0,l.jsx)(a,{value:e.value,className:`h-auto min-w-0 rounded-full! px-3 py-1.5 text-sm font-normal text-muted-foreground hover:bg-transparent hover:text-foreground aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-sm`,children:e.label},e.value))})}var l;function u(){return(u=e((()=>{o(),r(),l=n();try{c.displayName=`SegmentedControl`,c.__docgenInfo={description:``,displayName:`SegmentedControl`,filePath:`/Users/toribryan/Developer/bab/design-system/src/components/ui/segmented-control.tsx`,methods:[],props:{options:{defaultValue:null,declarations:[{fileName:`design-system/src/components/ui/segmented-control.tsx`,name:`SegmentedControlProps`}],description:``,name:`options`,parent:{fileName:`design-system/src/components/ui/segmented-control.tsx`,name:`SegmentedControlProps`},required:!0,tags:{},type:{name:`{ value: T; label: string; }[]`}},value:{defaultValue:null,declarations:[{fileName:`design-system/src/components/ui/segmented-control.tsx`,name:`SegmentedControlProps`}],description:``,name:`value`,parent:{fileName:`design-system/src/components/ui/segmented-control.tsx`,name:`SegmentedControlProps`},required:!0,tags:{},type:{name:`string`}},onValueChange:{defaultValue:null,declarations:[{fileName:`design-system/src/components/ui/segmented-control.tsx`,name:`SegmentedControlProps`}],description:``,name:`onValueChange`,parent:{fileName:`design-system/src/components/ui/segmented-control.tsx`,name:`SegmentedControlProps`},required:!0,tags:{},type:{name:`(value: T) => void`}},className:{defaultValue:null,declarations:[{fileName:`design-system/src/components/ui/segmented-control.tsx`,name:`SegmentedControlProps`}],description:``,name:`className`,parent:{fileName:`design-system/src/components/ui/segmented-control.tsx`,name:`SegmentedControlProps`},required:!1,tags:{},type:{name:`string`}}},tags:{}}}catch{}})))()}var d,f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{d=t(),u(),f=n(),p=[{value:`day`,label:`Day`},{value:`week`,label:`Week`},{value:`month`,label:`Month`}],m={title:`UI/SegmentedControl`,component:c,tags:[`autodocs`],args:{options:p,value:`week`,onValueChange:()=>{}},argTypes:{options:{description:"The segments, in order. Each needs a `value` and a `label`.",control:`object`,table:{category:`Content`}},value:{description:`The selected segment. The control is always controlled — the stories below hold the state.`,control:`select`,options:p.map(e=>e.value),table:{category:`State`}},onValueChange:{table:{category:`Events`}},className:{control:`text`,table:{category:`Content`}}},render:function(e){let[t,n]=(0,d.useState)(e.value);return(0,f.jsx)(c,{...e,value:t,onValueChange:t=>{n(t),e.onValueChange(t)}})}},h={},g={},_={args:{options:[{value:`open`,label:`Open`},{value:`closed`,label:`Closed`}],value:`open`}},v={args:{options:[{value:`24h`,label:`24h`},{value:`7d`,label:`7d`},{value:`30d`,label:`30d`},{value:`90d`,label:`90d`},{value:`ytd`,label:`YTD`}],value:`7d`}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source},description:{story:`Change the segments and the selected value from the Controls panel.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      value: "open",
      label: "Open"
    }, {
      value: "closed",
      label: "Closed"
    }],
    value: "open"
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    options: [{
      value: "24h",
      label: "24h"
    }, {
      value: "7d",
      label: "7d"
    }, {
      value: "30d",
      label: "30d"
    }, {
      value: "90d",
      label: "90d"
    }, {
      value: "ytd",
      label: "YTD"
    }],
    value: "7d"
  }
}`,...v.parameters?.docs?.source}}},y=[`Playground`,`Default`,`TwoSegments`,`FiveSegments`]})))()}b();export{g as Default,v as FiveSegments,h as Playground,_ as TwoSegments,y as __namedExportsOrder,m as default};