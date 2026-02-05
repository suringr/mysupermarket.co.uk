"use strict";(()=>{var N=Object.defineProperty;var $=(t,e)=>()=>(t&&(e=t(t=0)),e);var b=(t,e)=>{for(var r in e)N(t,r,{get:e[r],enumerable:!0})};var S={};b(S,{renderLayout:()=>l,updateMetaDate:()=>h});function l(t,e,r=!0){return`
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
    `}function h(t){let e=document.getElementById("last-updated");if(e)try{let r=new Date(t);e.textContent=`Official UK Food Data \u2022 Last Updated: ${r.toUTCString()}`}catch{e.textContent="Official UK Food Data"}}var u=$(()=>{"use strict"});var I={};b(I,{ENTITIES:()=>A,ENTITIES_BY_HUB:()=>T});var A,T,E=$(()=>{"use strict";A=[{id:"eggs",title:"Eggs",hub:"price-pressure"}],T=A.reduce((t,e)=>(t[e.hub]||(t[e.hub]=[]),t[e.hub].push(e),t),{})});var p=null;async function k(){try{let t=await fetch(`/data/_meta.json?t=${Date.now()}`);if(!t.ok)return null;let e=await t.json();return e?.lastUpdated&&(p=new Date(e.lastUpdated).getTime().toString()),e}catch{return null}}async function P(){try{let t=p?`?v=${p}`:`?t=${Date.now()}`,e=await fetch(`/data/_registry.json${t}`);return e.ok?await e.json():null}catch{return null}}async function c(t){try{let e=p?`?v=${p}`:`?t=${Date.now()}`,r=await fetch(`/data/${t}.json${e}`);return r.ok?await r.json():null}catch{return null}}u();u();async function D(){let[t,e]=await Promise.all([c("uk.food-inflation"),c("uk.food-alerts")]),r=t?.signal,n=r?.food_inflation_yoy_percent?`${r.food_inflation_yoy_percent}%`:"--",a=t?.status||"unknown",i=Array.isArray(e?.items)?e.items.length:0,s=i>0?"Alerts Active":"No Critical Alerts",d=`
    <div class="signal-grid">
        <!-- Card 1: Price Pressure -->
        <a href="/price-pressure" class="card border-left-info">
            <h3>Price Pressure</h3>
            <div class="signal-value">High</div>
            <div class="meta">Tracking core commodities</div>
            <div class="action-link">View Analysis &rarr;</div>
        </a>

        <!-- Card 2: Inflation -->
        <a href="/inflation-trends" class="card ${_(a)}">
            <h3>UK Food Inflation</h3>
            <div class="signal-value ${U(a)}">${n}</div>
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
    `;return l("Dashboard",d,!1)}function _(t){return t==="rising"||t==="alert"?"border-left-bad":t==="easing"||t==="safe"?"border-left-good":"border-left-warn"}function U(t){return t==="rising"?"trend-up":t==="easing"?"trend-down":"trend-flat"}u();function C(t){if(!t)return"Unknown";let e=new Date(t);return isNaN(e.getTime())?"Unknown":e.toISOString().slice(0,10)}async function v(t){if(t){let e="";if(t==="eggs"&&(e="uk.eggs.pressure"),!e)return l("Not Found","<p>Signal not found.</p>");let r=await c(e);if(!r)return l("Not Found","<p>Data unavailable.</p>");let n=r.signal,i=r.status==="rising"?"High / Rising":"Stable",s=r.source_url,o=s&&(s.startsWith("http://")||s.startsWith("https://"))?`<a href="${s}" target="_blank" rel="noopener noreferrer">${s}</a>`:s||"Unknown",g=`
            <div class="card">
                <h2>${r.title}</h2>
                <div class="signal-value ${r.status==="rising"?"trend-up":"trend-flat"}">${i}</div>
                <p><strong>YoY Increase:</strong> ${n?.yoy_percent||"--"}%</p>
                <p><strong>Current Price:</strong> \xA3${n?.price||"--"} (${n?.unit||""})</p>
                <div class="meta">Source: ${o}</div>
            </div>
            
            <div style="margin-top:20px;">
                <h3>Analysis</h3>
                <p>Evidence suggests prices are ${r.status} due to market conditions.</p>
            </div>
        `;return l(r.title,g)}else{let n=[await c("uk.eggs.pressure")].filter(Boolean).map(a=>{let i=C(a.last_official_update||a.fetched_at_utc),s=a.status;return`
                <a href="/price-pressure/eggs/" class="card" style="text-decoration:none; color:inherit; display:block;">
                    <h3>${a.title}</h3>
                    <div class="signal-value ${s==="rising"?"trend-up":"trend-flat"}">${s.toUpperCase()}</div>
                    <div class="meta">Updated: ${i}</div>
                </a>
            `}).join("");return l("Price Pressure Hub",`
            <div class="signal-grid">
                ${n}
            </div>
        `)}}u();async function x(){let[t,e]=await Promise.all([c("uk.food-inflation"),c("uk.inflation.notices")]),r=t?.signal,n=r?.food_inflation_yoy_percent,a=n?`${n}%`:"--",i=t?.status||"unknown",s=r?.period||"Unknown",d=`
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
    `,o="";e&&Array.isArray(e.items)?o=e.items.map(f=>`
            <a href="${f.url}" target="_blank" class="card">
                <h3>${f.title}</h3>
                <div class="meta">${O(f.date)} \u2022 ${f.source_name}</div>
                <p class="meta-summary">${f.summary||""}</p>
                <div class="action-link">View Notice &nearr;</div>
            </a>
        `).join(""):o='<div class="card"><p>No recent notices available.</p></div>';let g=`
        <h2>Inflation Metrics</h2>
        <div class="signal-grid section-spacer">
            ${d}
        </div>

        <h2>Inflation Notices</h2>
        <p class="meta" style="margin-bottom:20px;">Official updates from ONS, DEFRA, and GOV.UK</p>
        <div class="signal-grid">
            ${o}
        </div>
        
        <div class="section-top">
            <h3>Source Data</h3>
            <p>Derived from <a href="https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7c8/mm23/data">Office for National Statistics</a> (CPI).</p>
        </div>
    `;return l("Inflation Trends",g)}function L(t){return t==="rising"?"trend-up":t==="easing"?"trend-down":"trend-flat"}function O(t){try{return new Date(t).toLocaleDateString()}catch{return t}}u();async function y(t){let r=(await c("uk.food-alerts"))?.items||[],n=t||"all",a=n==="all"?r:r.filter(o=>o.problem?.type===n),i=`
        <div class="hub-nav">
            <a href="/alerts-recalls/" class="${n==="all"?"active":""}">All</a> |
            <a href="/alerts-recalls/allergy/" class="${n==="allergy"?"active":""}">Allergy</a> |
            <a href="/alerts-recalls/recall/" class="${n==="recall"?"active":""}">Recalls</a>
        </div>
    `,s=a.length>0?a.map(o=>`
        <div class="card">
             <div class="meta">${new Date(o.created).toLocaleDateString()}</div>
             <h3>${o.title}</h3>
             <p>${o.shortTitle||o.title}</p>
             <div class="confidence-pill">${o.problem?.type||"Alert"}</div>
        </div>
    `).join(""):"<p>No alerts found for this category.</p>",d=`
        ${i}
        <h2>${n.charAt(0).toUpperCase()+n.slice(1)} Alerts</h2>
        <div class="signal-grid">
            ${s}
        </div>
    `;return l("Alerts & Recalls",d)}async function m(){let{renderLayout:t}=await Promise.resolve().then(()=>(u(),S));return t("404 Not Found",`
        <div class="container" style="text-align: center; padding: 50px 0;">
            <h1>404</h1>
            <p>Page not found</p>
            <a href="/" class="back-link">Return Home</a>
        </div>
    `)}async function w(){let t=window.location.pathname,e=document.getElementById("app");if(!e)return;let n=(t.endsWith("/")?t:t+"/").split("/").filter(i=>i.length>0),a="";try{if(n.length===0)a=await D();else if(n.length===1){let i=n[0];i==="price-pressure"?a=await v():i==="inflation-trends"?a=await x():i==="alerts-recalls"?a=await y():a=await m()}else if(n.length===2){let[i,s]=n,{ENTITIES_BY_HUB:d}=await Promise.resolve().then(()=>(E(),I));(d[i]||[]).some(f=>f.id===s)?i==="price-pressure"?a=await v(s):i==="alerts-recalls"?a=await y(s):a=await m():a=await m()}else a=await m();e.innerHTML=a,window.scrollTo(0,0)}catch(i){console.error("Render error:",i),e.innerHTML='<div class="container error"><h2>Error loading page</h2><p>Please refresh.</p></div>'}}window.addEventListener("popstate",w);document.addEventListener("DOMContentLoaded",async()=>{try{let[t,e]=await Promise.all([k(),P()]);t&&t.lastUpdated&&h(t.lastUpdated),e&&console.log("Registry loaded",e.length,"items")}catch(t){console.error("Init error (non-fatal):",t)}document.body.addEventListener("click",t=>{let e=t.target.closest("a");if(e&&e.getAttribute("href")?.startsWith("/")&&!e.getAttribute("target")){t.preventDefault();let r=e.getAttribute("href");history.pushState(null,"",r),w()}}),w()});})();
//# sourceMappingURL=app.js.map
