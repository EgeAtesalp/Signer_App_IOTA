const ipfsClient = require('ipfs-http-client');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const verifier = require('./verify');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ encoded: true }));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.render('verifier_home');
});


app.post('/upload', async (req, res) => {

  //Recieve the hashes from the user
  const hash1 = req.body.hash1;
  const hash2 = req.body.hash2;

  //Using the hashes, get the Credentials of the NFTS
  const file1 = await getFile(hash1);
  const file2 = await getFile(hash2);


  //Verify the authenticity of the credentials
  const verificationResults = verifier.verify(file1, file2);

  //If not succesfully verified, inform the user
  if ((verificationResults[0] === false || verificationResults[1] === false)) {
    const resultText = "One of the credentials can not be succesfully authenticated. Comparison is not possible.";
    res.render('verifier_upload_unsuccessful', { resultText });

    //If succesfully verified,compare the dates, show user the result
  } else {
    const result = compareDates(await file1, await file2);
    const resultText = result[0];
    const firstDate = result[1];
    const secondDate = result[2];
    res.render('verifier_upload_successful', { resultText, firstDate, secondDate });
  }
});


//Get the JSON file with its IFPS Hash
const getFile = async (IFPSHash) => {

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

  let fileitr = ipfs.cat(IFPSHash);
  let data;
  for await (const itr of fileitr) {
    data = Buffer.from(itr).toString()
    console.log(data)
  }

  return JSON.parse(data);
}


//Compares the issuance dates of 2 different credentials(JSON)
const compareDates = (file1, file2) => {
  const date1 = file1.issuanceDate
  const date2 = file2.issuanceDate
  let responseText;

  if (date2 > date1) {
    responseText = "First NFT was signed earlier.";
  } else if (date2 < date1) {
    responseText = "Second NFT was signed earlier.";
  } else {
    responseText = "They have the same issuance dates.";
  }

  return [responseText, date1, date2]

}

app.listen(3001, () => {
  console.log("App is listening on port 3001");

});

//https://ipfs.io/ipfs/QmbeWwXDg6TWPXSFzJ6bpUNaeF8VprmvhLST5E9k7nMKPE
//https://ipfs.io/ipfs/Qme94rp5WQRsmptMXkD4vjjf2QNBXUKBH2CBd7AAqn6etP