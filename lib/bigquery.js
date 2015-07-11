var gcloud = require('gcloud');

module.exports = gcloud.bigquery({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    private_key_id: process.env.GCP_PRIVATE_KEY_ID,
    private_key:    process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email:   process.env.GCP_CLIENT_EMAIL,
    client_id:      process.env.GCP_CLIENT_ID,
    type:           process.env.GCP_TYPE,
  },
});
