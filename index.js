const { BlobServiceClient } = require("@azure/storage-blob");
// const azureStorage = require('azure-storage');


const fileList = document.getElementById("file-list");
const fileInput = document.getElementById("file-input");
const upload = document.getElementById("upload");
const accountName = "guestbookreviews";
const sasString = "se=2021-06-10&sp=rwdlac&sv=2018-03-28&ss=b&srt=sco&sig=vds4LBqrkD0nCAOxLoT8bdtQcn0S1gt2hppBReI34xE%3D";
const containerName = "reviews";
const imageUrlRoot = "https://guestbookreviews.blob.core.windows.net/reviews/";
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasString}`);
const containerClient = blobServiceClient.getContainerClient(containerName);
let photo;


// const blobService = azureStorage.createBlobService(accountName, accountKey);
// var Readable = require('stream').Readable
// var msg = {
//     a: "something",
//     b: "anotherthing"
// }
// var stream = new Readable
// stream.push(JSON.stringify(msg))
// stream.push(null)
// var option = {
//     contentSettings: {contentType: 'application/json'}
// }
// stream.pipe(blobService.createWriteStreamToBlockBlob('container', 'something.json', option, function onResponse(error, result) {
//     console.log("done")
// }));



const listFiles = async () => {
    try {
        let iter = containerClient.listBlobsFlat();
        let blobItem = await iter.next();
        while (!blobItem.done) {
            fileList.size += 1;
            console.log(blobItem);
            const url = `${imageUrlRoot}${blobItem.value.name}`;
            fileList.innerHTML +=
                '<div class="mb-1 image-container"><a href="'+ url + '" target="_blank"><img src="' + url + '" alt="" class="image"></a><span>' + blobItem.value.name + '</span></div>';
            blobItem = await iter.next();
        }
    } catch (error) {
        console.log(error);
    }
};

const uploadFiles = async () => {
    // try {
    //     const promises = [];
    //     for (const file of fileInput.files) {
    //         const blockBlobClient = containerClient.getBlockBlobClient(file.name);
    //         promises.push(blockBlobClient.uploadBrowserData(file));
    //     }
    //     await Promise.all(promises);
    //     await listFiles();
    // }
    // catch (error) {
    //     console.log(error.message);
    // }
    const blockBlobClient = containerClient.getBlockBlobClient("test.json");
    const comment = document.getElementById("myTextarea").value;
    const msg = {photo, comment};
    console.log(photo);
    const data = JSON.stringify(msg);
    const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
    console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
}

function savePhoto() {
    photo = fileInput.files[0];
}


fileInput.addEventListener("change", savePhoto);
upload.addEventListener("click", uploadFiles);

window.onload = (event) => {
    listFiles().then();
};
