import { Client, Account, ID, Avatars, Databases, Permission, Role, Storage, Query } from 'react-native-appwrite';

const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: '674edb6f00338a470b2c',
    databaseId: '674edeff00072e57c8d0',
    userCollectionId: "674edf1b00227aeaeab3",
    menusCollectionId: "674edf84001344fcaac3",
    ordersCollectionId: "674f388700021bfad063",
    storageId: '674f12ed000cd761dec1'
}

// Initialize the Appwrite client
const client = new Client();
client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

// Initialize Appwrite services
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Function to create a new user account and associated user document
export const createUser = async (Email, Password, Name, Role) => {
    try {
        // Create a new user account
        console.log(Role)
        const newAccount = await account.create(ID.unique(), Email, Password, Name);
        if (!newAccount) throw new Error('Account creation failed');

        // Check if a session already exists
        const sessions = await account.listSessions();

        if (sessions.total > 0) {
            // Delete existing sessions before creating a new one
            await account.deleteSession('current');
        }

        // Log the user in
        await account.createEmailPasswordSession(Email, Password);

        // Generate an avatar URL using the user's initials
        const avatarUrl = avatars.getInitials(Name).toString();

        // Create a user document in the users collection
        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                ID: newAccount.$id,
                Email,
                Name,
                Role,
                Avatar: avatarUrl,
            },
            // [
            //     Permission.read(Role.user(newAccount.$id)),
            //     Permission.update(Role.user(newAccount.$id)),
            //     Permission.delete(Role.user(newAccount.$id)),
            // ]
        );

        return newAccount;

    } catch (error) {
        throw new Error(error.message);
    }
};

export const getSessions = async () => {
    try {
        const sessions = await account.listSessions();
        return sessions;
    } catch (error) {
        throw new Error('Failed to get sessions: ' + error.message);
    }
}

export const signIn = async (Email, Password) => {
    try {
        // Check if a session already exists
        // const sessions = await account.listSessions();

        // if (sessions.total > 0) {
        //     // Delete existing sessions before creating a new one
        //     await account.deleteSession('current');
        // }

        // Create a new session
        const session = await account.createEmailPasswordSession(Email, Password);
        return session;
    } catch (error) {
        throw new Error('Sign-in failed: ' + error.message);
    }
};

export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        return user; // This includes labels
    } catch (error) {
        throw new Error('Failed to get user: ' + error.message);
    }
};

export const getCurrentProfile = async () => {
    try {
        const currentAccount = await account.get()
        if (!currentAccount) throw new Error("No account found");

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('ID', currentAccount.$id)]
        );
        if (!currentUser) throw new Error("No user found");


        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function getFilePreview(fileId) {
    try {
        const fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId).toString();
        if (!fileUrl) throw new Error('Invalid file URL');
        return fileUrl;
    } catch (error) {
        console.error('Error fetching file preview:', error.message);
        return null; // Return null to handle cases where the URL cannot be fetched
    }
}

export const updateUserProfile = async ({ name, email }) => {
    try {
        const user = await getCurrentProfile();
        const userId = user.$id;
        const avatar = avatars.getInitials(name).toString();
        await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId,
            {
                Name: name,
                Email: email,
                Avatar: avatar,
            }
        );
    } catch (error) {
        throw new Error('Failed to update user profile: ' + error.message);
    }
};

// Function to sign out the current user
export const logout = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        throw new Error('Logout failed: ' + error.message);
    }
};

// export const uploadFile = async (fileUri) => {
//     try {
//         // Extract the file name from the URI
//         const fileName = fileUri.split('/').pop();
//         console.log(fileUri)
//         // Determine the file type (adjust as needed)
//         const fileType = 'image/jpeg'; // Or use a library to determine the MIME type

//         // Create a File object
//         const file = {
//             uri: fileUri,
//             name: fileName,
//             type: fileType,
//         };

//         // Upload the file
//         const response = await storage.createFile(
//             appwriteConfig.storageId,
//             ID.unique(),
//             file
//         );
//         console.log('File uploaded:', response);
//         return response;
//     } catch (error) {
//         console.error('Upload Error:', error);
//         throw new Error('Failed to upload file: ' + error.message);
//     }
// };

export const uploadFile = async (file) => {
    if (!file) return;

    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };

    try {
        const user = await getCurrentUser();
        const userId = user.$id;

        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            asset,
            // [
            //     Permission.read(Role.guests()),  // Allow unauthenticated users to read
            //     Permission.read(Role.users()),   // Allow authenticated users to read
            //     Permission.update(Role.user(userId)), // Allow the current user to update
            //     Permission.delete(Role.user(userId)), // Allow the current user to delete
            // ]
        );

        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            uploadedFile.$id,
            2000,
            2000,
            "top",
            100
        );
        return fileUrl;
    } catch (error) {
        console.error('Upload Error:', error);
        throw new Error('Failed to upload file: ' + error.message);
    }
};

// Update the createMenuItem function to accept imageId
export const createMenuItem = async (MenuName, image, ServeDate) => {
    try {
        const MenuImage = await uploadFile(image)
        console.log(MenuImage)
        const newMenuItem = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menusCollectionId,
            ID.unique(),
            {
                MenuName,
                MenuImage,
                ServeDate
            },
            // [
            //     Permission.read(Role.guests()),  // Allow guests to read the menu item
            //     Permission.read(Role.users()),   // Allow authenticated users to read
            //     Permission.update(Role.user(userId)),
            //     Permission.delete(Role.user(userId)),
            // ]
        );

        return newMenuItem;
    } catch (error) {
        throw new Error('Failed to create menu item: ' + error.message);
    }
};

// Function to fetch all menu items
export const getMenuItems = async () => {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menusCollectionId
        );
        // console.log("Docs: ",response.documents)
        return response.documents;

    } catch (error) {
        throw new Error('Failed to fetch menu items: ' + error.message);
    }
};

export const updateMenuItem = async (menuItemId, data) => {
    try {
        return await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menusCollectionId,
            menuItemId,
            data
        );
    } catch (error) {
        console.error('Error updating menu item:', error);
        throw error;
    }
};

// Function to delete a menu item
export const deleteMenuItem = async (menuItemId) => {
    try {
        console.log(menuItemId)
        return await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menusCollectionId,
            menuItemId
        );
    } catch (error) {
        console.error('Error deleting menu item:', error);
        throw error;
    }
};

export const createOrder = async (selectedItems) => {
    try {
        const user = await getCurrentUser();
        const orderData = {
            userId: user.$id,
            menuId: selectedItems[0]?.$id, // Assuming selectedItems is an array and you're selecting the first item
            PurchaseDate: new Date().toISOString(),
        };
        console.log(orderData.userId);
        const response = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.ordersCollectionId,
            ID.unique(),
            orderData
        );
        return response;
    } catch (error) {
        throw new Error('Failed to create order: ' + error.message);
    }
};








