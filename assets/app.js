"use strict";(()=>{var F=Object.defineProperty;var D=(t,e)=>()=>(t&&(e=t(t=0)),e);var _=(t,e)=>{for(var a in e)F(t,a,{get:e[a],enumerable:!0})};var A={};_(A,{renderLayout:()=>l,updateMetaDate:()=>$});function l(t,e,a=!0){return`
    <div class="container">
        <header style="margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px;">
            <h1 style="margin:0;"><a href="/" style="text-decoration:none; color:inherit;">MySupermarket Signals</a></h1>
            <div class="meta" id="last-updated">Updating status...</div>
        </header>
        <main>
            ${a?'<div style="margin-bottom: 20px;"><a href="/" class="back-link">\u2190 Dashboard</a></div>':""}
            ${e}
        </main>
        <footer class="disclaimer" style="margin-top: 50px; border-top: 1px solid #eee; padding-top: 20px;">
            <p><strong>Official Signals Only.</strong> Not a retail price comparison site.</p>
            <p>Data sources: Office for National Statistics (ONS), Food Standards Agency (FSA), DEFRA.</p>
        </footer>
    </div>
    `}function $(t){let e=document.getElementById("last-updated");if(e)try{let a=new Date(t);e.textContent=`Official UK Food Data \u2022 Last Updated: ${a.toUTCString()}`}catch{e.textContent="Official UK Food Data"}}var g=D(()=>{"use strict"});var O={};_(O,{ENTITIES:()=>L,ENTITIES_BY_HUB:()=>W});var L,W,C=D(()=>{"use strict";L=[{id:"eggs",title:"Eggs",hub:"price-pressure"}],W=L.reduce((t,e)=>(t[e.hub]||(t[e.hub]=[]),t[e.hub].push(e),t),{})});var h=null;async function I(){try{let t=await fetch(`/data/_meta.json?t=${Date.now()}`);if(!t.ok)return null;let e=await t.json();return e?.lastUpdated&&(h=new Date(e.lastUpdated).getTime().toString()),e}catch{return null}}async function N(){try{let t=h?`?v=${h}`:`?t=${Date.now()}`,e=await fetch(`/data/_registry.json${t}`);return e.ok?await e.json():null}catch{return null}}async function c(t){try{let e=h?`?v=${h}`:`?t=${Date.now()}`,a=await fetch(`/data/${t}.json${e}`);return a.ok?await a.json():null}catch{return null}}g();g();async function U(){let[t,e]=await Promise.all([c("uk.food-inflation"),c("alerts")]),a=t?.signal,i=a?.food_inflation_yoy_percent?`${a.food_inflation_yoy_percent}%`:"--",r=t?.status||"unknown",n=Array.isArray(e?.items)?e.items.length:0,s=n>0?"Alerts Active":"No Critical Alerts",d=`
    <div class="signal-grid">
        <!-- Card 1: Price Pressure -->
        <a href="/price-pressure" class="card border-left-info">
            <h3>Price Pressure</h3>
            <div class="signal-value">High</div>
            <div class="meta">Tracking core commodities</div>
            <div class="action-link">View Analysis &rarr;</div>
        </a>

        <!-- Card 2: Inflation -->
        <a href="/inflation-trends" class="card ${M(r)}">
            <h3>UK Food Inflation</h3>
            <div class="signal-value ${R(r)}">${i}</div>
            <div class="meta">Official ONS Data</div>
            <div class="action-link">View Trends &rarr;</div>
        </a>

        <!-- Card 3: Alerts -->
        <a href="/alerts" class="card ${n>0?"border-left-bad":"border-left-good"}">
            <h3>Safety Alerts</h3>
            <div class="signal-value" style="font-size: 1.5rem;">${n} Notices</div>
            <div class="meta">Recalls & Allergy Warnings</div>
            <div class="action-link">Latest Updates &rarr;</div>
        </a>
    </div>
    `;return l("Dashboard",d,!1)}function M(t){return t==="rising"||t==="alert"?"border-left-bad":t==="easing"||t==="safe"?"border-left-good":"border-left-warn"}function R(t){return t==="rising"?"trend-up":t==="easing"?"trend-down":"trend-flat"}g();function j(t){if(!t)return"Unknown";let e=new Date(t);return isNaN(e.getTime())?"Unknown":e.toISOString().slice(0,10)}async function b(t){if(t){let e="";if(t==="eggs"&&(e="uk.eggs.pressure"),!e)return l("Not Found","<p>Signal not found.</p>");let a=await c(e);if(!a)return l("Not Found","<p>Data unavailable.</p>");let i=a.signal,n=a.status==="rising"?"High / Rising":"Stable",s=a.source_url,f=s&&(s.startsWith("http://")||s.startsWith("https://"))?`<a href="${s}" target="_blank" rel="noopener noreferrer">${s}</a>`:s||"Unknown",m=`
            <div class="card">
                <h2>${a.title}</h2>
                <div class="signal-value ${a.status==="rising"?"trend-up":"trend-flat"}">${n}</div>
                <p><strong>YoY Increase:</strong> ${i?.yoy_percent||"--"}%</p>
                <p><strong>Current Price:</strong> \xA3${i?.price||"--"} (${i?.unit||""})</p>
                <div class="meta">Source: ${f}</div>
            </div>
            
            <div style="margin-top:20px;">
                <h3>Analysis</h3>
                <p>Evidence suggests prices are ${a.status} due to market conditions.</p>
            </div>
        `;return l(a.title,m)}else{let i=[await c("uk.eggs.pressure")].filter(Boolean).map(r=>{let n=j(r.last_official_update||r.fetched_at_utc),s=r.status;return`
                <a href="/price-pressure/eggs/" class="card" style="text-decoration:none; color:inherit; display:block;">
                    <h3>${r.title}</h3>
                    <div class="signal-value ${s==="rising"?"trend-up":"trend-flat"}">${s.toUpperCase()}</div>
                    <div class="meta">Updated: ${n}</div>
                </a>
            `}).join("");return l("Price Pressure Hub",`
            <div class="signal-grid">
                ${i}
            </div>
        `)}}g();async function E(){let[t,e]=await Promise.all([c("uk.food-inflation"),c("uk.inflation.notices")]),a=t?.signal,i=a?.food_inflation_yoy_percent,r=i?`${i}%`:"--",n=t?.status||"unknown",s=a?.period||"Unknown",d=`
            <div class="card">
                <h3>UK Food Inflation (YoY)</h3>
                <div class="signal-value ${B(n)}">${r}</div>
                <div class="meta">Reference Period: ${s}</div>
            </div>
            <!-- Placeholder for MoM or other macro metrics -->
             <div class="card card-placeholder">
                <h3>Month-on-Month</h3>
                <div class="signal-value">--</div>
                <div class="meta">Coming Soon</div>
            </div>
    `,f="";e&&Array.isArray(e.items)?f=e.items.map(p=>`
            <a href="${p.url}" target="_blank" class="card">
                <h3>${p.title}</h3>
                <div class="meta">${V(p.date)} \u2022 ${p.source_name}</div>
                <p class="meta-summary">${p.summary||""}</p>
                <div class="action-link">View Notice &nearr;</div>
            </a>
        `).join(""):f='<div class="card"><p>No recent notices available.</p></div>';let m=`
        <h2>Inflation Metrics</h2>
        <div class="signal-grid section-spacer">
            ${d}
        </div>

        <h2>Inflation Notices</h2>
        <p class="meta" style="margin-bottom:20px;">Official updates from ONS, DEFRA, and GOV.UK</p>
        <div class="signal-grid">
            ${f}
        </div>
        
        <div class="section-top">
            <h3>Source Data</h3>
            <p>Derived from <a href="https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/d7c8/mm23/data">Office for National Statistics</a> (CPI).</p>
        </div>
    `;return l("Inflation Trends",m)}function B(t){return t==="rising"?"trend-up":t==="easing"?"trend-down":"trend-flat"}function V(t){try{return new Date(t).toLocaleDateString()}catch{return t}}g();var x=10;async function w(t){let e=await c("alerts"),a=e?.items||[],i=a.length,r=Math.ceil(i/x)||1,n=1;if(t){let o=parseInt(t,10);isNaN(o)||(n=o)}if(n<1||n>r)return l("Page Not Found",`
            <div class="container" style="text-align:center; padding:50px 0;">
                <h2>Page Not Found</h2>
                <p>The requested page of alerts does not exist.</p>
                <div class="action-link"><a href="/alerts">Return to Safety Alerts</a></div>
            </div>
        `);let s=(n-1)*x,d=s+x,f=a.slice(s,d),m=e?.last_official_update?new Date(e.last_official_update).toLocaleDateString():"Unknown",p=f.length>0?f.map(o=>{let y=o.modified||o.created,H=y?new Date(y).toLocaleDateString():"Unknown",k=o.alert_url&&(o.alert_url.startsWith("http://")||o.alert_url.startsWith("https://"))?`<a href="${o.alert_url}" target="_blank" rel="noopener noreferrer">View on FSA &rarr;</a>`:"";return`
        <div class="card" style="border-left: 4px solid #dda720;">
             <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span class="meta">${H}</span>
                <span class="confidence-pill" style="background:#eee; color:#333;">${o.type}</span>
             </div>
             <h3 style="margin: 0 0 10px 0;">${o.title}</h3>
             ${k?`<div style="margin-top:10px; font-size:0.9em;">${k}</div>`:""}
        </div>
        `}).join(""):"<p>No active notices found.</p>",u="";if(r>1){let o=n===2?"/alerts":`/alerts/page/${n-1}`,y=`/alerts/page/${n+1}`;u='<div class="pagination" style="display:flex; justify-content:space-between; margin-top:20px; padding-top:20px; border-top:1px solid #eee;">',n>1?u+=`<a href="${o}" class="btn">&larr; Newer</a>`:u+="<span></span>",u+=`<span class="meta">Page ${n} of ${r}</span>`,n<r?u+=`<a href="${y}" class="btn">Older &rarr;</a>`:u+="<span></span>",u+="</div>"}let P=n>1?`Safety Alerts (Page ${n})`:"Safety Alerts",T=`
        <div style="margin-bottom:30px;">
            <h2>${P}</h2>
            <p class="meta">Official recalls & allergy warnings from the UK Food Standards Agency (FSA).</p>
            <p class="meta">Last Official Update: ${m}</p>
        </div>
        <div class="signal-grid" style="grid-template-columns: 1fr;"> 
            ${p}
        </div>
        ${u}
    `;return l(P,T)}async function v(){let{renderLayout:t}=await Promise.resolve().then(()=>(g(),A));return t("404 Not Found",`
        <div class="container" style="text-align: center; padding: 50px 0;">
            <h1>404</h1>
            <p>Page not found</p>
            <a href="/" class="back-link">Return Home</a>
        </div>
    `)}async function S(){let t=window.location.pathname,e=document.getElementById("app");if(!e)return;let i=(t.endsWith("/")?t:t+"/").split("/").filter(n=>n.length>0),r="";try{if(i.length===0)r=await U();else if(i.length===1){let n=i[0];n==="price-pressure"?r=await b():n==="inflation-trends"||(n==="inflation-trends"?r=await E():n==="alerts"?r=await w():r=await v())}else if(i.length===2){let[n,s]=i,{ENTITIES_BY_HUB:d}=await Promise.resolve().then(()=>(C(),O));(d[n]||[]).some(p=>p.id===s)?n==="price-pressure"||(n==="price-pressure"?r=await b(s):n==="alerts"?r=await w(s):r=await v()):r=await v()}else if(i.length===3){let[n,s,d]=i;n==="alerts"&&s==="page"?r=await w(d):r=await v()}else r=await v();e.innerHTML=r,window.scrollTo(0,0)}catch(n){console.error("Render error:",n),e.innerHTML='<div class="container error"><h2>Error loading page</h2><p>Please refresh.</p></div>'}}window.addEventListener("popstate",S);document.addEventListener("DOMContentLoaded",async()=>{try{let[t,e]=await Promise.all([I(),N()]);t&&t.lastUpdated&&$(t.lastUpdated),e&&console.log("Registry loaded",e.length,"items")}catch(t){console.error("Init error (non-fatal):",t)}document.body.addEventListener("click",t=>{let e=t.target.closest("a");if(e&&e.getAttribute("href")?.startsWith("/")&&!e.getAttribute("target")){t.preventDefault();let a=e.getAttribute("href");history.pushState(null,"",a),S()}}),S()});})();
//# sourceMappingURL=app.js.map
