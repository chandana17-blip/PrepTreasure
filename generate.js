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
        
        // 1. పబ్లిక్ పోస్ట్స్ (ఆర్టికల్స్) తీసుకోవడం
        const postsSnapshot = await db.collection('public_posts')
            .orderBy('timestamp', 'desc')
            .get();
        
        // 2. లెసన్స్, ఎక్సర్‌సైజెస్ తీసుకోవడం
        const topicsSnapshot = await db.collection('topics').get();

        // 3. మాక్ టెస్ట్‌లు తీసుకోవడం
        const mockTestsSnapshot = await db.collection('mockTests').get();
        
        // బండిల్ బిల్డ్ చేయడం
        const bundle = db.bundle('preptreasure-bundle');
        
        bundle.add('latest-posts', postsSnapshot);
        bundle.add('all-topics', topicsSnapshot);
        bundle.add('all-mock-tests', mockTestsSnapshot);

        const bundleBuffer = bundle.build();

        // data.bundle ఫైల్ క్రియేట్ చేయడం
        fs.writeFileSync('data.bundle', bundleBuffer);
        
        console.log("✅ సక్సెస్! మీ 'data.bundle' ఫైల్ అప్‌డేట్ అయ్యింది.");
    } catch (error) {
        console.error("ఎర్రర్ వచ్చింది:", error);
    }
}

createBundle();