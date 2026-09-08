import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./TrendChart-CsEoFKQx.js";var i,a,o,s,c,l;function u(){return(u=e((()=>{n(),i=t(),a={title:`Dashboard/TrendChart`,component:r,tags:[`autodocs`]},o=[`May 18`,`May 25`,`Jun 1`,`Jun 8`,`Jun 15`,`Jun 22`,`Jun 29`,`Jul 6`,`Jul 13`,`Jul 20`,`Jul 27`,`Aug 3`],s={args:{categories:[],series:[],values:{}},render:()=>(0,i.jsx)(`div`,{className:`w-280`,children:(0,i.jsx)(r,{categories:o,showLegend:!0,series:[{key:`all`,label:`All conversations`,color:`var(--series-all)`,emphasis:!0},{key:`student`,label:`Student`,color:`var(--series-student)`},{key:`instructor`,label:`Instructor`,color:`var(--series-instructor)`},{key:`admin`,label:`Administrator`,color:`var(--series-admin)`}],values:{all:[9,10,11,10,12,13,14,15,17,19,21,24],student:[5,6,6,6,7,7,8,9,10,11,12,13],instructor:[3,3,4,3,4,4,4,5,5,6,6,7],admin:[1,1,1,2,1,2,2,2,2,3,3,3]}})})},c={args:{categories:[],series:[],values:{}},render:()=>(0,i.jsx)(`div`,{className:`w-280`,children:(0,i.jsx)(r,{categories:o,series:[{key:`response`,label:`Median time to first response`,color:`var(--series-all)`}],values:{response:[3.4,3.2,3.1,2.9,2.8,2.9,2.6,2.5,2.4,2.2,2.3,2.1]}})})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    categories: [],
    series: [],
    values: {}
  },
  render: () => <div className="w-280">
      <TrendChart categories={WEEKS} showLegend series={[{
      key: "all",
      label: "All conversations",
      color: "var(--series-all)",
      emphasis: true
    }, {
      key: "student",
      label: "Student",
      color: "var(--series-student)"
    }, {
      key: "instructor",
      label: "Instructor",
      color: "var(--series-instructor)"
    }, {
      key: "admin",
      label: "Administrator",
      color: "var(--series-admin)"
    }]} values={{
      all: [9, 10, 11, 10, 12, 13, 14, 15, 17, 19, 21, 24],
      student: [5, 6, 6, 6, 7, 7, 8, 9, 10, 11, 12, 13],
      instructor: [3, 3, 4, 3, 4, 4, 4, 5, 5, 6, 6, 7],
      admin: [1, 1, 1, 2, 1, 2, 2, 2, 2, 3, 3, 3]
    }} />
    </div>
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    categories: [],
    series: [],
    values: {}
  },
  render: () => <div className="w-280">
      <TrendChart categories={WEEKS} series={[{
      key: "response",
      label: "Median time to first response",
      color: "var(--series-all)"
    }]} values={{
      response: [3.4, 3.2, 3.1, 2.9, 2.8, 2.9, 2.6, 2.5, 2.4, 2.2, 2.3, 2.1]
    }} />
    </div>
}`,...c.parameters?.docs?.source}}},l=[`MultiSeries`,`SingleSeries`]})))()}u();export{s as MultiSeries,c as SingleSeries,l as __namedExportsOrder,a as default};