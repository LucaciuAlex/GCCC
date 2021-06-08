const { BlobServiceClient } = require("@azure/storage-blob");

const listButton = document.getElementById("listButton");
const fileList = document.getElementById("file-list");

const accountName = "guestbookreviews";
const sasString = "se=2021-06-10&sp=rwdlac&sv=2018-03-28&ss=b&srt=sco&sig=vds4LBqrkD0nCAOxLoT8bdtQcn0S1gt2hppBReI34xE%3D";
const accessKey = "OpXrkY1291nZ7C289q2ZD/KyKQ9sNYW1bgkSzQcKlF84AMtCtGxQrvH1rslkcJSEK+LFvS9viXtnwRF3DbdmKw=="
const containerName = "reviews";
const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=guestbookreviews;AccountKey=OpXrkY1291nZ7C289q2ZD/KyKQ9sNYW1bgkSzQcKlF84AMtCtGxQrvH1rslkcJSEK+LFvS9viXtnwRF3DbdmKw==;EndpointSuffix=core.windows.net'

const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasString}`);

const listFiles = async () => {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    try {
        let iter = containerClient.listBlobsFlat();
        let blobItem = await iter.next();
        while (!blobItem.done) {
            fileList.size += 1;
            console.log(blobItem);
            // fileList.innerHTML += <option>${blobItem.value.name}</option>;
            blobItem = await iter.next();
        }
        if (fileList.size > 0) {
            console.log("Done");
        } else {
            console.log("Not");

        }
    } catch (error) {
        console.log(error);
    }
};

listFiles().then(() => console.log('Done')).catch((ex) => console.log(ex.message));