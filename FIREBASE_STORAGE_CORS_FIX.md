# Firebase Storage CORS Fix for Web

To allow image uploads from your local development environment (localhost) or your deployed web app, you must configure CORS (Cross-Origin Resource Sharing) for your Firebase Storage bucket.

## Option 1: Using the Google Cloud Console (Easiest)

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Select your Firebase project.
3.  Go to **Cloud Storage > Buckets**.
4.  Find your bucket (e.g., `turfarena-5564a.firebasestorage.app`).
5.  Click on the **Permissions** tab.
6.  Click **Add Principal**.
7.  In the Cloud Shell (button at the top right of the console), run the following commands:

### Create a CORS configuration file

```bash
echo '[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["Content-Type", "x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]' > cors.json
```

### Apply the configuration to your bucket

Replace `YOUR_BUCKET_NAME` with your actual bucket name (e.g., `turfarena-5564a.firebasestorage.app`).

```bash
gsutil cors set cors.json gs://YOUR_BUCKET_NAME
```

## Option 2: Using the `gsutil` CLI (Recommended for Developers)

If you have the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed locally:

1.  Create a file named `cors.json` with the following content:
    ```json
    [
      {
        "origin": ["*"],
        "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
        "responseHeader": ["Content-Type", "x-goog-resumable"],
        "maxAgeSeconds": 3600
      }
    ]
    ```
2.  Run the following command in your terminal:
    ```bash
    gsutil cors set cors.json gs://turfarena-5564a.firebasestorage.app
    ```

## Why is this needed?

Browsers block cross-origin requests for security. When your app on `localhost:8081` tries to upload to Firebase Storage, it's considered a cross-origin request. Configuring CORS tells Firebase that it's safe to accept requests from your origins.
