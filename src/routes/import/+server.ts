import { json } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { XMLParser } from 'fast-xml-parser';
import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';

// Initialize PocketBase client with auto-cancellation disabled
const pb = new PocketBase('http://127.0.0.1:8090');
pb.autoCancellation(false);

// Function to fetch and parse XML
async function fetchAndParseXML() {
	const response = await fetch('https://www.flatoutmotorcycles.com/unitinventory_univ.xml');
	const xmlText = await response.text();

	const parser = new XMLParser();
	const xmlDoc = parser.parse(xmlText);
	console.log('Parsed XML:', xmlDoc);
	return xmlDoc;
}

// Function to map XML data to vehicle data
function mapXMLToVehicleData(xmlDoc) {
	const vehicles = [];
	const items = xmlDoc.feed?.item || [];

	for (const item of items) {
		const vehicle = {
			webid: item.id,
			title: item.title,
			link: item.link,
			description: item.description,
			price: parseFloat(item.price) || 0,
			price_type: item.price_type,
			stock_number: item.stocknumber,
			vin: item.vin,
			manufacturer: item.manufacturer,
			year: item.year,
			color: item.color,
			model_type: item.model_type,
			model_name: item.model_name,
			condition: item.condition,
			usage: item.usage,
			location: item.location,
			date_updated: item.updated,
			metric_type: item.metric_type,
			metric_value: item.metric_value,
			images: Array.isArray(item.images?.imageurl)
				? item.images.imageurl.map((url) => ({ imageurl: url }))
				: item.images?.imageurl
					? [{ imageurl: item.images.imageurl }]
					: [],
			attributes: Array.isArray(item.attributes?.attribute)
				? item.attributes.attribute.map((attr) => ({ name: attr.name, value: attr.value }))
				: item.attributes?.attribute && item.attributes.attribute.name
					? [{ name: item.attributes.attribute.name, value: item.attributes.attribute.value }]
					: []
		};
		vehicles.push(vehicle);
	}
	return vehicles;
}

// Function to create or update images and attributes for a vehicle
async function updateImagesAndAttributes(vehicle) {
	// Your existing logic for updating images and attributes
}

// Function to update vehicle data
async function updateVehicle(vehicle, recordId) {
	// Your existing logic for updating vehicle
}

// Function to create a new vehicle
async function createVehicle(vehicle) {
	// Your existing logic for creating vehicle
}

// Function to insert or update vehicles into PocketBase
async function insertOrUpdateVehiclesToPocketBase(vehicles) {
	// Your existing logic for inserting or updating vehicles
}

// Function to handle XML import to PocketBase for vehicles
async function importXMLToPocketBase() {
	try {
		const xmlDoc = await fetchAndParseXML();
		const vehicles = mapXMLToVehicleData(xmlDoc);
		await insertOrUpdateVehiclesToPocketBase(vehicles);
		console.log('XML Import for vehicles completed successfully.');
	} catch (error) {
		console.error('Error during XML import for vehicles:', error);
	}
}

// CSV Import Function for Parts
async function importCSVForParts() {
	const csvFilePath = path.join(process.cwd(), 'src/routes/import/csv/BRP-Parts-Data.csv'); // Path to your CSV file
	const results: any[] = [];
	const errors: any[] = [];

	// Limit the number of concurrent requests
	const concurrencyLimit = 10; // Adjust the number of concurrent requests
	let activeRequests = 0;
	const queue: (() => Promise<void>)[] = [];

	// Helper function to handle queue processing
	const processQueue = async () => {
		while (queue.length > 0 && activeRequests < concurrencyLimit) {
			const task = queue.shift();
			if (task) {
				activeRequests++;
				await task();
				activeRequests--;
			}
		}
	};

	return new Promise((resolve, reject) => {
		fs.createReadStream(csvFilePath)
			.pipe(csv())
			.on('data', (row) => {
				const task = async () => {
					try {
						// Create or update a record in the 'parts' collection
						await pb.collection('parts').create(row);
						results.push(row);
					} catch (error) {
						console.error('Error importing CSV row:', row, error);
						errors.push({ row, error: error.message });
					}
				};
				queue.push(task);
				processQueue(); // Start processing the queue
			})
			.on('end', () => {
				// Process the remaining queue after reading the file
				const checkQueueCompletion = setInterval(() => {
					if (queue.length === 0 && activeRequests === 0) {
						clearInterval(checkQueueCompletion);
						console.log('CSV import for parts finished successfully.');
						resolve({ results, errors });
					}
				}, 100);
			})
			.on('error', (error) => {
				console.error('Error reading CSV file:', error);
				reject(error);
			});
	});
}

// Main POST method to handle CSV (parts) import and XML import
export async function POST({ request }: { request: any }) {
	try {
		const { type } = await request.json();

		if (type === 'csv') {
			// Handle CSV import for parts
			const importedData = await importCSVForParts();
			return json({ message: 'CSV import for parts completed successfully.', importedData });
		} else if (type === 'xml') {
			// Handle XML import for vehicles
			await importXMLToPocketBase();
			return json({ message: 'XML import for vehicles completed successfully.' });
		} else {
			return json({ message: 'Invalid import type provided.' }, { status: 400 });
		}
	} catch (error) {
		console.error('Import failed', error);
		return json({ message: 'Import failed.', error: error.message }, { status: 500 });
	}
}
