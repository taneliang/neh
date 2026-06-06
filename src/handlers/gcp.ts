import { CommandHandler, RedirectHandler } from '../Handler';

const gcp = new CommandHandler();

const GCP_BASE = 'https://console.cloud.google.com';

gcp.setNothingHandler(new RedirectHandler('navigates to GCP console', GCP_BASE));

// Cloud SQL
const cloudSql = new CommandHandler();
const cloudSqlBaseUrl = `${GCP_BASE}/sql`;
cloudSql.setNothingHandler(new RedirectHandler('navigates to Cloud SQL instances', `${cloudSqlBaseUrl}/instances`));
cloudSql.addHandler('i', new RedirectHandler('navigates to Cloud SQL instances', `${cloudSqlBaseUrl}/instances`));
cloudSql.addHandler('instances', new RedirectHandler('navigates to Cloud SQL instances', `${cloudSqlBaseUrl}/instances`));
cloudSql.addHandler('create', new RedirectHandler('navigates to Cloud SQL create instance', `${cloudSqlBaseUrl}/choose-instance-engine`));
gcp.addHandler('sql', cloudSql);
gcp.addHandler('cloudsql', cloudSql);

// Cloud Run
const cloudRun = new CommandHandler();
const cloudRunBaseUrl = `${GCP_BASE}/run`;
cloudRun.setNothingHandler(new RedirectHandler('navigates to Cloud Run services', cloudRunBaseUrl));
cloudRun.addHandler('s', new RedirectHandler('navigates to Cloud Run services', cloudRunBaseUrl));
cloudRun.addHandler('services', new RedirectHandler('navigates to Cloud Run services', cloudRunBaseUrl));
cloudRun.addHandler('j', new RedirectHandler('navigates to Cloud Run jobs', `${cloudRunBaseUrl}?tab=jobs`));
cloudRun.addHandler('jobs', new RedirectHandler('navigates to Cloud Run jobs', `${cloudRunBaseUrl}?tab=jobs`));
gcp.addHandler('run', cloudRun);
gcp.addHandler('cloudrun', cloudRun);
gcp.addHandler('cr', cloudRun);

// Container Registry / Artifact Registry
const artifactRegistry = new CommandHandler();
const arBaseUrl = `${GCP_BASE}/artifacts`;
artifactRegistry.setNothingHandler(new RedirectHandler('navigates to Artifact Registry', arBaseUrl));
artifactRegistry.addHandler('r', new RedirectHandler('navigates to Artifact Registry repositories', arBaseUrl));
artifactRegistry.addHandler('repos', new RedirectHandler('navigates to Artifact Registry repositories', arBaseUrl));
artifactRegistry.addHandler('repositories', new RedirectHandler('navigates to Artifact Registry repositories', arBaseUrl));
gcp.addHandler('ar', artifactRegistry);
gcp.addHandler('gcr', artifactRegistry);
gcp.addHandler('registry', artifactRegistry);

// Kubernetes Engine (GKE)
const gke = new CommandHandler();
const gkeBaseUrl = `${GCP_BASE}/kubernetes`;
gke.setNothingHandler(new RedirectHandler('navigates to GKE clusters', `${gkeBaseUrl}/list`));
gke.addHandler('c', new RedirectHandler('navigates to GKE clusters', `${gkeBaseUrl}/list`));
gke.addHandler('clusters', new RedirectHandler('navigates to GKE clusters', `${gkeBaseUrl}/list`));
gke.addHandler('w', new RedirectHandler('navigates to GKE workloads', `${gkeBaseUrl}/workload`));
gke.addHandler('workloads', new RedirectHandler('navigates to GKE workloads', `${gkeBaseUrl}/workload`));
gke.addHandler('gw', new RedirectHandler('navigates to GKE gateways', `${gkeBaseUrl}/gateways`));
gke.addHandler('gateways', new RedirectHandler('navigates to GKE gateways', `${gkeBaseUrl}/gateways`));
gcp.addHandler('gke', gke);
gcp.addHandler('k8s', gke);
gcp.addHandler('kubernetes', gke);

// Cloud Storage (GCS)
const gcs = new CommandHandler();
const gcsBaseUrl = `${GCP_BASE}/storage`;
gcs.setNothingHandler(new RedirectHandler('navigates to Cloud Storage buckets', `${gcsBaseUrl}/browser`));
gcs.addHandler('b', new RedirectHandler('navigates to Cloud Storage buckets', `${gcsBaseUrl}/browser`));
gcs.addHandler('buckets', new RedirectHandler('navigates to Cloud Storage buckets', `${gcsBaseUrl}/browser`));
gcs.addHandler('t', new RedirectHandler('navigates to Cloud Storage transfer', `${gcsBaseUrl}/transfer`));
gcs.addHandler('transfer', new RedirectHandler('navigates to Cloud Storage transfer', `${gcsBaseUrl}/transfer`));
gcp.addHandler('gcs', gcs);
gcp.addHandler('storage', gcs);

