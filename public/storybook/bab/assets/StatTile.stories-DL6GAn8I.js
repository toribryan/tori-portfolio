import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,r as n,t as r}from"./StatTile-BmxNXabB.js";import{n as i,t as a}from"./message-circle-BtZRhhmx.js";import{t as o}from"./jsx-runtime-DeHZSEgm.js";var s,c,l,u,d;function f(){return(f=e((()=>{i(),n(),s=o(),c={title:`Dashboard/StatTile`,component:t,tags:[`autodocs`]},l={args:{label:`Total conversations`,value:`482`,delta:{text:`+12% vs last period`,direction:`up`}}},u={args:{label:``,value:``},render:()=>(0,s.jsxs)(r,{className:`w-220`,children:[(0,s.jsx)(t,{label:`Total conversations`,icon:(0,s.jsx)(a,{className:`size-3.5`}),value:`482`,delta:{text:`+12%`,direction:`up`},caption:`Last 7 days`}),(0,s.jsx)(t,{label:`Escalated`,value:`14`,delta:{text:`+3`,direction:`down`},highlight:!0,caption:`Requires review`}),(0,s.jsx)(t,{label:`Avg. response time`,value:`2m 14s`,delta:{text:`Above target`,direction:`warn`}}),(0,s.jsx)(t,{label:`CSAT`,value:`94%`,delta:{text:`+2 pts`,direction:`up`}})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    label: "Total conversations",
    value: "482",
    delta: {
      text: "+12% vs last period",
      direction: "up"
    }
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    label: "",
    value: ""
  },
  render: () => <StatGrid className="w-220">
      <StatTile label="Total conversations" icon={<MessageCircle className="size-3.5" />} value="482" delta={{
      text: "+12%",
      direction: "up"
    }} caption="Last 7 days" />
      <StatTile label="Escalated" value="14" delta={{
      text: "+3",
      direction: "down"
    }} highlight caption="Requires review" />
      <StatTile label="Avg. response time" value="2m 14s" delta={{
      text: "Above target",
      direction: "warn"
    }} />
      <StatTile label="CSAT" value="94%" delta={{
      text: "+2 pts",
      direction: "up"
    }} />
    </StatGrid>
}`,...u.parameters?.docs?.source}}},d=[`Default`,`Grid`]})))()}f();export{l as Default,u as Grid,d as __namedExportsOrder,c as default};