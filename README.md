# pipeTutor
This application has been designed to fill a gap in the availability of technology for the furtherment of bagpipe musicians. Within the application you can create new tunes through audio and uses these for further practice. The application also gives the ability to share tunes with other registered users.

## Production Application
The production version of the application can be accessed by visiting the following URL
https://dissertation-feed8.web.app/

## Development Requirements
 - Firebase Environment
	 - Authentication (Local & Google)
	 - Functions
	 - Firestore
- Google cloud account
- Node
- NPM (Node Package Manager)
- Python 3*
- PiP
- A suitable IDE

## Installation

1. Clone this repository
2. Install dependencies

        npm install

3. Open the firebase.js file and amend the firebaseConfig object with your firebase keys
4. Deploy the functions within the services folder as Google Cloud Functions - [Deploy a Cloud Function | Cloud Functions Documentation | Google Cloud](https://cloud.google.com/functions/docs/deploy)
5. Update the function URLs within the firebase.js file
6. Run the application

        npm start
 
