import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./arrow-up-Z7N3pK0K.js";import{n as r,t as i}from"./search-CiZHMDo4.js";import{t as a}from"./jsx-runtime-DeHZSEgm.js";import{a as o,i as s,n as c,o as l,r as u,s as d,t as f}from"./input-group-CGKZ-YbF.js";var p,m,h,g,_,v,y,b;function x(){return(x=e((()=>{t(),r(),d(),p=a(),m={title:`UI/InputGroup`,component:f,subcomponents:{InputGroupInput:s,InputGroupAddon:c,InputGroupButton:u,InputGroupText:o,InputGroupTextarea:l},tags:[`autodocs`],args:{align:`inline-start`,placeholder:`Search conversations...`},argTypes:{align:{description:"`InputGroupAddon` placement. The `block-*` values stack the addon above or below the control and let the group grow.",control:`select`,options:[`inline-start`,`inline-end`,`block-start`,`block-end`],table:{category:`Layout`,type:{summary:`inline-start | inline-end | block-start | block-end`},defaultValue:{summary:`inline-start`}}},placeholder:{control:`text`,table:{category:`Content`}},className:{control:`text`,table:{category:`Content`}}},render:({align:e,placeholder:t,...n})=>(0,p.jsxs)(f,{...n,className:`w-96`,children:[(0,p.jsx)(s,{placeholder:t}),(0,p.jsx)(c,{align:e,children:(0,p.jsx)(i,{})})]})},h={},g={},_={parameters:{controls:{disable:!0}},render:()=>(0,p.jsxs)(f,{className:`w-96`,children:[(0,p.jsx)(s,{placeholder:`Ask the knowledge base...`}),(0,p.jsx)(c,{align:`inline-end`,children:(0,p.jsx)(u,{size:`icon-xs`,variant:`default`,"aria-label":`Send`,children:(0,p.jsx)(n,{})})})]})},v={parameters:{controls:{disable:!0}},render:()=>(0,p.jsxs)(f,{className:`w-96`,children:[(0,p.jsx)(c,{align:`inline-start`,children:(0,p.jsx)(o,{children:`cascade.edu/`})}),(0,p.jsx)(s,{placeholder:`exams/bio-201`})]})},y={parameters:{controls:{disable:!0}},render:()=>(0,p.jsxs)(f,{className:`w-120`,children:[(0,p.jsx)(l,{placeholder:`Write a reply...`,rows:3}),(0,p.jsxs)(c,{align:`block-end`,children:[(0,p.jsx)(o,{children:`Shift + Enter for a new line`}),(0,p.jsx)(u,{size:`icon-sm`,variant:`default`,className:`ml-auto`,"aria-label":`Send`,children:(0,p.jsx)(n,{})})]})]})},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{}`,...h.parameters?.docs?.source},description:{story:"Move the addon around with the `align` control.",...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <InputGroup className="w-96">
      <InputGroupInput placeholder="Ask the knowledge base..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" variant="default" aria-label="Send">
          <ArrowUp />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <InputGroup className="w-96">
      <InputGroupAddon align="inline-start">
        <InputGroupText>cascade.edu/</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="exams/bio-201" />
    </InputGroup>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  parameters: {
    controls: {
      disable: true
    }
  },
  render: () => <InputGroup className="w-120">
      <InputGroupTextarea placeholder="Write a reply..." rows={3} />
      <InputGroupAddon align="block-end">
        <InputGroupText>Shift + Enter for a new line</InputGroupText>
        <InputGroupButton size="icon-sm" variant="default" className="ml-auto" aria-label="Send">
          <ArrowUp />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
}`,...y.parameters?.docs?.source},description:{story:`The composer shape: a textarea with its controls on a row underneath.`,...y.parameters?.docs?.description}}},b=[`Playground`,`SearchField`,`WithTrailingButton`,`WithPrefixText`,`TextareaWithToolbar`]})))()}x();export{h as Playground,g as SearchField,y as TextareaWithToolbar,v as WithPrefixText,_ as WithTrailingButton,b as __namedExportsOrder,m as default};