// Cloud Functions
const functions = new CommandHandler();
const functionsBaseUrl = `${GCP_BASE}/functions`;
functions.setNothingHandler(new RedirectHandler('navigates to Cloud Functions', `${functionsBaseUrl}/list`));
functions.addHandler('l', new RedirectHandler('navigates to Cloud Functions list', `${functionsBaseUrl}/list`));
functions.addHandler('list', new RedirectHandler('navigates to Cloud Functions list', `${functionsBaseUrl}/list`));
functions.addHandler('create', new RedirectHandler('navigates to Cloud Functions create', `${functionsBaseUrl}/add`));
gcp.addHandler('functions', functions);
gcp.addHandler('fn', functions);
gcp.addHandler('gcf', functions);

// Pub/Sub
const pubsub = new CommandHandler();
const pubsubBaseUrl = `${GCP_BASE}/cloudpubsub`;
pubsub.setNothingHandler(new RedirectHandler('navigates to Pub/Sub topics', `${pubsubBaseUrl}/topic/list`));
pubsub.addHandler('t', new RedirectHandler('navigates to Pub/Sub topics', `${pubsubBaseUrl}/topic/list`));
pubsub.addHandler('topics', new RedirectHandler('navigates to Pub/Sub topics', `${pubsubBaseUrl}/topic/list`));
pubsub.addHandler('s', new RedirectHandler('navigates to Pub/Sub subscriptions', `${pubsubBaseUrl}/subscription/list`));
pubsub.addHandler('subscriptions', new RedirectHandler('navigates to Pub/Sub subscriptions', `${pubsubBaseUrl}/subscription/list`));
gcp.addHandler('pubsub', pubsub);
gcp.addHandler('ps', pubsub);

// BigQuery
const bigquery = new CommandHandler();
const bqBaseUrl = `${GCP_BASE}/bigquery`;
bigquery.setNothingHandler(new RedirectHandler('navigates to BigQuery', bqBaseUrl));
bigquery.addHandler('e', new RedirectHandler('navigates to BigQuery explorer', bqBaseUrl));
bigquery.addHandler('explorer', new RedirectHandler('navigates to BigQuery explorer', bqBaseUrl));
bigquery.addHandler('j', new RedirectHandler('navigates to BigQuery job history', `${bqBaseUrl}?tab=job_history`));
bigquery.addHandler('jobs', new RedirectHandler('navigates to BigQuery job history', `${bqBaseUrl}?tab=job_history`));
gcp.addHandler('bq', bigquery);
gcp.addHandler('bigquery', bigquery);

// IAM
const iam = new CommandHandler();
const iamBaseUrl = `${GCP_BASE}/iam-admin`;
iam.setNothingHandler(new RedirectHandler('navigates to IAM', `${iamBaseUrl}/iam`));
iam.addHandler('i', new RedirectHandler('navigates to IAM permissions', `${iamBaseUrl}/iam`));
iam.addHandler('iam', new RedirectHandler('navigates to IAM permissions', `${iamBaseUrl}/iam`));
iam.addHandler('sa', new RedirectHandler('navigates to IAM service accounts', `${iamBaseUrl}/serviceaccounts`));
iam.addHandler('serviceaccounts', new RedirectHandler('navigates to IAM service accounts', `${iamBaseUrl}/serviceaccounts`));
iam.addHandler('r', new RedirectHandler('navigates to IAM roles', `${iamBaseUrl}/roles`));
iam.addHandler('roles', new RedirectHandler('navigates to IAM roles', `${iamBaseUrl}/roles`));
gcp.addHandler('iam', iam);

// Billing
const billing = new CommandHandler();
const billingBaseUrl = 'https://console.cloud.google.com/billing';
billing.setNothingHandler(new RedirectHandler('navigates to GCP billing', billingBaseUrl));
billing.addHandler('o', new RedirectHandler('navigates to GCP billing overview', billingBaseUrl));
billing.addHandler('overview', new RedirectHandler('navigates to GCP billing overview', billingBaseUrl));
billing.addHandler('r', new RedirectHandler('navigates to GCP billing reports', `${billingBaseUrl}/reports`));
billing.addHandler('reports', new RedirectHandler('navigates to GCP billing reports', `${billingBaseUrl}/reports`));
billing.addHandler('b', new RedirectHandler('navigates to GCP billing budgets', `${billingBaseUrl}/budgets`));
billing.addHandler('budgets', new RedirectHandler('navigates to GCP billing budgets', `${billingBaseUrl}/budgets`));
gcp.addHandler('billing', billing);
gcp.addHandler('bill', billing);

// Logging
const logging = new CommandHandler();
const loggingBaseUrl = `${GCP_BASE}/logs`;
logging.setNothingHandler(new RedirectHandler('navigates to Cloud Logging explorer', `${loggingBaseUrl}/query`));
logging.addHandler('e', new RedirectHandler('navigates to Cloud Logging explorer', `${loggingBaseUrl}/query`));
logging.addHandler('explorer', new RedirectHandler('navigates to Cloud Logging explorer', `${loggingBaseUrl}/query`));
logging.addHandler('m', new RedirectHandler('navigates to Cloud Logging metrics', `${loggingBaseUrl}/metrics`));
logging.addHandler('metrics', new RedirectHandler('navigates to Cloud Logging metrics', `${loggingBaseUrl}/metrics`));
gcp.addHandler('logging', logging);
gcp.addHandler('logs', logging);

