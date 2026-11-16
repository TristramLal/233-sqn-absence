// Test-only endpoint. Does not accept cadet data from the public website.
// Invoke manually with a secret header after configuring Netlify environment variables.
const json = (status, data) => new Response(JSON.stringify(data), {status,headers:{"content-type":"application/json","cache-control":"no-store"}});
export default async (request) => {
  if (request.method !== "POST") return json(405,{error:"POST required"});
  const {RESEND_API_KEY,TEST_EMAIL_TOKEN,TEST_TO_EMAIL,TEST_FROM_EMAIL,EMAIL_TEST_ENABLED} = Netlify.env.toObject();
  if (EMAIL_TEST_ENABLED !== "true") return json(503,{error:"Email test is disabled"});
  if (!TEST_EMAIL_TOKEN || request.headers.get("x-test-token") !== TEST_EMAIL_TOKEN) return json(401,{error:"Unauthorised"});
  if (!RESEND_API_KEY || !TEST_TO_EMAIL || !TEST_FROM_EMAIL) return json(503,{error:"Missing email configuration"});
  if (!/^\S+@\S+\.\S+$/.test(TEST_TO_EMAIL)) return json(503,{error:"Invalid test recipient"});
  const response = await fetch("https://api.resend.com/emails",{
    method:"POST",
    headers:{"authorization":`Bearer ${RESEND_API_KEY}`,"content-type":"application/json"},
    body:JSON.stringify({
      from:TEST_FROM_EMAIL,to:[TEST_TO_EMAIL],
      subject:"233 SQN absence form - FICTIONAL TEST ONLY",
      text:"TEST ONLY - NO REAL CADET INFORMATION\n\nRank: CDT\nName: Alex Example\nFlight: 1 Flight\nFirst date absent: 2026-11-18\nLast date absent: 2026-11-18\nReason: School/study\nSubmitted by: Parent/guardian\n\nThis is a controlled test of the email delivery system. It is not a real absence notification."
    })
  });
  const body=await response.json().catch(()=>({}));
  if(!response.ok) return json(502,{error:"Email provider rejected test",provider_status:response.status,provider_message:body.message||"Unknown error"});
  return json(200,{ok:true,message:"Test email accepted by provider",id:body.id||null});
};
export const config = {path:"/api/test-email"};
