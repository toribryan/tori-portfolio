import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{n,t as r}from"./badge-CuWNVRK1.js";import{n as i,t as a}from"./button-BXVeIaZu.js";import{a as o,c as s,i as c,o as l,r as u,s as d,t as f}from"./card-Ce-plkPU.js";function p({total:e,kept:t,pct:n,cell:r,gap:i,columns:a,label:o}){let s=a*(r+i)-i;return(0,g.jsxs)(`section`,{className:`flex flex-col gap-3`,style:{width:s},children:[(0,g.jsxs)(`header`,{className:`flex items-baseline justify-between gap-4`,children:[(0,g.jsx)(`h3`,{className:`text-sm font-medium`,children:o}),(0,g.jsxs)(`p`,{className:`font-mono text-xs text-muted-foreground tabular-nums`,children:[e.toLocaleString(),` → `,t,` (`,n,`% removed)`]})]}),(0,g.jsx)(`div`,{"aria-hidden":!0,className:`grid`,style:{gap:i,gridTemplateColumns:`repeat(${a}, ${r}px)`},children:Array.from({length:e},(e,n)=>(0,g.jsx)(`span`,{className:n<t?`rounded-[1px] bg-primary`:`rounded-[1px] bg-muted-foreground/25`,style:{width:r,height:r}},n))}),(0,g.jsxs)(`p`,{className:`text-xs text-muted-foreground`,children:[(0,g.jsx)(`span`,{className:`inline-block size-2 translate-y-[1px] rounded-[1px] bg-primary`}),` `,`kept`,(0,g.jsx)(`span`,{className:`mx-2 text-muted-foreground/40`,children:`|`}),(0,g.jsx)(`span`,{className:`inline-block size-2 translate-y-[1px] rounded-[1px] bg-muted-foreground/25`}),` `,`removed`]})]})}function m({tier:e,note:t,children:n}){return(0,g.jsxs)(`div`,{className:`grid items-start gap-3 sm:grid-cols-[168px_1fr]`,children:[(0,g.jsxs)(`div`,{className:`flex flex-col gap-0.5`,children:[(0,g.jsx)(`p`,{className:`font-mono text-xs tracking-wide uppercase`,children:e}),(0,g.jsx)(`p`,{className:`text-xs text-muted-foreground`,children:t})]}),(0,g.jsx)(`div`,{className:`flex flex-wrap gap-2`,children:n})]})}function h({name:e,className:t}){return(0,g.jsxs)(`span`,{className:`flex items-center gap-2 rounded-md bg-surface-nested px-2 py-1 font-mono text-[11px]`,children:[(0,g.jsx)(`span`,{className:`size-3 shrink-0 rounded-[3px] ring-1 ring-black/10 ${t}`}),e]})}var g,_,v,y,b,x,S,C;function w(){return(w=e((()=>{n(),i(),s(),g=t(),_={title:`Case Study/Design System Overhaul`,tags:[`!dev`,`!autodocs`,`!test`],parameters:{layout:`padded`,docs:{description:{component:`Visual companions to the Design System Overhaul case study on toribryan.com.

These are not console components. They are diagrams that happen to be built
from the system, so the thing making the argument is the thing being argued
about. Each export is embedded individually via \`<StoryEmbed id="..." />\`, so
keep story names stable: renaming one changes its id and breaks the embed.`}}}},v={render:()=>(0,g.jsxs)(`div`,{className:`flex flex-col gap-8`,children:[(0,g.jsx)(p,{label:`Card`,total:587,kept:32,pct:94,cell:14,gap:3,columns:52}),(0,g.jsx)(p,{label:`Button`,total:1160,kept:480,pct:59,cell:10,gap:2,columns:73})]})},y={render:()=>(0,g.jsx)(`div`,{className:`flex max-w-[900px] flex-col gap-6`,children:(0,g.jsxs)(`div`,{className:`grid gap-6 sm:grid-cols-2`,children:[(0,g.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,g.jsx)(`h3`,{className:`text-sm font-medium`,children:`One component, ten switches`}),(0,g.jsx)(`ul`,{className:`flex flex-col gap-1 font-mono text-xs`,children:[`hasIcon`,`hasBadge`,`hasFooter`,`isCompact`,`isElevated`,`isSelectable`,`showsMeta`,`reportVariant`,`inboxVariant`,`adminVariant`].map(e=>(0,g.jsxs)(`li`,{className:`flex items-baseline gap-1`,children:[(0,g.jsx)(`span`,{className:`text-foreground`,children:e}),(0,g.jsx)(`span`,{className:`text-muted-foreground`,children:`: boolean`})]},e))})]}),(0,g.jsxs)(`div`,{className:`flex flex-col justify-center gap-3 rounded-lg bg-surface-nested p-5`,children:[(0,g.jsxs)(`p`,{className:`font-mono text-xs text-muted-foreground`,children:[`2`,(0,g.jsx)(`sup`,{children:`10`}),` = 1,024 reachable states`]}),(0,g.jsx)(`p`,{className:`text-sm leading-relaxed`,children:`Nobody designed a thousand cards. The combinations were a by-product of the API, and every one of them was a thing to maintain, document and scroll past.`}),(0,g.jsx)(`p`,{className:`text-sm leading-relaxed text-muted-foreground`,children:`The last three flags are the real tell: a component that knows which product it is in cannot be reused, only copied.`})]})]})})},b={render:()=>(0,g.jsxs)(`div`,{className:`flex max-w-[900px] flex-col gap-5`,children:[(0,g.jsx)(`p`,{className:`max-w-[60ch] text-sm leading-relaxed text-muted-foreground`,children:`Three different jobs, one Card. Nothing below required a new variant, a new flag, or a component that knows which product it is rendering in.`}),(0,g.jsxs)(`div`,{className:`grid gap-4 sm:grid-cols-3`,children:[(0,g.jsxs)(f,{children:[(0,g.jsxs)(l,{children:[(0,g.jsx)(d,{children:`Escalated`}),(0,g.jsx)(c,{children:`Last 7 days`})]}),(0,g.jsx)(u,{children:(0,g.jsx)(`p`,{className:`font-mono text-3xl tabular-nums`,children:`14`})})]}),(0,g.jsxs)(f,{children:[(0,g.jsxs)(l,{children:[(0,g.jsx)(d,{children:`Room scan`}),(0,g.jsx)(c,{children:`Failures by cause`})]}),(0,g.jsxs)(u,{className:`flex flex-wrap gap-1.5`,children:[(0,g.jsx)(r,{children:`Lighting`}),(0,g.jsx)(r,{variant:`secondary`,children:`Angle`}),(0,g.jsx)(r,{variant:`secondary`,children:`Incomplete`})]})]}),(0,g.jsxs)(f,{children:[(0,g.jsxs)(l,{children:[(0,g.jsx)(d,{children:`Integrity review`}),(0,g.jsx)(c,{children:`3 sessions flagged`})]}),(0,g.jsx)(u,{children:(0,g.jsx)(`p`,{className:`text-sm text-muted-foreground`,children:`Awaiting instructor decision.`})}),(0,g.jsx)(o,{children:(0,g.jsx)(a,{size:`sm`,children:`Open queue`})})]})]}),(0,g.jsx)(`p`,{className:`max-w-[60ch] text-xs text-muted-foreground`,children:`Slots move capability out of variants and into composition, which is the only place it can be recombined.`})]})},x={render:()=>(0,g.jsxs)(`div`,{className:`flex max-w-[900px] flex-col gap-7`,children:[(0,g.jsxs)(m,{tier:`Primitive`,note:`Raw values. Named for what they are.`,children:[(0,g.jsx)(h,{name:`--red-600`,className:`bg-primary`}),(0,g.jsx)(h,{name:`--neutral-100`,className:`bg-surface-nested`}),(0,g.jsx)(h,{name:`--neutral-900`,className:`bg-foreground`}),(0,g.jsx)(h,{name:`--green-600`,className:`bg-success`})]}),(0,g.jsxs)(m,{tier:`Semantic`,note:`Roles. This is the layer that makes a theme possible.`,children:[(0,g.jsx)(h,{name:`--primary`,className:`bg-primary`}),(0,g.jsx)(h,{name:`--surface-nested`,className:`bg-surface-nested`}),(0,g.jsx)(h,{name:`--foreground`,className:`bg-foreground`}),(0,g.jsx)(h,{name:`--success`,className:`bg-success`})]}),(0,g.jsxs)(m,{tier:`Component`,note:`Consumes roles only. Never reaches past them to a raw value.`,children:[(0,g.jsx)(h,{name:`--button-bg`,className:`bg-primary`}),(0,g.jsx)(h,{name:`--card-well`,className:`bg-surface-nested`}),(0,g.jsx)(h,{name:`--card-title`,className:`bg-foreground`}),(0,g.jsx)(h,{name:`--badge-ok`,className:`bg-success`})]})]})},S={render:()=>{let e=(0,g.jsxs)(f,{children:[(0,g.jsxs)(l,{children:[(0,g.jsx)(d,{children:`Escalated conversations`}),(0,g.jsx)(c,{children:`Last 7 days, all institutions`})]}),(0,g.jsxs)(u,{className:`flex items-end gap-3`,children:[(0,g.jsx)(`p`,{className:`font-mono text-3xl tabular-nums`,children:`14`}),(0,g.jsx)(r,{children:`+3`})]}),(0,g.jsx)(o,{children:(0,g.jsx)(a,{size:`sm`,children:`View report`})})]});return(0,g.jsx)(`div`,{className:`flex max-w-[900px] flex-col gap-5`,children:(0,g.jsxs)(`div`,{className:`grid gap-4 sm:grid-cols-2`,children:[(0,g.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,g.jsx)(`p`,{className:`font-mono text-xs tracking-wide text-muted-foreground uppercase`,children:`Theme A`}),(0,g.jsx)(`div`,{className:`rounded-xl bg-background p-4 ring-1 ring-border`,children:e})]}),(0,g.jsxs)(`div`,{className:`flex flex-col gap-2`,children:[(0,g.jsx)(`p`,{className:`font-mono text-xs tracking-wide text-muted-foreground uppercase`,children:`Theme B`}),(0,g.jsx)(`div`,{className:`rounded-xl bg-background p-4 ring-1 ring-border`,style:{"--primary":`#1f4bd8`,"--background":`#eceff6`,"--card":`#ffffff`,"--surface-nested":`#f5f7fb`,"--sel":`#d3daea`},children:e})]})]})})}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-8">
      <VariantWall label="Card" total={587} kept={32} pct={94} cell={14} gap={3} columns={52} />
      <VariantWall label="Button" total={1160} kept={480} pct={59} cell={10} gap={2} columns={73} />
    </div>
}`,...v.parameters?.docs?.source},description:{story:`The headline number, drawn rather than stated. Every cell is one variant that
existed in the legacy library; the coloured ones are what survived.`,...v.parameters?.docs?.description}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const flags = ["hasIcon", "hasBadge", "hasFooter", "isCompact", "isElevated", "isSelectable", "showsMeta", "reportVariant", "inboxVariant", "adminVariant"];
    return <div className="flex max-w-[900px] flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">One component, ten switches</h3>
            <ul className="flex flex-col gap-1 font-mono text-xs">
              {flags.map(flag => <li key={flag} className="flex items-baseline gap-1">
                  <span className="text-foreground">{flag}</span>
                  <span className="text-muted-foreground">: boolean</span>
                </li>)}
            </ul>
          </div>

          <div className="flex flex-col justify-center gap-3 rounded-lg bg-surface-nested p-5">
            <p className="font-mono text-xs text-muted-foreground">
              2<sup>10</sup> = 1,024 reachable states
            </p>
            <p className="text-sm leading-relaxed">
              Nobody designed a thousand cards. The combinations were a
              by-product of the API, and every one of them was a thing to
              maintain, document and scroll past.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The last three flags are the real tell: a component that knows
              which product it is in cannot be reused, only copied.
            </p>
          </div>
        </div>
      </div>;
  }
}`,...y.parameters?.docs?.source},description:{story:`Why the wall got that big: each new requirement arrived as another switch,
and switches multiply.`,...y.parameters?.docs?.description}}},b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex max-w-[900px] flex-col gap-5">
      <p className="max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
        Three different jobs, one Card. Nothing below required a new variant, a
        new flag, or a component that knows which product it is rendering in.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Escalated</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-3xl tabular-nums">14</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room scan</CardTitle>
            <CardDescription>Failures by cause</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            <Badge>Lighting</Badge>
            <Badge variant="secondary">Angle</Badge>
            <Badge variant="secondary">Incomplete</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrity review</CardTitle>
            <CardDescription>3 sessions flagged</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Awaiting instructor decision.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Open queue</Button>
          </CardFooter>
        </Card>
      </div>

      <p className="max-w-[60ch] text-xs text-muted-foreground">
        Slots move capability out of variants and into composition, which is the
        only place it can be recombined.
      </p>
    </div>
}`,...b.parameters?.docs?.source},description:{story:`The replacement. One structure, holding space for whatever belongs there, so
a new requirement is a composition rather than a modification.`,...b.parameters?.docs?.description}}},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex max-w-[900px] flex-col gap-7">
      <TokenRow tier="Primitive" note="Raw values. Named for what they are.">
        <Swatch name="--red-600" className="bg-primary" />
        <Swatch name="--neutral-100" className="bg-surface-nested" />
        <Swatch name="--neutral-900" className="bg-foreground" />
        <Swatch name="--green-600" className="bg-success" />
      </TokenRow>

      <TokenRow tier="Semantic" note="Roles. This is the layer that makes a theme possible.">
        <Swatch name="--primary" className="bg-primary" />
        <Swatch name="--surface-nested" className="bg-surface-nested" />
        <Swatch name="--foreground" className="bg-foreground" />
        <Swatch name="--success" className="bg-success" />
      </TokenRow>

      <TokenRow tier="Component" note="Consumes roles only. Never reaches past them to a raw value.">
        <Swatch name="--button-bg" className="bg-primary" />
        <Swatch name="--card-well" className="bg-surface-nested" />
        <Swatch name="--card-title" className="bg-foreground" />
        <Swatch name="--badge-ok" className="bg-success" />
      </TokenRow>
    </div>
}`,...x.parameters?.docs?.source},description:{story:`The layer that had to exist before a single component was worth touching.
Values at the bottom, meaning in the middle, usage at the top.`,...x.parameters?.docs?.description}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    const panel = <Card>
        <CardHeader>
          <CardTitle>Escalated conversations</CardTitle>
          <CardDescription>Last 7 days, all institutions</CardDescription>
        </CardHeader>
        <CardContent className="flex items-end gap-3">
          <p className="font-mono text-3xl tabular-nums">14</p>
          <Badge>+3</Badge>
        </CardContent>
        <CardFooter>
          <Button size="sm">View report</Button>
        </CardFooter>
      </Card>;
    return <div className="flex max-w-[900px] flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              Theme A
            </p>
            <div className="rounded-xl bg-background p-4 ring-1 ring-border">
              {panel}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              Theme B
            </p>
            <div className="rounded-xl bg-background p-4 ring-1 ring-border" style={{
            "--primary": "#1f4bd8",
            "--background": "#eceff6",
            "--card": "#ffffff",
            "--surface-nested": "#f5f7fb",
            "--sel": "#d3daea"
          } as React.CSSProperties}>
              {panel}
            </div>
          </div>
        </div>
      </div>;
  }
}`,...S.parameters?.docs?.source},description:{story:`The payoff of the semantic layer: the same composition under two themes,
with no component aware that anything changed.`,...S.parameters?.docs?.description}}},C=[`VariantMath`,`AttributeSprawl`,`Composition`,`TokenArchitecture`,`ThemeAware`]})))()}w();export{y as AttributeSprawl,b as Composition,S as ThemeAware,x as TokenArchitecture,v as VariantMath,C as __namedExportsOrder,_ as default};