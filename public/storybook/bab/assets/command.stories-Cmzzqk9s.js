import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{a as n,c as r,i,l as a,n as o,o as s,r as c,s as l,t as u,u as d}from"./command-sSlNja6m.js";function f({showShortcuts:e}){return(0,p.jsxs)(l,{children:[(0,p.jsx)(c,{children:`No results found.`}),(0,p.jsxs)(i,{heading:`Actions`,children:[(0,p.jsxs)(s,{children:[`Close conversation`,e&&(0,p.jsx)(a,{children:`⌘⇧C`})]}),(0,p.jsxs)(s,{children:[`Grant extra time`,e&&(0,p.jsx)(a,{children:`⌘E`})]}),(0,p.jsx)(s,{disabled:!0,children:`Escalate to proctor`})]}),(0,p.jsx)(r,{}),(0,p.jsxs)(i,{heading:`Navigate`,children:[(0,p.jsx)(s,{children:`Go to Inbox`}),(0,p.jsx)(s,{children:`Go to Reports`})]})]})}var p,m,h,g,_,v,y;function b(){return(b=e((()=>{d(),p=t(),m={title:`UI/Command`,component:u,subcomponents:{CommandInput:n,CommandList:l,CommandGroup:i,CommandItem:s,CommandShortcut:a,CommandEmpty:c,CommandSeparator:r},tags:[`autodocs`],args:{placeholder:`Type a command...`,showShortcuts:!0,shouldFilter:!0,loop:!1},argTypes:{placeholder:{control:`text`,table:{category:`Content`}},showShortcuts:{description:`Story knob — the ⌘ hints on the right of each row.`,control:`boolean`,table:{category:`Content`}},shouldFilter:{description:`Let cmdk filter the list as you type. Turn off when the results come from a server.`,control:`boolean`,table:{category:`Behaviour`,defaultValue:{summary:`true`}}},loop:{description:`Wrap arrow-key navigation from the last item to the first.`,control:`boolean`,table:{category:`Behaviour`,defaultValue:{summary:`false`}}},className:{control:`text`,table:{category:`Content`}}},render:({placeholder:e,showShortcuts:t,...r})=>(0,p.jsxs)(u,{...r,className:`w-100 rounded-lg border`,children:[(0,p.jsx)(n,{placeholder:e}),(0,p.jsx)(f,{showShortcuts:t})]})},h={},g={},_={args:{showShortcuts:!1}},v={parameters:{controls:{disable:!0}},render:({placeholder:e,showShortcuts:t})=>(0,p.jsxs)(o,{defaultOpen:!0,children:[(0,p.jsx)(n,{placeholder:e}),(0,p.jsx)(f,{showShortcuts:t})]})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source},description:{story:`Every prop wired to a control.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    showShortcuts: false
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: ({
    placeholder,
    showShortcuts
  }) => <CommandDialog defaultOpen>
      <CommandInput placeholder={placeholder} />
      <Items showShortcuts={showShortcuts} />
    </CommandDialog>
}`,...v.parameters?.docs?.source},description:{story:`The same list inside the modal the ⌘K palette uses.`,...v.parameters?.docs?.description}}},y=[`Playground`,`Default`,`WithoutShortcuts`,`InDialog`]})))()}b();export{g as Default,v as InDialog,h as Playground,_ as WithoutShortcuts,y as __namedExportsOrder,m as default};