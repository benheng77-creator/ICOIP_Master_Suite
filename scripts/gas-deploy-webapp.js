/**
 * Programmatically creates proper web-app deployments for all 6 ICOIP portals
 * using the Apps Script REST API + clasp's OAuth credentials.
 */
const https = require('https');
const qs    = require('querystring');

const CLIENT_ID     = '1072944905499-vm2v2i5dvn0a0d2o4ca36i1vge8cvbn0.apps.googleusercontent.com';
const CLIENT_SECRET = 'v6V3fKV_zWU7iw1DrpO1rknX';
const REFRESH_TOKEN = '1//0g3B544Go60RgCgYIARAAGBASNwF-L9IrmVE7eOMBHpoGLzaMfZtigo2AXCuU3SrZDLPazeiD0PzdOwr8DvYdQ0Tahr4kB9Vo-vc';

const PORTALS = [
  { name: '00 Master Suite',      id: '1--bAiU6Phx6oQ2pKHSCo72LFj9qltJfystRThJJhx24sw-A-nDur6pmq' },
  { name: '01 Volunteer Mgmt',    id: '1mSyPLIm31uxxvuy9xytEGo9SLmhD7Hi_JdCL69DN0aNBF2VWmF846AbA' },
  { name: '02 Intake & Referral', id: '1dCrmzi1PwM7udo8oMNOdJdIwUwrK5mfPa2LIkJ3BbFNmuu1eIE2hFR4b' },
  { name: '03 Counselling',       id: '1DUa6Ui85iAQKzNC2sXkjGVTTy6JIqOZw-xXsmL4jDFu-imJoGKAhY7wv' },
  { name: '04 Admin',             id: '1rgZLP0V2Sn6KWr2UO2SxI_n009VOU6S7eicL8z-ZrX0c6i0VmeGBuWct' },
  { name: '05 AI Training',       id: '181pIKfULCDbdUsCxPaakBeYMdbvZ_BSDALICxBAQgRCYJY01twa8BfH-' },
];

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function getAccessToken() {
  const body = qs.stringify({
    client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
    refresh_token: REFRESH_TOKEN, grant_type: 'refresh_token'
  });
  const r = await request({
    hostname: 'oauth2.googleapis.com', path: '/token', method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) }
  }, body);
  if (!r.body.access_token) throw new Error('Token refresh failed: ' + JSON.stringify(r.body));
  return r.body.access_token;
}

async function getVersions(token, scriptId) {
  const r = await request({
    hostname: 'script.googleapis.com',
    path: `/v1/projects/${scriptId}/versions`,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  return r.body.versions || [];
}

async function createVersion(token, scriptId) {
  const body = JSON.stringify({ description: 'V2 UX/UI Overhaul' });
  const r = await request({
    hostname: 'script.googleapis.com',
    path: `/v1/projects/${scriptId}/versions`,
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
  }, body);
  return r.body;
}

async function createDeployment(token, scriptId, versionNumber) {
  const body = JSON.stringify({
    versionNumber,
    manifestFileName: 'appsscript',
    description: 'V2 Public Web App'
  });
  const r = await request({
    hostname: 'script.googleapis.com',
    path: `/v1/projects/${scriptId}/deployments`,
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
  }, body);
  return r.body;
}

async function main() {
  console.log('Refreshing token...');
  const token = await getAccessToken();
  console.log('Token OK\n');

  for (const portal of PORTALS) {
    console.log(`── ${portal.name} ──────────────────`);
    try {
      // Create a new version
      const ver = await createVersion(token, portal.id);
      console.log(`  Version: ${ver.versionNumber || JSON.stringify(ver)}`);

      if (!ver.versionNumber) { console.log('  SKIP: no version created'); continue; }

      // Create deployment pointing to that version
      const dep = await createDeployment(token, portal.id, ver.versionNumber);
      console.log(`  Deployment ID: ${dep.deploymentId || JSON.stringify(dep)}`);

      // Print URL
      if (dep.deploymentId) {
        console.log(`  URL: https://script.google.com/macros/s/${dep.deploymentId}/exec`);
      }
    } catch (e) {
      console.log(`  ERROR: ${e.message}`);
    }
    console.log();
  }
}

main().catch(console.error);
