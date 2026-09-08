import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./circle-check-BFWfvhBY.js";import{t as r}from"./jsx-runtime-DeHZSEgm.js";import{n as i,t as a}from"./badge-DZeIpR5Y.js";var o,s,c,l,u,d,f,p,m,h,g,_;function v(){return(v=e((()=>{t(),i(),o=r(),s=[`default`,`secondary`,`destructive`,`outline`,`ghost`,`link`,`admin`,`student`,`instructor`,`success`,`live`,`closed`],c={title:`UI/Badge`,component:a,tags:[`autodocs`],args:{children:`Badge`,variant:`default`},argTypes:{variant:{description:"`admin`, `student` and `instructor` are semantic role colours — the same three hues the chart series use — not decoration. `success` and `destructive` are status.",control:`select`,options:s,table:{category:`Appearance`,type:{summary:s.join(` | `)},defaultValue:{summary:`default`}}},children:{description:`Label. A lucide icon may be passed alongside the text.`,control:`text`,table:{category:`Content`}},className:{control:`text`,table:{category:`Content`}},render:{description:'Base UI render prop — pass an element to change the rendered tag, e.g. `render={<a href="..." />}`.',control:!1,table:{category:`Composition`}}}},l={},u={},d={args:{variant:`secondary`,children:`Secondary`}},f={args:{variant:`destructive`,children:`Escalated`}},p={args:{variant:`outline`,children:`Outline`}},m={parameters:{controls:{disable:!0}},render:()=>(0,o.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,o.jsx)(a,{variant:`student`,children:`Student`}),(0,o.jsx)(a,{variant:`instructor`,children:`Instructor`}),(0,o.jsx)(a,{variant:`admin`,children:`Admin`})]})},h={args:{variant:`success`,children:(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n,{}),`Cleared`]})}},g={parameters:{controls:{disable:!0}},render:()=>(0,o.jsx)(`div`,{className:`flex flex-wrap items-center gap-2`,children:s.map(e=>(0,o.jsx)(a,{variant:e,children:e},e))})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{}`,...l.parameters?.docs?.source},description:{story:`Every prop wired to a control.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "secondary",
    children: "Secondary"
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "destructive",
    children: "Escalated"
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "outline",
    children: "Outline"
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-wrap items-center gap-2">
      <Badge variant="student">Student</Badge>
      <Badge variant="instructor">Instructor</Badge>
      <Badge variant="admin">Admin</Badge>
    </div>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    variant: "success",
    children: <>
        <CircleCheck />
        Cleared
      </>
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <div className="flex flex-wrap items-center gap-2">
      {VARIANTS.map(variant => <Badge key={variant} variant={variant}>
          {variant}
        </Badge>)}
    </div>
}`,...g.parameters?.docs?.source}}},_=[`Playground`,`Default`,`Secondary`,`Destructive`,`Outline`,`Role`,`WithIcon`,`AllVariants`]})))()}v();export{g as AllVariants,u as Default,f as Destructive,p as Outline,l as Playground,m as Role,d as Secondary,h as WithIcon,_ as __namedExportsOrder,c as default};