
const ipfsClient = require('ipfs-http-client');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const signer = require('./sign');


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ encoded: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.render('signer_home');
});


app.post('/upload', async (req, res) => {

  //Recieve Username, NFT Name and NFT Content from the user 
  const file = req.files.nft;
  const nft = JSON.parse(file.data.toString('ascii'));
  const username = req.body.username;
  const nftName = req.body.nftName;
  const filePath = nftName + '.json';

  //Create artist DID and NFT credentials 
  const response = await signer.sign(username, nft);

  const identityString = JSON.stringify(response[0]).replace(/\\/g, '\\\\');
  const credentialString = JSON.stringify(response[1]);

  

  //Add the credential JSON to IPFS, get the corresponding IPFS hash 
  const fileHash = await addFile(filePath, credentialString);
  

  //Return the DID and the IPFS hash of the credential to the user
  res.render('signer_upload', { nftName, identityString, fileHash });


});



//Using IPFS Client,add the file to the IPFS and return hash
const addFile = async (filePath, credentialString) => {

  //IPFS Client 
  const ipfs = ipfsClient.create(
    {
      host: "ipfs.infura.io",
      port: 5001,
      protocol: "https"
    }
  );

  /* //IPFS Client (Local Daemon)
  const ipfs = ipfsClient.create(
    {
      host: "localhost",
      port: 5001,
      protocol: "https"
    }
  );
 */
  
  const fileAdded = await ipfs.add(credentialString);
  const fileHash = fileAdded.cid;

  return fileHash;
}

app.listen(3001, () => {
  console.log("App is listening on port 3001");
});


