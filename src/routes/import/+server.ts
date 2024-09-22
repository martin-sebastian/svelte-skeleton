import { json } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import { XMLParser } from 'fast-xml-parser'; // Use fast-xml-parser for server-side parsing

const pb = new PocketBase('http://127.0.0.1:8090');

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
	try {
		const imageIds = [];
		const attributeIds = [];

		// Process each image and create/update records in vehicle_images collection
		for (const image of vehicle.images) {
			// Check if the imageurl is valid
			if (isValidURL(image.imageurl)) {
				console.log('Inserting image:', image.imageurl);
				const existingImage = await pb
					.collection('vehicle_images')
					.getFirstListItem(`imageurl="${image.imageurl}"`)
					.catch(() => null); // Catch if no image exists

				let imageRecord;
				if (existingImage) {
					// Update existing image
					imageRecord = await pb
						.collection('vehicle_images')
						.update(existingImage.id, { imageurl: image.imageurl });
				} else {
					// Create new image
					imageRecord = await pb.collection('vehicle_images').create({ imageurl: image.imageurl });
				}
				imageIds.push(imageRecord.id); // Collect the record ID
			} else {
				console.warn(`Invalid or missing image URL for vehicle: ${vehicle.stock_number}`);
			}
		}

		// Process each attribute and create/update records in vehicle_attributes collection
		for (const attribute of vehicle.attributes) {
			const existingAttribute = await pb
				.collection('vehicle_attributes')
				.getFirstListItem(`name="${attribute.name}" AND value="${attribute.value}"`)
				.catch(() => null); // Catch if no attribute exists

			let attributeRecord;
			if (existingAttribute) {
				// Update existing attribute
				attributeRecord = await pb
					.collection('vehicle_attributes')
					.update(existingAttribute.id, { name: attribute.name, value: attribute.value });
			} else {
				// Create new attribute
				attributeRecord = await pb
					.collection('vehicle_attributes')
					.create({ name: attribute.name, value: attribute.value });
			}
			attributeIds.push(attributeRecord.id); // Collect the record ID
		}

		return { imageIds: imageIds || [], attributeIds: attributeIds || [] };
	} catch (error) {
		console.error('Error updating images or attributes:', error);
	}
}

// Function to update vehicle data
async function updateVehicle(vehicle, recordId) {
	try {
		const { imageIds, attributeIds } = await updateImagesAndAttributes(vehicle);

		const vehicleData = {
			webid: vehicle.webid,
			title: vehicle.title,
			link: vehicle.link,
			description: vehicle.description,
			price: vehicle.price,
			price_type: vehicle.price_type,
			stock_number: vehicle.stock_number,
			vin: vehicle.vin,
			manufacturer: vehicle.manufacturer,
			year: vehicle.year,
			color: vehicle.color,
			model_type: vehicle.model_type,
			model_name: vehicle.model_name,
			condition: vehicle.condition,
			usage: vehicle.usage,
			location: vehicle.location,
			date_updated: vehicle.date_updated,
			metric_type: vehicle.metric_type,
			metric_value: vehicle.metric_value,
			vehicle_images: imageIds,
			vehicle_attributes: attributeIds
		};

		const record = await pb.collection('vehicles').update(recordId, vehicleData);
		console.log(`Vehicle updated: ${record.id}`);
	} catch (error) {
		console.error('Error updating vehicle:', error);
	}
}

// Function to create a new vehicle
async function createVehicle(vehicle) {
	try {
		const { imageIds, attributeIds } = await updateImagesAndAttributes(vehicle);

		const vehicleData = {
			webid: vehicle.webid,
			title: vehicle.title,
			link: vehicle.link,
			description: vehicle.description,
			price: vehicle.price,
			price_type: vehicle.price_type,
			stock_number: vehicle.stock_number,
			vin: vehicle.vin,
			manufacturer: vehicle.manufacturer,
			year: vehicle.year,
			color: vehicle.color,
			model_type: vehicle.model_type,
			model_name: vehicle.model_name,
			condition: vehicle.condition,
			usage: vehicle.usage,
			location: vehicle.location,
			date_updated: vehicle.date_updated,
			metric_type: vehicle.metric_type,
			metric_value: vehicle.metric_value,
			vehicle_images: imageIds,
			vehicle_attributes: attributeIds
		};

		const record = await pb.collection('vehicles').create(vehicleData);
		console.log(`Vehicle created: ${record.id}`);
	} catch (error) {
		console.error('Error creating vehicle:', error);
	}
}

// Function to insert or update vehicles into PocketBase
async function insertOrUpdateVehiclesToPocketBase(vehicles) {
	for (const vehicle of vehicles) {
		try {
			// Check if the vehicle exists
			const existingVehicle = await pb
				.collection('vehicles')
				.getFirstListItem(`stock_number="${vehicle.stock_number}"`);

			if (existingVehicle) {
				// Update existing vehicle
				await updateVehicle(vehicle, existingVehicle.id);
			} else {
				// Create new vehicle
				await createVehicle(vehicle);
			}
		} catch (error) {
			console.error(
				`Error inserting/updating vehicle with stock number ${vehicle.stock_number}:`,
				error
			);
		}
	}
}

// Simple URL validation function
function isValidURL(url) {
	try {
		new URL(url);
		return true;
	} catch (error) {
		return false;
	}
}

// Main function to handle the import
async function importXMLToPocketBase() {
	try {
		const xmlDoc = await fetchAndParseXML();
		const vehicles = mapXMLToVehicleData(xmlDoc);
		await insertOrUpdateVehiclesToPocketBase(vehicles);
		console.log('Import completed successfully.');
	} catch (error) {
		console.error('Error during import:', error);
	}
}

// GET method to trigger the import
export async function GET() {
	try {
		await importXMLToPocketBase();
		return json({ message: 'Import completed successfully.' });
	} catch (error) {
		console.error('Import failed', error);
		return json({ message: 'Import failed.' }, { status: 500 });
	}
}
