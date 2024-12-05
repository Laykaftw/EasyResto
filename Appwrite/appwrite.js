import { Client, Account, ID, Avatars, Databases, Permission, Role, Query } from 'react-native-appwrite';

const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    projectId: '674edb6f00338a470b2c',
    databaseId: '674edeff00072e57c8d0',
    userCollectionId: "674edf1b00227aeaeab3",
    menusCollectionId: "674edf84001344fcaac3",
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

// Function to create a new user account and associated user document
export const createUser = async (Email, Password, Name, Role) => {
    try {
        // Create a new user account
        const newAccount = await account.create(ID.unique(), Email, Password, Name, Role);
        if (!newAccount) throw new Error('Account creation failed');

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

export const signIn = async (Email, Password) => {
    try {
        // Check if a session already exists

        const sessions = await account.listSessions();

        if (sessions.total > 0) {
            // Delete existing sessions before creating a new one
            await account.deleteSession('current');
        }

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

// Function to sign out the current user
export const logout = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        throw new Error('Logout failed: ' + error.message);
    }
};

// Function to create a new menu item
export const createMenuItem = async (name, description) => {
    try {
        const user = await account.get();

        const newMenuItem = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.menusCollectionId,
            ID.unique(),
            {
                name,
                description,
                createdBy: user.$id,
            }
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
        return response.documents;
    } catch (error) {
        throw new Error('Failed to fetch menu items: ' + error.message);
    }
};