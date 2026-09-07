import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,c as n,i as r,l as i,n as a,o,r as s,s as c,t as l,u}from"./IconRail-o9A6cSyZ.js";import{n as d,t as f}from"./bot-Co-3loAl.js";import{n as p,t as m}from"./check-Bo_vitB6.js";import{n as h,t as g}from"./circle-alert-DOtsppBw.js";import{n as _,t as v}from"./clock-DKP2brem.js";import{n as y,t as b}from"./inbox-BJaxQ3_M.js";import{n as x,t as S}from"./message-square-Cw95Wds5.js";import{i as C,n as w,r as T,t as E}from"./sparkles-Dnm2D_uY.js";import{n as D,t as O}from"./search-CiZHMDo4.js";import{n as k,t as A}from"./target-CuEY7QcL.js";import{n as j,t as M}from"./user-check-cOgoNxkF.js";import{n as N,t as P}from"./x-CAAfs9ve.js";import{t as F}from"./jsx-runtime-DeHZSEgm.js";import{i as I,n as L}from"./iframe-DuzSXHHy.js";var R,z,B,V,H,U,W;function G(){return(G=e((()=>{h(),u(),d(),n(),p(),_(),y(),x(),C(),D(),o(),w(),k(),j(),r(),N(),I(),a(),R=F(),z=[{name:`Inbox`,icon:b},{name:`BookOpen`,icon:i},{name:`ChartColumnBig`,icon:c},{name:`Users`,icon:s},{name:`Settings`,icon:t},{name:`Search`,icon:O},{name:`MessageSquare`,icon:S},{name:`Clock`,icon:v},{name:`Target`,icon:A},{name:`UserCheck`,icon:M},{name:`Sparkles`,icon:E},{name:`Mic`,icon:T},{name:`Bot`,icon:f},{name:`AlertCircle`,icon:g},{name:`Check`,icon:m},{name:`X`,icon:P}],B=[{className:`size-3`,label:`12`},{className:`size-3.5`,label:`14`},{className:`size-4`,label:`16`},{className:`size-5`,label:`20`},{className:`size-10`,label:`40`}],V={title:`Foundations/Icons`,parameters:{layout:`padded`,controls:{disable:!0}}},H={render:()=>(0,R.jsxs)(`div`,{className:`flex flex-col gap-6`,children:[(0,R.jsxs)(`p`,{className:`text-sm text-muted-foreground`,children:[`Lucide, stroke `,L,`, non-scaling. Set once in `,(0,R.jsx)(`code`,{children:`src/lib/icons.tsx`}),`; never pass`,` `,(0,R.jsx)(`code`,{children:`strokeWidth`}),` at a call site.`]}),(0,R.jsxs)(`div`,{className:`grid gap-x-6 gap-y-3`,style:{gridTemplateColumns:`8rem repeat(${B.length}, minmax(3rem, auto))`},children:[(0,R.jsx)(`span`,{}),B.map(e=>(0,R.jsxs)(`span`,{className:`text-xs text-muted-foreground`,children:[e.label,`px`]},e.label)),z.map(({name:e,icon:t})=>(0,R.jsxs)(`div`,{className:`contents`,children:[(0,R.jsx)(`span`,{className:`self-center text-sm`,children:e}),B.map(e=>(0,R.jsx)(`span`,{className:`flex h-10 items-center`,children:(0,R.jsx)(t,{className:e.className})},e.label))]},e))]})]})},U={render:()=>(0,R.jsx)(`div`,{className:`flex h-120 gap-6 rounded-2xl bg-background p-2`,children:[`inbox`,`knowledge`,`reports`,`contacts`,`settings`].map(e=>(0,R.jsx)(l,{active:e,onSelect:()=>{}},e))})},H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Lucide, stroke {ICON_STROKE_WIDTH}, non-scaling. Set once in <code>src/lib/icons.tsx</code>; never pass{" "}
        <code>strokeWidth</code> at a call site.
      </p>
      <div className="grid gap-x-6 gap-y-3" style={{
      gridTemplateColumns: \`8rem repeat(\${SIZES.length}, minmax(3rem, auto))\`
    }}>
        <span />
        {SIZES.map(s => <span key={s.label} className="text-xs text-muted-foreground">
            {s.label}px
          </span>)}
        {SAMPLE.map(({
        name,
        icon: Icon
      }) => <div key={name} className="contents">
            <span className="self-center text-sm">{name}</span>
            {SIZES.map(s => <span key={s.label} className="flex h-10 items-center">
                <Icon className={s.className} />
              </span>)}
          </div>)}
      </div>
    </div>
}`,...H.parameters?.docs?.source},description:{story:`One library, one weight. Every glyph is Lucide, drawn at a constant
device-pixel stroke regardless of size, so a 12px check and a 40px robot
read as the same family.`,...H.parameters?.docs?.description}}},U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex h-120 gap-6 rounded-2xl bg-background p-2">
      {(["inbox", "knowledge", "reports", "contacts", "settings"] as const).map(key => <IconRail key={key} active={key} onSelect={() => {}} />)}
    </div>
}`,...U.parameters?.docs?.source},description:{story:`Selection changes fill, not weight. Destinations fill in their selected state
with interior detail knocked out in the chip colour; actions like search never fill.`,...U.parameters?.docs?.description}}},W=[`Weight`,`SelectedState`]})))()}G();export{U as SelectedState,H as Weight,W as __namedExportsOrder,V as default};