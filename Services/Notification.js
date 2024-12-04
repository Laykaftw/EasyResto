import { databases, appwriteConfig } from '../Appwrite/appwrite';

export const sendPushNotificationToAll = async (message) => {
    const tokens = [];
    const response = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal('role', 'student')]
    );

    response.documents.forEach(doc => {
        const { expoPushToken } = doc;
        if (expoPushToken) {
            tokens.push(expoPushToken);
        }
    });

    const notifications = tokens.map(token => sendPushNotification(token, message));
    await Promise.all(notifications);
};

export const sendPushNotification = async (expoPushToken, message) => {
    const payload = {
        to: expoPushToken,
        sound: 'default',
        body: message,
        data: { message },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
};