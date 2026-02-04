"use strict";(()=>{var b=Object.defineProperty;var P=(t,e)=>()=>(t&&(e=t(t=0)),e);var D=(t,e)=>{for(var r in e)b(t,r,{get:e[r],enumerable:!0})};var h={};D(h,{renderLayout:()=>s,updateMetaDate:()=>g});function s(t,e,r=!0){return`
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
    `}function g(t){let e=document.getElementById("last-updated");if(e)try{let r=new Date(t);e.textContent=`Official UK Food Data \u2022 Last Updated: ${r.toUTCString()}`}catch{e.textContent="Official UK Food Data"}}var f=P(()=>{"use strict"});var u=null;async function v(){try{let t=await fetch(`/data/_meta.json?t=${Date.now()}`);if(!t.ok)return null;let e=await t.json();return e?.lastUpdated&&(u=new Date(e.lastUpdated).getTime().toString()),e}catch{return null}}async function c(t){try{let e=u?`?v=${u}`:`?t=${Date.now()}`,r=await fetch(`/data/${t}.json${e}`);return r.ok?await r.json():null}catch{return null}}f();f();async function y(){let[t,e]=await Promise.all([c("uk.food-inflation"),c("uk.food-alerts")]),r=t?.signal?.food_inflation_yoy_percent?`${t.signal.food_inflation_yoy_percent}%`:"--",i=t?.status||"unknown",a=Array.isArray(e?.items)?e.items.length:0,l=a>0?"Alerts Active":"No Critical Alerts",n=`
    <div class="signal-grid">
        <!-- Card 1: Price Pressure -->
        <a href="/price-pressure" class="card" style="text-decoration:none; color:inherit; display:block; border-left: 5px solid #2196f3;">
            <h3>Price Pressure</h3>
            <div class="signal-value">High</div>
            <div class="meta">Tracking core commodities</div>
            <div style="margin-top:10px; color:#2196f3; font-weight:bold; font-size:0.9rem;">View Analysis &rarr;</div>
        </a>

        <!-- Card 2: Inflation -->
        <a href="/inflation-trends" class="card" style="text-decoration:none; color:inherit; display:block; border-left: 5px solid ${k(i)};">
            <h3>UK Food Inflation</h3>
            <div class="signal-value ${A(i)}">${r}</div>
            <div class="meta">Official ONS Data</div>
            <div style="margin-top:10px; color:#2196f3; font-weight:bold; font-size:0.9rem;">View Trends &rarr;</div>
        </a>

        <!-- Card 3: Alerts -->
        <a href="/alerts" class="card" style="text-decoration:none; color:inherit; display:block; border-left: 5px solid ${a>0?"#d32f2f":"#388e3c"};">
            <h3>Safety Alerts</h3>
            <div class="signal-value">${a} Active</div>
            <div class="meta">Recalls & Allergy Warnings</div>
            <div style="margin-top:10px; color:#2196f3; font-weight:bold; font-size:0.9rem;">View Alerts &rarr;</div>
        </a>
    </div>
    `;return s("Dashboard",n,!1)}function k(t){return t==="rising"||t==="alert"?"#d32f2f":t==="easing"||t==="safe"?"#388e3c":"#f57c00"}function A(t){return t==="rising"?"trend-up":t==="easing"?"trend-down":"trend-flat"}f();async function $(t){let r=t.split("/").filter(Boolean)[1];if(r){let i="";if(r.includes("egg")&&(i="uk.eggs.pressure"),!i)return s("Not Found","<p>Signal not found.</p>");let a=await c(i);if(!a)return s("Not Found","<p>Data unavailable.</p>");let l=a.signal,n=a.status==="rising"?"High / Rising":"Stable",d=`
            <div class="card">
                <h2>${a.title}</h2>
                <div class="signal-value ${a.status==="rising"?"trend-up":"trend-flat"}">${n}</div>
                <p><strong>YoY Increase:</strong> ${l?.yoy_percent||"--"}%</p>
                <p><strong>Current Price:</strong> \xA3${l?.price||"--"} (${l?.unit||""})</p>
                <div class="meta">Source: ${a.source.name}</div>
            </div>
            
            <div style="margin-top:20px;">
                <h3>Analysis</h3>
                <p>Evidence suggests prices are ${a.status} due to market conditions.</p>
            </div>
        `;return s(a.title,d)}else{let l=[await c("uk.eggs.pressure")].filter(Boolean).map(n=>`
            <a href="/price-pressure/${n.title.toLowerCase().replace(/\s+/g,"-")}" class="card" style="text-decoration:none; color:inherit; display:block;">
                <h3>${n.title}</h3>
                <div class="signal-value ${n.status==="rising"?"trend-up":"trend-flat"}">${n.status.toUpperCase()}</div>
                <div class="meta">Updated: ${new Date(n.last_checked_utc).toLocaleDateString()}</div>
            </a>
        `).join("");return s("Price Pressure Hub",`
            <div class="signal-grid">
                ${l}
            </div>
        `)}}f();async function w(){let[t,e]=await Promise.all([c("uk.food-inflation"),c("uk.inflation.notices")]),r=t?.signal?.food_inflation_yoy_percent,i=r?`${r}%`:"--",a=t?.status||"unknown",l=t?.signal?.period||"Unknown",n=`
            <div class="card">
                <h3>UK Food Inflation (YoY)</h3>
                <div class="signal-value ${S(a)}">${i}</div>
                <div class="meta">Reference Period: ${l}</div>
            </div>
            <!-- Placeholder for MoM or other macro metrics -->
             <div class="card" style="opacity:0.6;">
                <h3>Month-on-Month</h3>
                <div class="signal-value">--</div>
                <div class="meta">Coming Soon</div>
            </div>
    `,d="";e&&Array.isArray(e.items)?d=e.items.map(o=>`
            <a href="${o.url}" target="_blank" class="card" style="text-decoration:none; color:inherit; display:block;">
                <h3>${o.title}</h3>
                <div class="meta">${L(o.date)} \u2022 ${o.source_name}</div>
                <p style="margin-top:10px; font-size:0.9rem;">${o.summary||""}</p>
                <div style="margin-top:10px; color:#2196f3; font-weight:bold; font-size:0.9rem;">View Notice &nearr;</div>
            </a>
        `).join(""):d='<div class="card"><p>No recent notices available.</p></div>';let p=`
        <h2>Inflation Metrics</h2>
        <div class="signal-grid" style="margin-top:20px; margin-bottom: 50px;">
            ${n}
        </div>

        <h2>Inflation Notices</h2>
        <p class="meta" style="margin-bottom:20px;">Official updates from ONS, DEFRA, and GOV.UK</p>
        <div class="signal-grid">
            ${d}
        </div>
        
        <div style="margin-top:40px;">
            <h3>Source Data</h3>
            <p>Derived from <a href="https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7c8/mm23/data">Office for National Statistics</a> (CPI).</p>
        </div>
    `;return s("Inflation Trends",p)}function S(t){return t==="rising"?"trend-up":t==="easing"?"trend-down":"trend-flat"}function L(t){try{return new Date(t).toLocaleDateString()}catch{return t}}f();async function x(t){let r=(await c("uk.food-alerts"))?.items||[],a=t.split("/").filter(Boolean)[1]||"all",l=a==="all"?r:r.filter(o=>o.problem?.type===a),n=`
        <div class="hub-nav">
            <a href="/alerts" class="${a==="all"?"active":""}">All</a> |
            <a href="/alerts/allergy" class="${a==="allergy"?"active":""}">Allergy</a> |
            <a href="/alerts/recall" class="${a==="recall"?"active":""}">Recalls</a>
        </div>
    `,d=l.length>0?l.map(o=>`
        <div class="card">
             <div class="meta">${new Date(o.created).toLocaleDateString()}</div>
             <h3>${o.title}</h3>
             <p>${o.shortTitle||o.title}</p>
             <div class="confidence-pill" style="display:inline-block; margin-top:10px;">${o.problem?.type||"Alert"}</div>
        </div>
    `).join(""):"<p>No alerts found for this category.</p>",p=`
        ${n}
        <h2>${a.charAt(0).toUpperCase()+a.slice(1)} Alerts</h2>
        <div class="signal-grid">
            ${d}
        </div>
    `;return s("Alerts & Recalls",p)}async function N(){let{renderLayout:t}=await Promise.resolve().then(()=>(f(),h));return t("404 Not Found","<h2>Not Found</h2><p>Page not found.</p>")}async function m(){let t=window.location.pathname,e=document.getElementById("app");if(!e)return;let r="";try{t==="/"||t==="/index.html"?r=await y():t.startsWith("/price-pressure")?r=await $(t):t.startsWith("/inflation-trends")?r=await w():t.startsWith("/alerts")?r=await x(t):r=await N(),e.innerHTML=r}catch(i){console.error("Render error:",i),e.innerHTML='<div style="color:red; padding:20px;">Error loading page. Please refresh.</div>'}}window.addEventListener("popstate",m);document.addEventListener("DOMContentLoaded",async()=>{try{let t=await v();t&&t.lastUpdated&&g(t.lastUpdated)}catch(t){console.error("Init error:",t)}document.body.addEventListener("click",t=>{let e=t.target.closest("a");e&&e.getAttribute("href")?.startsWith("/")&&!e.getAttribute("target")&&(t.preventDefault(),history.pushState(null,"",e.getAttribute("href")),m())}),m()});})();
//# sourceMappingURL=app.js.map
