"use strict";(()=>{var A=Object.defineProperty;var $=(t,e)=>()=>(t&&(e=t(t=0)),e);var b=(t,e)=>{for(var n in e)A(t,n,{get:e[n],enumerable:!0})};var D={};b(D,{renderLayout:()=>o,updateMetaDate:()=>h});function o(t,e,n=!0){return`
    <div class="container">
        <header style="margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <h1 style="margin:0;"><a href="/" style="text-decoration:none; color:inherit;">MySupermarket Signals</a></h1>
            <div class="meta" id="last-updated">Updating status...</div>
        </header>
        <main>
            ${n?'<div style="margin-bottom: 20px;"><a href="/" class="back-link">\u2190 Dashboard</a></div>':""}
            ${e}
        </main>
        <footer class="disclaimer" style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px;">
            <p><strong>Official Signals Only.</strong> Not a retail price comparison site.</p>
            <p>Data sources: Office for National Statistics (ONS), Food Standards Agency (FSA), DEFRA.</p>
        </footer>
    </div>
    `}function h(t){let e=document.getElementById("last-updated");if(e)try{let n=new Date(t);e.textContent=`Official UK Food Data \u2022 Last Updated: ${n.toUTCString()}`}catch{e.textContent="Official UK Food Data"}}var p=$(()=>{"use strict"});var U={};b(U,{ENTITIES:()=>_,ENTITIES_BY_HUB:()=>H});var _,H,I=$(()=>{"use strict";_=[{id:"eggs",title:"Eggs",hub:"price-pressure"}],H=_.reduce((t,e)=>(t[e.hub]||(t[e.hub]=[]),t[e.hub].push(e),t),{})});var g=null;async function S(){try{let t=await fetch(`/data/_meta.json?t=${Date.now()}`);if(!t.ok)return null;let e=await t.json();return e?.lastUpdated&&(g=new Date(e.lastUpdated).getTime().toString()),e}catch{return null}}async function k(){try{let t=g?`?v=${g}`:`?t=${Date.now()}`,e=await fetch(`/data/_registry.json${t}`);return e.ok?await e.json():null}catch{return null}}async function l(t){try{let e=g?`?v=${g}`:`?t=${Date.now()}`,n=await fetch(`/data/${t}.json${e}`);return n.ok?await n.json():null}catch{return null}}p();p();async function P(){let[t,e]=await Promise.all([l("uk.food-inflation"),l("alerts")]),n=t?.signal,s=n?.food_inflation_yoy_percent?`${n.food_inflation_yoy_percent}%`:"--",i=t?.status||"unknown",r=Array.isArray(e?.items)?e.items.length:0,a=r>0?"Alerts Active":"No Critical Alerts",c=`
    <div class="signal-grid">
        <!-- Card 1: Price Pressure -->
        <a href="/price-pressure" class="card border-left-info">
            <h3>Price Pressure</h3>
            <div class="signal-value">High</div>
            <div class="meta">Tracking core commodities</div>
            <div class="action-link">View Analysis &rarr;</div>
        </a>

        <!-- Card 2: Inflation -->
        <a href="/inflation-trends" class="card ${E(i)}">
            <h3>UK Food Inflation</h3>
            <div class="signal-value ${N(i)}">${s}</div>
            <div class="meta">Official ONS Data</div>
            <div class="action-link">View Trends &rarr;</div>
        </a>

        <!-- Card 3: Alerts -->
        <a href="/alerts" class="card ${r>0?"border-left-bad":"border-left-good"}">
            <h3>Safety Alerts</h3>
            <div class="signal-value" style="font-size: 1.5rem;">${r} Notices</div>
            <div class="meta">Recalls & Allergy Warnings</div>
            <div class="action-link">Latest Updates &rarr;</div>
        </a>
    </div>
    `;return o("Dashboard",c,!1)}function E(t){return t==="rising"||t==="alert"?"border-left-bad":t==="easing"||t==="safe"?"border-left-good":"border-left-warn"}function N(t){return t==="rising"?"trend-up":t==="easing"?"trend-down":"trend-flat"}p();function L(t){if(!t)return"Unknown";let e=new Date(t);return isNaN(e.getTime())?"Unknown":e.toISOString().slice(0,10)}async function v(t){if(t){let e="";if(t==="eggs"&&(e="uk.eggs.pressure"),!e)return o("Not Found","<p>Signal not found.</p>");let n=await l(e);if(!n)return o("Not Found","<p>Data unavailable.</p>");let s=n.signal,r=n.status==="rising"?"High / Rising":"Stable",a=n.source_url,d=a&&(a.startsWith("http://")||a.startsWith("https://"))?`<a href="${a}" target="_blank" rel="noopener noreferrer">${a}</a>`:a||"Unknown",f=`
            <div class="card">
                <h2>${n.title}</h2>
                <div class="signal-value ${n.status==="rising"?"trend-up":"trend-flat"}">${r}</div>
                <p><strong>YoY Increase:</strong> ${s?.yoy_percent||"--"}%</p>
                <p><strong>Current Price:</strong> \xA3${s?.price||"--"} (${s?.unit||""})</p>
                <div class="meta">Source: ${d}</div>
            </div>
            
            <div style="margin-top:20px;">
                <h3>Analysis</h3>
                <p>Evidence suggests prices are ${n.status} due to market conditions.</p>
            </div>
        `;return o(n.title,f)}else{let s=[await l("uk.eggs.pressure")].filter(Boolean).map(i=>{let r=L(i.last_official_update||i.fetched_at_utc),a=i.status;return`
                <a href="/price-pressure/eggs/" class="card" style="text-decoration:none; color:inherit; display:block;">
                    <h3>${i.title}</h3>
                    <div class="signal-value ${a==="rising"?"trend-up":"trend-flat"}">${a.toUpperCase()}</div>
                    <div class="meta">Updated: ${r}</div>
                </a>
            `}).join("");return o("Price Pressure Hub",`
            <div class="signal-grid">
                ${s}
            </div>
        `)}}p();async function x(){let[t,e]=await Promise.all([l("uk.food-inflation"),l("uk.inflation.notices")]),n=t?.signal,s=n?.food_inflation_yoy_percent,i=s?`${s}%`:"--",r=t?.status||"unknown",a=n?.period||"Unknown",c=`
            <div class="card">
                <h3>UK Food Inflation (YoY)</h3>
                <div class="signal-value ${O(r)}">${i}</div>
                <div class="meta">Reference Period: ${a}</div>
            </div>
            <!-- Placeholder for MoM or other macro metrics -->
             <div class="card card-placeholder">
                <h3>Month-on-Month</h3>
                <div class="signal-value">--</div>
                <div class="meta">Coming Soon</div>
            </div>
    `,d="";e&&Array.isArray(e.items)?d=e.items.map(u=>`
            <a href="${u.url}" target="_blank" class="card">
                <h3>${u.title}</h3>
                <div class="meta">${C(u.date)} \u2022 ${u.source_name}</div>
                <p class="meta-summary">${u.summary||""}</p>
                <div class="action-link">View Notice &nearr;</div>
            </a>
        `).join(""):d='<div class="card"><p>No recent notices available.</p></div>';let f=`
        <h2>Inflation Metrics</h2>
        <div class="signal-grid section-spacer">
            ${c}
        </div>

        <h2>Inflation Notices</h2>
        <p class="meta" style="margin-bottom:20px;">Official updates from ONS, DEFRA, and GOV.UK</p>
        <div class="signal-grid">
            ${d}
        </div>
        
        <div class="section-top">
            <h3>Source Data</h3>
            <p>Derived from <a href="https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7c8/mm23/data">Office for National Statistics</a> (CPI).</p>
        </div>
    `;return o("Inflation Trends",f)}function O(t){return t==="rising"?"trend-up":t==="easing"?"trend-down":"trend-flat"}function C(t){try{return new Date(t).toLocaleDateString()}catch{return t}}p();async function y(t){let e=await l("alerts"),n=e?.items||[],s=e?.last_official_update?new Date(e.last_official_update).toLocaleDateString():"Unknown",i=n.length>0?n.map(a=>{let c=a.modified||a.created,d=c?new Date(c).toLocaleDateString():"Unknown",f=a.alert_url&&a.alert_url.startsWith("http")?`<a href="${a.alert_url}" target="_blank" rel="noopener noreferrer">View on FSA &rarr;</a>`:"";return`
        <div class="card" style="border-left: 4px solid #dda720;">
             <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span class="meta">${d}</span>
                <span class="confidence-pill" style="background:#eee; color:#333;">${a.type}</span>
             </div>
             <h3 style="margin: 0 0 10px 0;">${a.title}</h3>
             ${f?`<div style="margin-top:10px; font-size:0.9em;">${f}</div>`:""}
        </div>
        `}).join(""):"<p>No active notices found.</p>",r=`
        <div style="margin-bottom:30px;">
            <h2>Safety Alerts</h2>
            <p class="meta">Official recalls & allergy warnings from the UK Food Standards Agency (FSA).</p>
            <p class="meta">Last Official Update: ${s}</p>
        </div>
        <div class="signal-grid" style="grid-template-columns: 1fr;"> 
            ${i}
        </div>
    `;return o("Safety Alerts",r)}async function m(){let{renderLayout:t}=await Promise.resolve().then(()=>(p(),D));return t("404 Not Found",`
        <div class="container" style="text-align: center; padding: 50px 0;">
            <h1>404</h1>
            <p>Page not found</p>
            <a href="/" class="back-link">Return Home</a>
        </div>
    `)}async function w(){let t=window.location.pathname,e=document.getElementById("app");if(!e)return;let s=(t.endsWith("/")?t:t+"/").split("/").filter(r=>r.length>0),i="";try{if(s.length===0)i=await P();else if(s.length===1){let r=s[0];r==="price-pressure"?i=await v():r==="inflation-trends"||(r==="inflation-trends"?i=await x():r==="alerts"?i=await y():i=await m())}else if(s.length===2){let[r,a]=s,{ENTITIES_BY_HUB:c}=await Promise.resolve().then(()=>(I(),U));(c[r]||[]).some(u=>u.id===a)?r==="price-pressure"||(r==="price-pressure"?i=await v(a):r==="alerts"?i=await y(a):i=await m()):i=await m()}else i=await m();e.innerHTML=i,window.scrollTo(0,0)}catch(r){console.error("Render error:",r),e.innerHTML='<div class="container error"><h2>Error loading page</h2><p>Please refresh.</p></div>'}}window.addEventListener("popstate",w);document.addEventListener("DOMContentLoaded",async()=>{try{let[t,e]=await Promise.all([S(),k()]);t&&t.lastUpdated&&h(t.lastUpdated),e&&console.log("Registry loaded",e.length,"items")}catch(t){console.error("Init error (non-fatal):",t)}document.body.addEventListener("click",t=>{let e=t.target.closest("a");if(e&&e.getAttribute("href")?.startsWith("/")&&!e.getAttribute("target")){t.preventDefault();let n=e.getAttribute("href");history.pushState(null,"",n),w()}}),w()});})();
//# sourceMappingURL=app.js.map
