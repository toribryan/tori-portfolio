import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./createLucideIcon-DrtoC0qv.js";import{n as r,t as i}from"./plus-ChJveyfQ.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{n as o,t as s}from"./button-BXVeIaZu.js";var c,l;function u(){return(u=e((()=>{t(),c=[[`path`,{d:`M5 12h14`,key:`1ays0h`}],[`path`,{d:`m12 5 7 7-7 7`,key:`xquz4c`}]],l=n(`arrow-right`,c)})))()}var d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D;function O(){return(O=e((()=>{u(),r(),o(),d=a(),f=[`default`,`outline`,`secondary`,`ghost`,`destructive`,`link`],p=[`default`,`xs`,`sm`,`lg`,`icon`,`icon-xs`,`icon-sm`,`icon-lg`],m={title:`UI/Button`,component:s,tags:[`autodocs`],args:{children:`Button`,variant:`default`,size:`default`,disabled:!1},argTypes:{variant:{description:"Visual weight. `default` is the one red that means primary action; `destructive` is a tinted surface, not a solid red fill.",control:`select`,options:f,table:{category:`Appearance`,type:{summary:f.join(` | `)},defaultValue:{summary:`default`}}},size:{description:"Height and padding. The `icon-*` sizes are square and expect a single icon child.",control:`select`,options:p,table:{category:`Appearance`,type:{summary:p.join(` | `)},defaultValue:{summary:`default`}}},disabled:{description:`Dims the button and removes pointer events.`,control:`boolean`,table:{category:`State`,defaultValue:{summary:`false`}}},children:{description:`Label. Pass a lucide icon alongside it for a leading glyph.`,control:`text`,table:{category:`Content`}},className:{control:`text`,table:{category:`Content`}},render:{control:!1,table:{category:`Composition`}}}},h={},g={},_={args:{variant:`outline`}},v={args:{variant:`secondary`}},y={args:{variant:`ghost`}},b={args:{variant:`destructive`}},x={args:{variant:`link`}},S={args:{disabled:!0}},C={args:{children:(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(i,{}),`New content`]})}},w={args:{size:`icon`,children:(0,d.jsx)(l,{}),"aria-label":`Next`}},T={parameters:{controls:{disable:!0}},render:()=>(0,d.jsx)(`div`,{className:`flex flex-wrap items-center gap-3`,children:f.map(e=>(0,d.jsx)(s,{variant:e,children:e},e))})},E={parameters:{controls:{disable:!0}},render:()=>(0,d.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[p.filter(e=>!e.startsWith(`icon`)).map(e=>(0,d.jsx)(s,{size:e,children:e},e)),p.filter(e=>e.startsWith(`icon`)).map(e=>(0,d.jsx)(s,{size:e,"aria-label":e,children:(0,d.jsx)(i,{})},e))]})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source},description:{story:`Every prop wired to a control — change variant, size and state here.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "outline"
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "secondary"
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "ghost"
  }
}`,...y.parameters?.docs?.source}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "destructive"
  }
}`,...b.parameters?.docs?.source}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "link"
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    children: <>
        <Plus />
        New content
      </>
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    size: "icon",
    children: <ArrowRight />,
    "aria-label": "Next"
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map(variant => <Button key={variant} variant={variant}>
          {variant}
        </Button>)}
    </div>
}`,...T.parameters?.docs?.source}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-wrap items-center gap-3">
      {SIZES.filter(size => !size.startsWith("icon")).map(size => <Button key={size} size={size}>
          {size}
        </Button>)}
      {SIZES.filter(size => size.startsWith("icon")).map(size => <Button key={size} size={size} aria-label={size}>
          <Plus />
        </Button>)}
    </div>
}`,...E.parameters?.docs?.source}}},D=[`Playground`,`Default`,`Outline`,`Secondary`,`Ghost`,`Destructive`,`Link`,`Disabled`,`WithIcon`,`IconOnly`,`AllVariants`,`AllSizes`]})))()}O();export{E as AllSizes,T as AllVariants,g as Default,b as Destructive,S as Disabled,y as Ghost,w as IconOnly,x as Link,_ as Outline,h as Playground,v as Secondary,C as WithIcon,D as __namedExportsOrder,m as default};