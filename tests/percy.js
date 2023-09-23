const PercyScript = require('@percy/script');

PercyScript.run(async (page, percySnapshot) => {
    await page.goto('http://localhost:5001/index.html');
    await page.waitFor(3000); // animation to finish
    await percySnapshot('/example-resume.html');
});
