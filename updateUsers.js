import mongoose from 'mongoose';
import User from './models/user.js'; // Make sure the path is correct
import { connectToDB } from "./utils/database.js";

const addDescriptionToUsers = async () => {
  try {
    await connectToDB(); // Use your existing database connection logic
    await User.updateMany({}, { $set: { description: "Default description" } });
    console.log('All users updated');
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    mongoose.disconnect();
  }
};

addDescriptionToUsers();
