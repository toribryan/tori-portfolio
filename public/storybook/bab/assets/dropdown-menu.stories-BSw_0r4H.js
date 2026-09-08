import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./button-a6ntTyBe.js";import{a as i,c as a,i as o,n as s,o as c,r as l,s as u,t as d}from"./dropdown-menu-BJCsouox.js";var f,p,m,h,g,_,v,y;function b(){return(b=e((()=>{a(),n(),f=t(),p={title:`UI/DropdownMenu`,component:d,subcomponents:{DropdownMenuTrigger:u,DropdownMenuContent:l,DropdownMenuLabel:i,DropdownMenuItem:o,DropdownMenuCheckboxItem:s,DropdownMenuSeparator:c},tags:[`autodocs`],args:{defaultOpen:!1,modal:!0,disabled:!1,loopFocus:!0,highlightItemOnHover:!0,triggerLabel:`All statuses`},argTypes:{defaultOpen:{control:`boolean`,table:{category:`State`,defaultValue:{summary:`false`}}},open:{control:!1,table:{category:`State`}},disabled:{control:`boolean`,table:{category:`State`,defaultValue:{summary:`false`}}},modal:{control:`boolean`,table:{category:`Behaviour`,defaultValue:{summary:`true`}}},loopFocus:{description:`Wrap keyboard focus from the last item back to the first.`,control:`boolean`,table:{category:`Behaviour`,defaultValue:{summary:`true`}}},highlightItemOnHover:{control:`boolean`,table:{category:`Behaviour`,defaultValue:{summary:`true`}}},triggerLabel:{control:`text`,table:{category:`Content`}},onOpenChange:{table:{category:`Events`}}},render:({triggerLabel:e,...t})=>(0,f.jsxs)(d,{...t,children:[(0,f.jsx)(u,{render:(0,f.jsx)(r,{variant:`outline`,children:e})}),(0,f.jsxs)(l,{children:[(0,f.jsx)(i,{children:`Status`}),(0,f.jsx)(c,{}),(0,f.jsx)(o,{children:`Open`}),(0,f.jsx)(o,{children:`Closed`}),(0,f.jsx)(o,{children:`Escalated`})]})]})},m={},h={},g={args:{defaultOpen:!0}},_={args:{triggerLabel:`All categories`,defaultOpen:!0},render:({triggerLabel:e,...t})=>(0,f.jsxs)(d,{...t,children:[(0,f.jsx)(u,{render:(0,f.jsx)(r,{variant:`outline`,children:e})}),(0,f.jsxs)(l,{children:[(0,f.jsx)(s,{checked:!0,children:`Human Support`}),(0,f.jsx)(s,{children:`AI & Automation`}),(0,f.jsx)(s,{children:`Proctoring`})]})]})},v={args:{disabled:!0}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{}`,...m.parameters?.docs?.source},description:{story:`Every prop wired to a control.`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: true
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    triggerLabel: "All categories",
    defaultOpen: true
  },
  render: ({
    triggerLabel,
    ...args
  }) => <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline">{triggerLabel}</Button>} />
      <DropdownMenuContent>
        <DropdownMenuCheckboxItem checked>Human Support</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>AI &amp; Automation</DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Proctoring</DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: true
  }
}`,...v.parameters?.docs?.source}}},y=[`Playground`,`Default`,`Open`,`CheckboxItems`,`Disabled`]})))()}b();export{_ as CheckboxItems,h as Default,v as Disabled,g as Open,m as Playground,y as __namedExportsOrder,p as default};