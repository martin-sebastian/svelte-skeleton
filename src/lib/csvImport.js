import PocketBase from 'pocketbase';
import fs from 'fs';
import csv from 'csv-parser';

const pb = new PocketBase('http://127.0.0.1:8090'); // Replace with your PocketBase URL

// Admin login function
async function login() {
	await pb.admins.authWithPassword('martin@martinsebastian.co', 'Nona@42506'); // Replace with your credentials
}

// CSV import function
export async function importCSV(csvFilePath, collectionName) {
	await login(); // Login to PocketBase as admin

	return new Promise((resolve, reject) => {
		const results = [];

		fs.createReadStream(csvFilePath) // Pass the path to your CSV file
			.pipe(csv())
			.on('data', async (row) => {
				try {
					// Create a new record in PocketBase collection
					await pb.collection(collectionName).create(row);
					results.push(row);
				} catch (error) {
					console.error('Error importing row:', row, error);
					reject(error);
				}
			})
			.on('end', () => {
				console.log('CSV file processed successfully');
				resolve(results); // Resolve with the processed data
			})
			.on('error', (error) => {
				console.error('Error reading CSV file:', error);
				reject(error);
			});
	});
}
