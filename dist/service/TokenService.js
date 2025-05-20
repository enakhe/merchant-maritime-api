"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToPinata = exports.uploadImageToPinata = exports.uploadSiteMap = exports.uploadMetadataToPinata = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const mime_types_1 = __importDefault(require("mime-types"));
const PINATA_API_KEY = "05bc94b4e632d1330a26";
const PINATA_SECRET_API_KEY = "a3cecb6777f320d0e8268d9436a03352d344832e63ad527f6628915fd2414ef4";
const uploadMetadataToPinata = (metadata) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
            throw new Error("Pinata API keys are missing from the environment variables.");
        }
        const metadataJSON = JSON.stringify(metadata);
        const form = new form_data_1.default();
        form.append("file", Buffer.from(metadataJSON), {
            filename: `${metadata.name}.json`,
            contentType: "application/json",
        });
        const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";
        const response = yield axios_1.default.post(pinataUrl, form, {
            headers: Object.assign(Object.assign({}, form.getHeaders()), { pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_SECRET_API_KEY }),
        });
        const ipfsHash = response.data.IpfsHash;
        const ipfsLink = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        return {
            ipfsHash,
            ipfsLink,
        };
    }
    catch (error) {
        throw new Error("Failed to upload metadata to Pinata");
    }
});
exports.uploadMetadataToPinata = uploadMetadataToPinata;
const uploadSiteMap = (sitemap) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
            throw new Error("Pinata API keys are missing from the environment variables.");
        }
        const form = new form_data_1.default();
        form.append("file", Buffer.from(sitemap), {
            filename: `sitemap.xml`,
            contentType: "application/xml",
        });
        const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";
        const response = yield axios_1.default.post(pinataUrl, form, {
            headers: Object.assign(Object.assign({}, form.getHeaders()), { pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_SECRET_API_KEY }),
        });
        const ipfsHash = response.data.IpfsHash;
        const ipfsLink = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
        return {
            ipfsHash,
            ipfsLink,
        };
    }
    catch (error) {
        throw new Error("Failed to upload sitemap to Pinata");
    }
});
exports.uploadSiteMap = uploadSiteMap;
const uploadImageToPinata = (image, filename) => __awaiter(void 0, void 0, void 0, function* () {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
        throw new Error("Pinata API keys are missing from the environment variables.");
    }
    const form = new form_data_1.default();
    const mimeType = mime_types_1.default.lookup(filename) || "application/octet-stream";
    form.append("file", image, {
        filename: filename,
        contentType: mimeType,
    });
    const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";
    const response = yield axios_1.default.post(pinataUrl, form, {
        headers: Object.assign(Object.assign({}, form.getHeaders()), { pinata_api_key: PINATA_API_KEY, pinata_secret_api_key: PINATA_SECRET_API_KEY }),
    });
    const ipfsHash = response.data.IpfsHash;
    const ipfsLink = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
    return {
        ipfsHash,
        ipfsLink,
    };
});
exports.uploadImageToPinata = uploadImageToPinata;
const uploadToPinata = (metadata, image, filename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ipfsHash: imageIpfsHash, ipfsLink: imageIpfsLink } = yield (0, exports.uploadImageToPinata)(image, filename);
        const metadataObj = {
            name: metadata.name,
            symbol: metadata.symbol,
            description: metadata.description,
            image: imageIpfsLink,
            external_url: metadata.website,
            attributes: [
                {
                    trait_type: "Website",
                    value: metadata.website
                },
                {
                    trait_type: "Twitter",
                    value: metadata.twitter
                },
                {
                    trait_type: "Telegram",
                    value: metadata.telegram
                }
            ]
        };
        const { ipfsHash: metadataIpfsHash, ipfsLink: metadataIpfsLink } = yield (0, exports.uploadMetadataToPinata)(metadataObj);
        return {
            metadataIpfsHash,
            metadataIpfsLink,
            imageIpfsHash,
            imageIpfsLink,
        };
    }
    catch (_a) {
        throw new Error("Failed to upload metadata");
    }
});
exports.uploadToPinata = uploadToPinata;
//# sourceMappingURL=TokenService.js.map