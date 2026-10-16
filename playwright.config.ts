import { defineConfig, devices } from "@playwright/test";
const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};
export default defineConfig
({ timeout: 30 * 1000, //30000 ms(30 secs) 
testDir: "./tests", 
fullyParallel: true, 
retries: env.CI ? 2 : 0, 
workers: env.CI ? 1 : undefined, 
reporter: [ 
   ["list"], // Detailed console output
 //['line'], // One-line progress output 
 //['dot'], // Minimal console output
 ["html", { open: "never", outputFolder: "reports" }], // HTML Report
 //['json', { outputFile: 'reports/results.json' }], // JSON Report
 ["junit", { outputFile: "reports/results.xml" }], // JUnit XML Report 
 ["./utils/CustomReporter.ts"], // Custom reporter 
 ["allure-playwright", { outputFolder: "allure-results" }], // Allure Report
 ],
 use: { trace: "on-first-retry", 
 screenshot: "only-on-failure", 
 video: "retain-on-failure", 
 headless: false, 
 viewport: { width: 1280, height: 720 }, // Set default viewport size for consistency 
 ignoreHTTPSErrors: true, // Ignore SSL errors if necessary 
 permissions: ["geolocation"], // Set necessary permissions for geolocation-based tests 
 }, 
grep: /@master/, 
projects: [ { 
name: "chromium", 
use: { ...devices["Desktop Chrome"] }, 
}, 
/* 
{ name: 'firefox', 
use: { ...devices['Desktop Firefox'] }, 
}, 
{name: 'webkit',
use: { ...devices['Desktop Safari'] },
}
*/
],
})
















