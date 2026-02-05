"use strict";(()=>{var N=Object.defineProperty;var $=(t,e)=>()=>(t&&(e=t(t=0)),e);var b=(t,e)=>{for(var r in e)N(t,r,{get:e[r],enumerable:!0})};var S={};b(S,{renderLayout:()=>o,updateMetaDate:()=>m});function o(t,e,r=!0){return`
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
    `}function m(t){let e=document.getElementById("last-updated");if(e)try{let r=new Date(t);e.textContent=`Official UK Food Data \u2022 Last Updated: ${r.toUTCString()}`}catch{e.textContent="Official UK Food Data"}}var u=$(()=>{"use strict"});var I={};b(I,{ENTITIES:()=>A,ENTITIES_BY_HUB:()=>U});var A,U,E=$(()=>{"use strict";A=[{id:"eggs",title:"Eggs",hub:"price-pressure"}],U=A.reduce((t,e)=>(t[e.hub]||(t[e.hub]=[]),t[e.hub].push(e),t),{})});var p=null;async function P(){try{let t=await fetch(`/data/_meta.json?t=${Date.now()}`);if(!t.ok)return null;let e=await t.json();return e?.lastUpdated&&(p=new Date(e.lastUpdated).getTime().toString()),e}catch{return null}}async function D(){try{let t=p?`?v=${p}`:`?t=${Date.now()}`,e=await fetch(`/data/_registry.json${t}`);return e.ok?await e.json():null}catch{return null}}async function l(t){try{let e=p?`?v=${p}`:`?t=${Date.now()}`,r=await fetch(`/data/${t}.json${e}`);return r.ok?await r.json():null}catch{return null}}u();u();async function k(){let[t,e]=await Promise.all([l("uk.food-inflation"),l("uk.food-alerts")]),r=t?.signal,i=r?.food_inflation_yoy_percent?`${r.food_inflation_yoy_percent}%`:"--",a=t?.status||"unknown",n=Array.isArray(e?.items)?e.items.length:0,c=n>0?"Alerts Active":"No Critical Alerts",d=`
    <div class="signal-grid">
        <!-- Card 1: Price Pressure -->
        <a href="/price-pressure" class="card border-left-info">
            <h3>Price Pressure</h3>
            <div class="signal-value">High</div>
            <div class="meta">Tracking core commodities</div>
            <div class="action-link">View Analysis &rarr;</div>
        </a>

        <!-- Card 2: Inflation -->
        <a href="/inflation-trends" class="card ${C(a)}">
            <h3>UK Food Inflation</h3>
            <div class="signal-value ${_(a)}">${i}</div>
            <div class="meta">Official ONS Data</div>
            <div class="action-link">View Trends &rarr;</div>
        </a>

        <!-- Card 3: Alerts -->
        <a href="/alerts" class="card ${n>0?"border-left-bad":"border-left-good"}">
            <h3>Safety Alerts</h3>
            <div class="signal-value">${n} Active</div>
            <div class="meta">Recalls & Allergy Warnings</div>
            <div class="action-link">View Alerts &rarr;</div>
        </a>
    </div>
    `;return o("Dashboard",d,!1)}function C(t){return t==="rising"||t==="alert"?"border-left-bad":t==="easing"||t==="safe"?"border-left-good":"border-left-warn"}function _(t){return t==="rising"?"trend-up":t==="easing"?"trend-down":"trend-flat"}u();async function h(t){if(t){let e="";if(t==="eggs"&&(e="uk.eggs.pressure"),!e)return o("Not Found","<p>Signal not found.</p>");let r=await l(e);if(!r)return o("Not Found","<p>Data unavailable.</p>");let i=r.signal,a=r.status==="rising"?"High / Rising":"Stable",n=`
            <div class="card">
                <h2>${r.title}</h2>
                <div class="signal-value ${r.status==="rising"?"trend-up":"trend-flat"}">${a}</div>
                <p><strong>YoY Increase:</strong> ${i?.yoy_percent||"--"}%</p>
                <p><strong>Current Price:</strong> \xA3${i?.price||"--"} (${i?.unit||""})</p>
                <div class="meta">Source: ${r.source.name}</div>
            </div>
            
            <div style="margin-top:20px;">
                <h3>Analysis</h3>
                <p>Evidence suggests prices are ${r.status} due to market conditions.</p>
            </div>
        `;return o(r.title,n)}else{let i=[await l("uk.eggs.pressure")].filter(Boolean).map(a=>`
            <a href="/price-pressure/eggs/" class="card" style="text-decoration:none; color:inherit; display:block;">
                <h3>${a.title}</h3>
                <div class="signal-value ${a.status==="rising"?"trend-up":"trend-flat"}">${a.status.toUpperCase()}</div>
                <div class="meta">Updated: ${new Date(a.last_checked_utc).toLocaleDateString()}</div>
            </a>
        `).join("");return o("Price Pressure Hub",`
            <div class="signal-grid">
                ${i}
            </div>
        `)}}u();async function x(){let[t,e]=await Promise.all([l("uk.food-inflation"),l("uk.inflation.notices")]),r=t?.signal,i=r?.food_inflation_yoy_percent,a=i?`${i}%`:"--",n=t?.status||"unknown",c=r?.period||"Unknown",d=`
            <div class="card">
                <h3>UK Food Inflation (YoY)</h3>
                <div class="signal-value ${L(n)}">${a}</div>
                <div class="meta">Reference Period: ${c}</div>
            </div>
            <!-- Placeholder for MoM or other macro metrics -->
             <div class="card card-placeholder">
                <h3>Month-on-Month</h3>
                <div class="signal-value">--</div>
                <div class="meta">Coming Soon</div>
            </div>
    `,s="";e&&Array.isArray(e.items)?s=e.items.map(f=>`
            <a href="${f.url}" target="_blank" class="card">
                <h3>${f.title}</h3>
                <div class="meta">${O(f.date)} \u2022 ${f.source_name}</div>
                <p class="meta-summary">${f.summary||""}</p>
                <div class="action-link">View Notice &nearr;</div>
            </a>
        `).join(""):s='<div class="card"><p>No recent notices available.</p></div>';let w=`
        <h2>Inflation Metrics</h2>
        <div class="signal-grid section-spacer">
            ${d}
        </div>

        <h2>Inflation Notices</h2>
        <p class="meta" style="margin-bottom:20px;">Official updates from ONS, DEFRA, and GOV.UK</p>
        <div class="signal-grid">
            ${s}
        </div>
        
        <div class="section-top">
            <h3>Source Data</h3>
            <p>Derived from <a href="https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7c8/mm23/data">Office for National Statistics</a> (CPI).</p>
        </div>
    `;return o("Inflation Trends",w)}function L(t){return t==="rising"?"trend-up":t==="easing"?"trend-down":"trend-flat"}function O(t){try{return new Date(t).toLocaleDateString()}catch{return t}}u();async function v(t){let r=(await l("uk.food-alerts"))?.items||[],i=t||"all",a=i==="all"?r:r.filter(s=>s.problem?.type===i),n=`
        <div class="hub-nav">
            <a href="/alerts-recalls/" class="${i==="all"?"active":""}">All</a> |
            <a href="/alerts-recalls/allergy/" class="${i==="allergy"?"active":""}">Allergy</a> |
            <a href="/alerts-recalls/recall/" class="${i==="recall"?"active":""}">Recalls</a>
        </div>
    `,c=a.length>0?a.map(s=>`
        <div class="card">
             <div class="meta">${new Date(s.created).toLocaleDateString()}</div>
             <h3>${s.title}</h3>
             <p>${s.shortTitle||s.title}</p>
             <div class="confidence-pill">${s.problem?.type||"Alert"}</div>
        </div>
    `).join(""):"<p>No alerts found for this category.</p>",d=`
        ${n}
        <h2>${i.charAt(0).toUpperCase()+i.slice(1)} Alerts</h2>
        <div class="signal-grid">
            ${c}
        </div>
    `;return o("Alerts & Recalls",d)}async function g(){let{renderLayout:t}=await Promise.resolve().then(()=>(u(),S));return t("404 Not Found",`
        <div class="container" style="text-align: center; padding: 50px 0;">
            <h1>404</h1>
            <p>Page not found</p>
            <a href="/" class="back-link">Return Home</a>
        </div>
    `)}async function y(){let t=window.location.pathname,e=document.getElementById("app");if(!e)return;let i=(t.endsWith("/")?t:t+"/").split("/").filter(n=>n.length>0),a="";try{if(i.length===0)a=await k();else if(i.length===1){let n=i[0];n==="price-pressure"?a=await h():n==="inflation-trends"?a=await x():n==="alerts-recalls"?a=await v():a=await g()}else if(i.length===2){let[n,c]=i,{ENTITIES_BY_HUB:d}=await Promise.resolve().then(()=>(E(),I));(d[n]||[]).some(f=>f.id===c)?n==="price-pressure"?a=await h(c):n==="alerts-recalls"?a=await v(c):a=await g():a=await g()}else a=await g();e.innerHTML=a,window.scrollTo(0,0)}catch(n){console.error("Render error:",n),e.innerHTML='<div class="container error"><h2>Error loading page</h2><p>Please refresh.</p></div>'}}window.addEventListener("popstate",y);document.addEventListener("DOMContentLoaded",async()=>{try{let[t,e]=await Promise.all([P(),D()]);t&&t.lastUpdated&&m(t.lastUpdated),e&&console.log("Registry loaded",e.length,"items")}catch(t){console.error("Init error (non-fatal):",t)}document.body.addEventListener("click",t=>{let e=t.target.closest("a");if(e&&e.getAttribute("href")?.startsWith("/")&&!e.getAttribute("target")){t.preventDefault();let r=e.getAttribute("href");history.pushState(null,"",r),y()}}),y()});})();
//# sourceMappingURL=app.js.map
