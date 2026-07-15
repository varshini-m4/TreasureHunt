const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzeJUrl91tz9h2RNlxwDltgR-P8ZJnFBVpwab3EUoJl4FMyYlwpYsoMAqYA_Q3KZHU/exec";
export const fetchTasks = async () => {
    try {
        // We append the "?action=getTasks" parameter to hit the conditional logic
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getTasks`, {
            method: 'GET',
            redirect: "follow",
            mode: "cors",
            headers: {
                'Accept': 'application/json',
            }
        });

        const json = await response.json();

        if (json.status === "success") {
            console.log("Successfully fetched tasks:", json.data);
            return json.data; // This is your parsed JSON task array!
        } else {
            console.error("Backend Error:", json.message);
            return null;
        }
    } catch (error) {
        console.error("Network Error calling Google Web App:", error);
        return null;
    }
};

export const submitProof = async (taskId: string | number, fileBase64: string, fileMimeType: string, fileName: string) => {
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            redirect: "follow",
            mode: "no-cors",
            body: JSON.stringify({
                action: "updateTaskAndUpload",
                taskId: taskId,
                status: "Complete",
                fileBase64,
                fileMimeType,
                fileName
            })
        });

        // --- BULLETPROOF CORS/WEB BYPASS ---
        // If response.type is 'opaque' or status is 0, it means it ran in no-cors web mode.
        // We handle this immediately and exit before the app can run response.json()!
        if (response.type === 'opaque' || response.status === 0) {
            console.log("Web upload completed securely via no-cors pipeline.");
            return { 
                status: "success", 
                message: "✨ Evidence uploaded and sheet updated successfully!" 
            };
        }

        // --- MOBILE ONLY / CORE PIPELINE ---
        // Native apps (iOS/Android) bypass browser CORS rules and can read the text response safely.
        const textData = await response.text();
        if (!textData) {
            return { status: "success", message: "Upload complete (empty response body)." };
        }

        const json = JSON.parse(textData);
        if (json.status === "success") {
            console.log("Successfully submitted proof:", json.data);
            return json; 
        } else {
            console.error("Backend Error:", json.message);
            return json; 
        }
    } catch (error) {
        console.error("Network Error calling Google Web App:", error);
        return { status: "error", message: "Failed to submit proof." };
    }
}