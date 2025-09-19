export default async function handler(req, res) {
  const envVars = {
    SALESFORCE_CONSUMER_KEY: process.env.SALESFORCE_CONSUMER_KEY ? 'SET' : 'NOT SET',
    SALESFORCE_CONSUMER_SECRET: process.env.SALESFORCE_CONSUMER_SECRET ? 'SET' : 'NOT SET',
    SALESFORCE_SCRT_URL: process.env.SALESFORCE_SCRT_URL ? 'SET' : 'NOT SET',
    SALESFORCE_ORG_ID: process.env.SALESFORCE_ORG_ID ? 'SET' : 'NOT SET',
    SALESFORCE_ES_DEVELOPER_NAME: process.env.SALESFORCE_ES_DEVELOPER_NAME ? 'SET' : 'NOT SET',
  };

  return res.status(200).json({
    success: true,
    environment: envVars,
    orgIdLength: process.env.SALESFORCE_ORG_ID ? process.env.SALESFORCE_ORG_ID.length : 0,
    message: 'Environment check complete'
  });
}