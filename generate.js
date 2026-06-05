const admin = require('firebase-admin');
const fs = require('fs');

// Firebase కి కనెక్ట్ అవ్వడం
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createBundle() {
    try {
        console.log("🚀 బండిల్ తయారీ మొదలైంది... దయచేసి ఆగండి.");
        
        // Firestore నుండి డేటా తీసుకోవడం
        const querySnapshot = await db.collection('public_posts')
            .orderBy('timestamp', 'desc')
            .get();
        
        // బండిల్ బిల్డ్ చేయడం
        const bundle = db.bundle('latest-posts-bundle');
        const bundleBuffer = bundle.add('latest-posts', querySnapshot).build();

        // data.bundle ఫైల్ క్రియేట్ చేయడం
        fs.writeFileSync('data.bundle', bundleBuffer);
        
        console.log("✅ సక్సెస్! మీ 'data.bundle' ఫైల్ క్రియేట్ అయ్యింది.");
    } catch (error) {
        console.error("ఎర్రర్ వచ్చింది:", error);
    }
}
createBundle();