// Monitoring
const monitoring = new CommandHandler();
const monitoringBaseUrl = `${GCP_BASE}/monitoring`;
monitoring.setNothingHandler(new RedirectHandler('navigates to Cloud Monitoring', monitoringBaseUrl));
monitoring.addHandler('d', new RedirectHandler('navigates to Cloud Monitoring dashboards', `${monitoringBaseUrl}/dashboards`));
monitoring.addHandler('dashboards', new RedirectHandler('navigates to Cloud Monitoring dashboards', `${monitoringBaseUrl}/dashboards`));
monitoring.addHandler('a', new RedirectHandler('navigates to Cloud Monitoring alerting', `${monitoringBaseUrl}/alerting`));
monitoring.addHandler('alerting', new RedirectHandler('navigates to Cloud Monitoring alerting', `${monitoringBaseUrl}/alerting`));
gcp.addHandler('monitoring', monitoring);
gcp.addHandler('mon', monitoring);

// Compute Engine
const compute = new CommandHandler();
const computeBaseUrl = `${GCP_BASE}/compute`;
compute.setNothingHandler(new RedirectHandler('navigates to Compute Engine instances', `${computeBaseUrl}/instances`));
compute.addHandler('i', new RedirectHandler('navigates to Compute Engine instances', `${computeBaseUrl}/instances`));
compute.addHandler('instances', new RedirectHandler('navigates to Compute Engine instances', `${computeBaseUrl}/instances`));
compute.addHandler('d', new RedirectHandler('navigates to Compute Engine disks', `${computeBaseUrl}/disks`));
compute.addHandler('disks', new RedirectHandler('navigates to Compute Engine disks', `${computeBaseUrl}/disks`));
compute.addHandler('n', new RedirectHandler('navigates to Compute Engine networks', `${GCP_BASE}/networking/networks/list`));
compute.addHandler('networks', new RedirectHandler('navigates to Compute Engine networks', `${GCP_BASE}/networking/networks/list`));
gcp.addHandler('compute', compute);
gcp.addHandler('gce', compute);
gcp.addHandler('vm', compute);

// Secret Manager
const secrets = new CommandHandler();
const secretsBaseUrl = `${GCP_BASE}/security/secret-manager`;
secrets.setNothingHandler(new RedirectHandler('navigates to Secret Manager', secretsBaseUrl));
secrets.addHandler('l', new RedirectHandler('navigates to Secret Manager secrets list', secretsBaseUrl));
secrets.addHandler('list', new RedirectHandler('navigates to Secret Manager secrets list', secretsBaseUrl));
secrets.addHandler('create', new RedirectHandler('navigates to Secret Manager create secret', `${secretsBaseUrl}/secret?action=create`));
gcp.addHandler('secrets', secrets);
gcp.addHandler('sm', secrets);

// Firestore
const firestore = new CommandHandler();
const firestoreBaseUrl = `${GCP_BASE}/firestore`;
firestore.setNothingHandler(new RedirectHandler('navigates to Firestore', `${firestoreBaseUrl}/data`));
firestore.addHandler('d', new RedirectHandler('navigates to Firestore data', `${firestoreBaseUrl}/data`));
firestore.addHandler('data', new RedirectHandler('navigates to Firestore data', `${firestoreBaseUrl}/data`));
firestore.addHandler('i', new RedirectHandler('navigates to Firestore indexes', `${firestoreBaseUrl}/indexes`));
firestore.addHandler('indexes', new RedirectHandler('navigates to Firestore indexes', `${firestoreBaseUrl}/indexes`));
gcp.addHandler('firestore', firestore);
gcp.addHandler('fs', firestore);

// Cloud Tasks
const tasks = new CommandHandler();
const tasksBaseUrl = `${GCP_BASE}/cloudtasks`;
tasks.setNothingHandler(new RedirectHandler('navigates to Cloud Tasks queues', tasksBaseUrl));
tasks.addHandler('q', new RedirectHandler('navigates to Cloud Tasks queues', tasksBaseUrl));
tasks.addHandler('queues', new RedirectHandler('navigates to Cloud Tasks queues', tasksBaseUrl));
gcp.addHandler('tasks', tasks);
gcp.addHandler('ct', tasks);

// Cloud Scheduler
const scheduler = new CommandHandler();
const schedulerBaseUrl = `${GCP_BASE}/cloudscheduler`;
scheduler.setNothingHandler(new RedirectHandler('navigates to Cloud Scheduler', schedulerBaseUrl));
scheduler.addHandler('j', new RedirectHandler('navigates to Cloud Scheduler jobs', schedulerBaseUrl));
scheduler.addHandler('jobs', new RedirectHandler('navigates to Cloud Scheduler jobs', schedulerBaseUrl));
gcp.addHandler('scheduler', scheduler);
gcp.addHandler('csch', scheduler);

export default gcp;
