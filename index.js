const { BlobServiceClient } = require("@azure/storage-blob");

const fileList = document.getElementById("file-list");
const fileInput = document.getElementById("file-input");
const upload = document.getElementById("upload");
const accountName = "guestbookreviews";
const sasString = "se=2021-06-10&sp=rwdlac&sv=2018-03-28&ss=b&srt=sco&sig=vds4LBqrkD0nCAOxLoT8bdtQcn0S1gt2hppBReI34xE%3D";

const photoContainer = "reviews";
const commentContainer = "post";

const imageUrlRoot = "https://guestbookreviews.blob.core.windows.net/reviews/";
const commentUrlRoot = "https://guestbookreviews.blob.core.windows.net/post/";
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasString}`);

const photosClient = blobServiceClient.getContainerClient(photoContainer);
const commentClient = blobServiceClient.getContainerClient(commentContainer);
const htmlList = [];
let photo;


const listFiles = async () => {
    try {
        let iter = commentClient.listBlobsFlat();
        let blobItem = await iter.next();
        fileList.innerHTML = '';
        while (!blobItem.done) {
            fileList.size += 1;
            const url = `${commentUrlRoot}${blobItem.value.name}`;
            const data = await getDataFromBlob(url);
            htmlList.push(data)
            blobItem = await iter.next();
        }
        while (htmlList.length) {
            const data = htmlList.pop();
            fileList.innerHTML += '<div class="mb-1 image-container"><a href="'+ data.photo + '" target="_blank"><img  class="image-dim" src="' + data.photo + '" alt=""></a><span>' + data.comment + '</span></div>';
        }
    } catch (error) {
        console.log(error);
    }
};

const uploadFiles = async () => {
    try {

        const imageBlockBlobClient = photosClient.getBlockBlobClient(photo.name);
        await imageBlockBlobClient.uploadBrowserData(photo);
        const commentBlockBlobClient = commentClient.getBlockBlobClient(`${new Date().toUTCString()}.json`);
        const comment = document.getElementById("myTextarea").value;
        const msg = {photo: `${imageUrlRoot}${photo.name}`, comment};
        const data = JSON.stringify(msg);
        const blobOptions = {
            // metadata: { 'contentType': 'application/json' }
        blobHTTPHeaders: {blobContentType: 'application/json'}
        };
        const uploadBlobResponse = await commentBlockBlobClient.upload(data, data.length, blobOptions);
        console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
        await listFiles();

    }
    catch (error) {
        console.log(error.message);
    }

}

function savePhoto() {
    photo = fileInput.files[0];
}

async function getDataFromBlob(url) {
    return await fetch(url).then(response => response.json());
}


fileInput.addEventListener("change", savePhoto);
upload.addEventListener("click", uploadFiles);

window.onload = (event) => {
    listFiles().then();
};
