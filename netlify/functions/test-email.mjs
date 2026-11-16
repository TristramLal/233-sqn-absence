// Test-only endpoint: accepts a scenario identifier, never cadet-submitted details.
const json=(status,data)=>new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});
const scenarios={
  school:{rank:"CDT",name:"Alex Example",flight:"1 Flight",reason:"School/study",submitted:"Parent/guardian"},
  transport:{rank:"LCDT",name:"Taylor Example",flight:"2 Flight",reason:"Transport difficulty",submitted:"Cadet"},
  family:{rank:"CCPL",name:"Jordan Example",flight:"3 Flight",reason:"Family commitment",submitted:"Parent/guardian"}
};
export default async(request)=>{
  if(request.method!=="POST")return json(405,{error:"POST required"});
  const {RESEND_API_KEY,TEST_EMAIL_TOKEN,TEST_TO_EMAIL,TEST_FROM_EMAIL,EMAIL_TEST_ENABLED}=process.env;
  if(EMAIL_TEST_ENABLED!=="true")return json(503,{error:"Email test is disabled"});
  if(!TEST_EMAIL_TOKEN||request.headers.get("x-test-token")!==TEST_EMAIL_TOKEN)return json(401,{error:"Unauthorised"});
  if(!RESEND_API_KEY||!TEST_TO_EMAIL||!TEST_FROM_EMAIL)return json(503,{error:"Missing email configuration"});
  if(!/^\S+@\S+\.\S+$/.test(TEST_TO_EMAIL))return json(503,{error:"Invalid test recipient"});
  let scenario="school";
  try{
    const raw=await request.text();
    if(raw.length>200)return json(400,{error:"Invalid test request"});
    if(raw){
      const data=JSON.parse(raw);
      if(Object.keys(data).length!==1||typeof data.scenario!=="string"||!Object.hasOwn(scenarios,data.scenario))return json(400,{error:"Invalid fictional scenario"});
      scenario=data.scenario;
    }
  }catch{return json(400,{error:"Invalid JSON"})}
  const c=scenarios[scenario];
  const text=["TEST ONLY - NO REAL CADET INFORMATION","","Rank: "+c.rank,"Name: "+c.name,"Flight: "+c.flight,"First date absent: 2026-11-18","Last date absent: 2026-11-18","Reason: "+c.reason,"Submitted by: "+c.submitted,"","This is a controlled fictional email delivery test, not a real absence notification."].join("\n");
  try{
    const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{authorization:`Bearer ${RESEND_API_KEY}`,"content-type":"application/json"},body:JSON.stringify({from:TEST_FROM_EMAIL,to:[TEST_TO_EMAIL],subject:"233 SQN absence form - FICTIONAL TEST ONLY",text})});
    const body=await response.json().catch(()=>({}));
    if(!response.ok)return json(502,{error:"Email provider rejected test",provider_status:response.status,provider_message:body.message||"Unknown error"});
    return json(200,{ok:true,message:"Test email accepted by provider",id:body.id||null});
  }catch{return json(502,{error:"Email provider could not be reached"})}
};
export const config={path:"/api/test-email"};
