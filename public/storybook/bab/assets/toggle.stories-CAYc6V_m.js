import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./createLucideIcon-DrtoC0qv.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./toggle-Bk6DuL8O.js";var o,s;function c(){return(c=e((()=>{t(),o=[[`path`,{d:`M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8`,key:`mg9rjx`}]],s=n(`bold`,o)})))()}var l,u;function d(){return(d=e((()=>{t(),l=[[`line`,{x1:`19`,x2:`10`,y1:`4`,y2:`4`,key:`15jd3p`}],[`line`,{x1:`14`,x2:`5`,y1:`20`,y2:`20`,key:`bu0au3`}],[`line`,{x1:`15`,x2:`9`,y1:`4`,y2:`20`,key:`uljnxc`}]],u=n(`italic`,l)})))()}var f,p;function m(){return(m=e((()=>{t(),f=[[`path`,{d:`M6 4v6a6 6 0 0 0 12 0V4`,key:`9kb039`}],[`line`,{x1:`4`,x2:`20`,y1:`20`,y2:`20`,key:`nun2al`}]],p=n(`underline`,f)})))()}var h,g,_,v,y,b,x,S,C,w,T;function E(){return(E=e((()=>{c(),d(),m(),i(),h=r(),g=[`default`,`outline`],_=[`default`,`sm`,`lg`],v={title:`UI/Toggle`,component:a,tags:[`autodocs`],args:{variant:`default`,size:`default`,defaultPressed:!1,disabled:!1,children:(0,h.jsx)(s,{}),"aria-label":`Bold`},argTypes:{variant:{description:"`outline` adds a border for use outside a toolbar.",control:`inline-radio`,options:g,table:{category:`Appearance`,type:{summary:g.join(` | `)},defaultValue:{summary:`default`}}},size:{control:`inline-radio`,options:_,table:{category:`Appearance`,type:{summary:_.join(` | `)},defaultValue:{summary:`default`}}},defaultPressed:{description:`Uncontrolled starting state.`,control:`boolean`,table:{category:`State`,defaultValue:{summary:`false`}}},pressed:{description:"Controlled state. Leave undefined to use `defaultPressed`.",control:`boolean`,table:{category:`State`}},disabled:{control:`boolean`,table:{category:`State`,defaultValue:{summary:`false`}}},onPressedChange:{table:{category:`Events`}},children:{control:!1,table:{category:`Content`}},className:{control:`text`,table:{category:`Content`}}}},y={},b={args:{defaultPressed:!0}},x={args:{variant:`outline`}},S={args:{children:`Compare`,"aria-label":void 0}},C={args:{disabled:!0}},w={parameters:{controls:{disable:!0}},render:()=>(0,h.jsx)(`div`,{className:`flex flex-col gap-3`,children:g.map(e=>(0,h.jsxs)(`div`,{className:`flex items-center gap-2`,children:[_.map(t=>(0,h.jsx)(a,{variant:e,size:t,"aria-label":`${e} ${t}`,children:(0,h.jsx)(u,{})},t)),(0,h.jsx)(a,{variant:e,defaultPressed:!0,"aria-label":`${e} pressed`,children:(0,h.jsx)(p,{})})]},e))})},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{}`,...y.parameters?.docs?.source},description:{story:`Every prop wired to a control.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    defaultPressed: true
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "outline"
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    children: "Compare",
    "aria-label": undefined
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-col gap-3">
      {VARIANTS.map(variant => <div key={variant} className="flex items-center gap-2">
          {SIZES.map(size => <Toggle key={size} variant={variant} size={size} aria-label={\`\${variant} \${size}\`}>
              <Italic />
            </Toggle>)}
          <Toggle variant={variant} defaultPressed aria-label={\`\${variant} pressed\`}>
            <Underline />
          </Toggle>
        </div>)}
    </div>
}`,...w.parameters?.docs?.source}}},T=[`Playground`,`Pressed`,`Outline`,`WithText`,`Disabled`,`AllVariants`]})))()}E();export{w as AllVariants,C as Disabled,x as Outline,y as Playground,b as Pressed,S as WithText,T as __namedExportsOrder,v as default};