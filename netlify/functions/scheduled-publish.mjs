// Rebuilds banksman.app every morning so blog posts scheduled for today go live.
// A post is scheduled when it's published in /admin/ with a future publish date.
//
// One-off setup in Netlify:
// 1. Site configuration → Build & deploy → Build hooks → Add build hook
//    (name "Scheduled posts", branch main). Copy the URL.
// 2. Site configuration → Environment variables → Add a variable:
//    key SCHEDULED_BUILD_HOOK, value = the URL from step 1.
export default async () => {
  const hook = process.env.SCHEDULED_BUILD_HOOK;
  if (!hook) {
    console.log('SCHEDULED_BUILD_HOOK is not set; skipping the scheduled rebuild.');
    return;
  }
  const res = await fetch(hook, { method: 'POST', body: '{}' });
  console.log(`Scheduled rebuild requested: ${res.status}`);
};

// 05:07 UTC every day: 05:07 UK time in winter, 06:07 in summer.
export const config = { schedule: '7 5 * * *' };
