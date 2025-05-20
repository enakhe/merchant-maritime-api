import axios from "axios";
import FormData from "form-data";
import mime, { extension } from "mime-types";

const PINATA_API_KEY = "05bc94b4e632d1330a26";
const PINATA_SECRET_API_KEY =
	"a3cecb6777f320d0e8268d9436a03352d344832e63ad527f6628915fd2414ef4";

interface Metadata {
	name: string;
	[key: string]: any;
}

// export const uploadMetadataToPinata = async (metadata: Metadata) => {
// 	try {
// 		if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
// 			throw new Error(
// 				"Pinata API keys are missing from the environment variables."
// 			);
// 		}

// 		const metadataJSON = JSON.stringify(metadata);
// 		const form = new FormData();
// 		form.append("file", Buffer.from(metadataJSON), {
// 			filename: `${metadata.name}.json`,
// 			contentType: "application/json",
// 		});

// 		const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

// 		const response = await axios.post(pinataUrl, form, {
// 			headers: {
// 				...form.getHeaders(),
// 				pinata_api_key: PINATA_API_KEY,
// 				pinata_secret_api_key: PINATA_SECRET_API_KEY,
// 			},
// 		});

// 		const ipfsHash = response.data.IpfsHash;
// 		const ipfsLink = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
// 		return {
// 			ipfsHash,
// 			ipfsLink,
// 		};
// 	} catch (error) {
// 		throw new Error("Failed to upload metadata to Pinata");
// 	}
// };

// export const uploadSiteMap = async (sitemap: string) => {
// 	try {
// 		if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
// 			throw new Error(
// 				"Pinata API keys are missing from the environment variables."
// 			);
// 		}

// 		const form = new FormData();
// 		form.append("file", Buffer.from(sitemap), {
// 			filename: `sitemap.xml`,
// 			contentType: "application/xml",
// 		});

// 		const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

// 		const response = await axios.post(pinataUrl, form, {
// 			headers: {
// 				...form.getHeaders(),
// 				pinata_api_key: PINATA_API_KEY,
// 				pinata_secret_api_key: PINATA_SECRET_API_KEY,
// 			},
// 		});

// 		const ipfsHash = response.data.IpfsHash;
// 		const ipfsLink = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
// 		return {
// 			ipfsHash,
// 			ipfsLink,
// 		};
// 	} catch (error) {
// 		throw new Error("Failed to upload sitemap to Pinata");
// 	}
// };

export const uploadImageToPinata = async (image: Buffer, filename: string) => {
	if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
		throw new Error(
			"Pinata API keys are missing from the environment variables."
		);
	}

	const form = new FormData();
	const mimeType = mime.lookup(filename) || "application/octet-stream";
	form.append("file", image, {
		filename: filename,
		contentType: mimeType,
	});

	const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

	const response = await axios.post(pinataUrl, form, {
		headers: {
			...form.getHeaders(),
			pinata_api_key: PINATA_API_KEY,
			pinata_secret_api_key: PINATA_SECRET_API_KEY,
		},
	});

	const ipfsHash = response.data.IpfsHash;
	const ipfsLink = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
	return {
		ipfsHash,
		ipfsLink,
	};
};

// export const uploadToPinata = async (
// 	metadata: Metadata,
// 	image: Buffer,
// 	filename: string
// ) => {
// 	try {
// 		const { ipfsHash: imageIpfsHash, ipfsLink: imageIpfsLink } =
// 			await uploadImageToPinata(image, filename);

// 		const metadataObj = {
// 			name: metadata.name,
// 			symbol: metadata.symbol,
// 			description: metadata.description,
// 			image: imageIpfsLink,
// 			external_url: metadata.website,
// 			attributes: [
// 				{
// 					trait_type: "Website",
// 					value: metadata.website
// 				},
// 				{
// 					trait_type: "Twitter",
// 					value: metadata.twitter
// 				},
// 				{
// 					trait_type: "Telegram",
// 					value: metadata.telegram
// 				}
// 			]
// 		};

// 		const { ipfsHash: metadataIpfsHash, ipfsLink: metadataIpfsLink } =
// 			await uploadMetadataToPinata(metadataObj);

// 		return {
// 			metadataIpfsHash,
// 			metadataIpfsLink,
// 			imageIpfsHash,
// 			imageIpfsLink,
// 		};
// 	}
// 	catch {
// 		throw new Error("Failed to upload metadata")
// 	}
// };

