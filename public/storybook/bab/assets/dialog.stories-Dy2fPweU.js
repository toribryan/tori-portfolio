import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./button-a6ntTyBe.js";import{a as i,c as a,i as o,l as s,n as c,o as l,r as u,s as d,t as f}from"./dialog-BV_rTFvT.js";var p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{s(),n(),p=t(),m={title:`UI/Dialog`,component:f,subcomponents:{DialogTrigger:a,DialogContent:u,DialogHeader:l,DialogTitle:d,DialogDescription:o,DialogFooter:i,DialogClose:c},tags:[`autodocs`],parameters:{layout:`centered`},args:{defaultOpen:!1,modal:!0,showCloseButton:!0,title:`Close this conversation?`,description:`You can still find it afterward under the Closed filter.`},argTypes:{defaultOpen:{description:`Open on first render — useful for reviewing the dialog itself.`,control:`boolean`,table:{category:`State`,defaultValue:{summary:`false`}}},open:{description:"Controlled state. Leave undefined to use `defaultOpen`.",control:!1,table:{category:`State`}},modal:{description:"`true` traps focus and blocks the page behind; `'trap-focus'` traps focus without blocking.",control:`inline-radio`,options:[!0,!1,`trap-focus`],table:{category:`Behaviour`,defaultValue:{summary:`true`}}},disablePointerDismissal:{description:`Stop clicks on the backdrop from closing the dialog.`,control:`boolean`,table:{category:`Behaviour`,defaultValue:{summary:`false`}}},showCloseButton:{description:"The X in the top-right corner of `DialogContent`.",control:`boolean`,table:{category:`Appearance`,defaultValue:{summary:`true`}}},title:{control:`text`,table:{category:`Content`}},description:{control:`text`,table:{category:`Content`}},onOpenChange:{table:{category:`Events`}}},render:({showCloseButton:e,title:t,description:n,...s})=>(0,p.jsxs)(f,{...s,children:[(0,p.jsx)(a,{render:(0,p.jsx)(r,{children:`Close conversation`})}),(0,p.jsxs)(u,{showCloseButton:e,children:[(0,p.jsxs)(l,{children:[(0,p.jsx)(d,{children:t}),(0,p.jsx)(o,{children:n})]}),(0,p.jsxs)(i,{children:[(0,p.jsx)(c,{render:(0,p.jsx)(r,{variant:`outline`,children:`Cancel`})}),(0,p.jsx)(r,{children:`Close conversation`})]})]})]})},h={},g={},_={args:{defaultOpen:!0}},v={args:{defaultOpen:!0,showCloseButton:!1}},y={args:{defaultOpen:!0,title:`Delete this saved report?`,description:`This cannot be undone. Anyone with the link will lose access.`},render:({showCloseButton:e,title:t,description:n,...s})=>(0,p.jsxs)(f,{...s,children:[(0,p.jsx)(a,{render:(0,p.jsx)(r,{variant:`destructive`,children:`Delete report`})}),(0,p.jsxs)(u,{showCloseButton:e,children:[(0,p.jsxs)(l,{children:[(0,p.jsx)(d,{children:t}),(0,p.jsx)(o,{children:n})]}),(0,p.jsxs)(i,{children:[(0,p.jsx)(c,{render:(0,p.jsx)(r,{variant:`outline`,children:`Cancel`})}),(0,p.jsx)(r,{variant:`destructive`,children:`Delete`})]})]})]})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source},description:{story:`Every prop wired to a control.`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: true
  }
}`,..._.parameters?.docs?.source},description:{story:`Opens on load so the dialog itself is what you review.`,..._.parameters?.docs?.description}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: true,
    showCloseButton: false
  }
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    defaultOpen: true,
    title: "Delete this saved report?",
    description: "This cannot be undone. Anyone with the link will lose access."
  },
  render: ({
    showCloseButton,
    title,
    description,
    ...args
  }) => <Dialog {...args}>
      <DialogTrigger render={<Button variant="destructive">Delete report</Button>} />
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
}`,...y.parameters?.docs?.source}}},b=[`Playground`,`Default`,`Open`,`WithoutCloseButton`,`Destructive`]})))()}x();export{g as Default,y as Destructive,_ as Open,h as Playground,v as WithoutCloseButton,b as __namedExportsOrder,m as default};