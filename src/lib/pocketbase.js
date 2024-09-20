// src/lib/pocketbase.js
import PocketBase from 'pocketbase';

// Initialize and export the PocketBase client
const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your PocketBase URL
export default pb;
