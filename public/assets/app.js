"use strict";(()=>{var k=Object.defineProperty;var A=(t,e)=>()=>(t&&(e=t(t=0)),e);var S=(t,e)=>{for(var r in e)k(t,r,{get:e[r],enumerable:!0})};var $={};S($,{renderLayout:()=>o,updateMetaDate:()=>m});function o(t,e,r=!0){return`
    <div class="container">
        <header style="margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <h1 style="margin:0;"><a href="/" style="text-decoration:none; color:inherit;">MySupermarket Signals</a></h1>
            <div class="meta" id="last-updated">Updating status...</div>
        </header>
        <main>
            ${r?'<div style="margin-bottom: 20px;"><a href="/" class="back-link">\u2190 Dashboard</a></div>':""}
            ${e}
        </main>
        <footer class="disclaimer" style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px;">
            <p><strong>Official Signals Only.</strong> Not a retail price comparison site.</p>
            <p>Data sources: Office for National Statistics (ONS), Food Standards Agency (FSA), DEFRA.</p>
        </footer>
    </div>
    `}function m(t){let e=document.getElementById("last-updated");if(e)try{let r=new Date(t);e.textContent=`Official UK Food Data \u2022 Last Updated: ${r.toUTCString()}`}catch{e.textContent="Official UK Food Data"}}var f=A(()=>{"use strict"});var g=null;async function h(){try{let t=await fetch(`/data/_meta.json?t=${Date.now()}`);if(!t.ok)return null;let e=await t.json();return e?.lastUpdated&&(g=new Date(e.lastUpdated).getTime().toString()),e}catch{return null}}async function y(){try{let t=g?`?v=${g}`:`?t=${Date.now()}`,e=await fetch(`/data/_registry.json${t}`);return e.ok?await e.json():null}catch{return null}}async function l(t){try{let e=g?`?v=${g}`:`?t=${Date.now()}`,r=await fetch(`/data/${t}.json${e}`);return r.ok?await r.json():null}catch{return null}}f();f();async function w(){let[t,e]=await Promise.all([l("uk.food-inflation"),l("uk.food-alerts")]),r=t?.signal,n=r?.food_inflation_yoy_percent?`${r.food_inflation_yoy_percent}%`:"--",a=t?.status||"unknown",i=Array.isArray(e?.items)?e.items.length:0,s=i>0?"Alerts Active":"No Critical Alerts",d=`
    <div class="signal-grid">
        <!-- Card 1: Price Pressure -->
        <a href="/price-pressure" class="card border-left-info">
            <h3>Price Pressure</h3>
            <div class="signal-value">High</div>
            <div class="meta">Tracking core commodities</div>
            <div class="action-link">View Analysis &rarr;</div>
        </a>

        <!-- Card 2: Inflation -->
        <a href="/inflation-trends" class="card ${x(a)}">
            <h3>UK Food Inflation</h3>
            <div class="signal-value ${I(a)}">${n}</div>
            <div class="meta">Official ONS Data</div>
            <div class="action-link">View Trends &rarr;</div>
        </a>

        <!-- Card 3: Alerts -->
        <a href="/alerts" class="card ${i>0?"border-left-bad":"border-left-good"}">
            <h3>Safety Alerts</h3>
            <div class="signal-value">${i} Active</div>
            <div class="meta">Recalls & Allergy Warnings</div>
            <div class="action-link">View Alerts &rarr;</div>
        </a>
    </div>
    `;return o("Dashboard",d,!1)}function x(t){return t==="rising"||t==="alert"?"border-left-bad":t==="easing"||t==="safe"?"border-left-good":"border-left-warn"}function I(t){return t==="rising"?"trend-up":t==="easing"?"trend-down":"trend-flat"}f();async function P(t){let r=t.split("/").filter(Boolean)[1];if(r){let n="";if(r.includes("egg")&&(n="uk.eggs.pressure"),!n)return o("Not Found","<p>Signal not found.</p>");let a=await l(n);if(!a)return o("Not Found","<p>Data unavailable.</p>");let i=a.signal,s=a.status==="rising"?"High / Rising":"Stable",d=`
            <div class="card">
                <h2>${a.title}</h2>
                <div class="signal-value ${a.status==="rising"?"trend-up":"trend-flat"}">${s}</div>
                <p><strong>YoY Increase:</strong> ${i?.yoy_percent||"--"}%</p>
                <p><strong>Current Price:</strong> \xA3${i?.price||"--"} (${i?.unit||""})</p>
                <div class="meta">Source: ${a.source.name}</div>
            </div>
            
            <div style="margin-top:20px;">
                <h3>Analysis</h3>
                <p>Evidence suggests prices are ${a.status} due to market conditions.</p>
            </div>
        `;return o(a.title,d)}else{let i=[await l("uk.eggs.pressure")].filter(Boolean).map(s=>`
            <a href="/price-pressure/${s.title.toLowerCase().replace(/\s+/g,"-")}" class="card" style="text-decoration:none; color:inherit; display:block;">
                <h3>${s.title}</h3>
                <div class="signal-value ${s.status==="rising"?"trend-up":"trend-flat"}">${s.status.toUpperCase()}</div>
                <div class="meta">Updated: ${new Date(s.last_checked_utc).toLocaleDateString()}</div>
            </a>
        `).join("");return o("Price Pressure Hub",`
            <div class="signal-grid">
                ${i}
            </div>
        `)}}f();async function b(){let[t,e]=await Promise.all([l("uk.food-inflation"),l("uk.inflation.notices")]),r=t?.signal,n=r?.food_inflation_yoy_percent,a=n?`${n}%`:"--",i=t?.status||"unknown",s=r?.period||"Unknown",d=`
            <div class="card">
                <h3>UK Food Inflation (YoY)</h3>
                <div class="signal-value ${L(i)}">${a}</div>
                <div class="meta">Reference Period: ${s}</div>
            </div>
            <!-- Placeholder for MoM or other macro metrics -->
             <div class="card card-placeholder">
                <h3>Month-on-Month</h3>
                <div class="signal-value">--</div>
                <div class="meta">Coming Soon</div>
            </div>
    `,u="";e&&Array.isArray(e.items)?u=e.items.map(p=>`
            <a href="${p.url}" target="_blank" class="card">
                <h3>${p.title}</h3>
                <div class="meta">${N(p.date)} \u2022 ${p.source_name}</div>
                <p class="meta-summary">${p.summary||""}</p>
                <div class="action-link">View Notice &nearr;</div>
            </a>
        `).join(""):u='<div class="card"><p>No recent notices available.</p></div>';let c=`
        <h2>Inflation Metrics</h2>
        <div class="signal-grid section-spacer">
            ${d}
        </div>

        <h2>Inflation Notices</h2>
        <p class="meta" style="margin-bottom:20px;">Official updates from ONS, DEFRA, and GOV.UK</p>
        <div class="signal-grid">
            ${u}
        </div>
        
        <div class="section-top">
            <h3>Source Data</h3>
            <p>Derived from <a href="https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7c8/mm23/data">Office for National Statistics</a> (CPI).</p>
        </div>
    `;return o("Inflation Trends",c)}function L(t){return t==="rising"?"trend-up":t==="easing"?"trend-down":"trend-flat"}function N(t){try{return new Date(t).toLocaleDateString()}catch{return t}}f();async function D(t){let r=(await l("uk.food-alerts"))?.items||[],a=t.split("/").filter(Boolean)[1]||"all",i=a==="all"?r:r.filter(c=>c.problem?.type===a),s=`
        <div class="hub-nav">
            <a href="/alerts" class="${a==="all"?"active":""}">All</a> |
            <a href="/alerts/allergy" class="${a==="allergy"?"active":""}">Allergy</a> |
            <a href="/alerts/recall" class="${a==="recall"?"active":""}">Recalls</a>
        </div>
    `,d=i.length>0?i.map(c=>`
        <div class="card">
             <div class="meta">${new Date(c.created).toLocaleDateString()}</div>
             <h3>${c.title}</h3>
             <p>${c.shortTitle||c.title}</p>
             <div class="confidence-pill">${c.problem?.type||"Alert"}</div>
        </div>
    `).join(""):"<p>No alerts found for this category.</p>",u=`
        ${s}
        <h2>${a.charAt(0).toUpperCase()+a.slice(1)} Alerts</h2>
        <div class="signal-grid">
            ${d}
        </div>
    `;return o("Alerts & Recalls",u)}async function C(){let{renderLayout:t}=await Promise.resolve().then(()=>(f(),$));return t("404 Not Found",`
        <div class="container" style="text-align: center; padding: 50px 0;">
            <h1>404</h1>
            <p>Page not found</p>
            <a href="/" class="back-link">Return Home</a>
        </div>
    `)}async function v(){let t=window.location.pathname,e=document.getElementById("app");if(!e)return;let r=t.length>1&&t.endsWith("/")?t.slice(0,-1):t,n="";try{r==="/"||r==="/index.html"?n=await w():r.startsWith("/price-pressure")?n=await P(r):r.startsWith("/inflation-trends")?n=await b():r.startsWith("/alerts")?n=await D(r):(console.warn(`No route match for: ${r}`),n=await C()),e.innerHTML=n,window.scrollTo(0,0)}catch(a){console.error("Render error:",a),e.innerHTML='<div class="container error"><h2>Error loading page</h2><p>Please refresh.</p></div>'}}window.addEventListener("popstate",v);document.addEventListener("DOMContentLoaded",async()=>{try{let[t,e]=await Promise.all([h(),y()]);t&&t.lastUpdated&&m(t.lastUpdated),e&&console.log("Registry loaded",e.length,"items")}catch(t){console.error("Init error (non-fatal):",t)}document.body.addEventListener("click",t=>{let e=t.target.closest("a");if(e&&e.getAttribute("href")?.startsWith("/")&&!e.getAttribute("target")){t.preventDefault();let r=e.getAttribute("href");history.pushState(null,"",r),v()}}),v()});})();
//# sourceMappingURL=app.js.map
