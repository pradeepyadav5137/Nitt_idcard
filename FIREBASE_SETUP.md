# Transitioning from Local Storage to Cloud Firebase Storage

By default, this application stores uploaded files in the `backend/uploads` directory. To shift to Firebase Cloud Storage, follow these steps:

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click on "Add project" and follow the instructions to create a new project.
3. Once the project is created, navigate to **Build > Storage** in the left sidebar and click "Get started".
4. Choose your security rules (start in test mode for development) and select a location for your bucket.

## 2. Generate Service Account Credentials
1. In the Firebase Console, click on the **Project Settings** (gear icon) > **Service accounts**.
2. Click **Generate new private key**. This will download a JSON file containing your service account credentials.

## 3. Configure Environment Variables
Open your `.env` file in the `backend/` directory and add the following variables:

### A. GOOGLE_APPLICATION_CREDENTIALS_JSON
Open the downloaded JSON file, copy its entire content, and paste it as a single line (minify if necessary) into this environment variable.

```env
GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type": "service_account", "project_id": "your-project-id", ...}'
```

### B. FIREBASE_STORAGE_BUCKET
Find your bucket name in the Firebase Storage console (it usually looks like `your-project-id.appspot.com`).

```env
FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
```

## 4. Restart the Backend
Once these environment variables are set, the backend will automatically detect them. The `initFirebase()` function in `backend/config/firebase.js` will initialize the Firebase Admin SDK, and `saveFile` in `backend/controllers/applicationController.js` will start uploading files to Firebase instead of the local folder.

## 5. Verification
1. Submit a new application.
2. Check the Firebase Console > Storage to see if the files are being uploaded under the `applications/` path.
3. In the Admin Panel, document links should now point to Firebase Signed URLs instead of local paths.

---

**Note:** Existing files stored locally will not be automatically migrated to Firebase. You would need to manually upload them to the same path structure in Firebase if you want them to be accessible after the switch.
