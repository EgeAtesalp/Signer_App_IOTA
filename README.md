# IOTA Programming Assignment

This assignment has two applications: signer and verifier. 
## Signer
Signer takes username, NFT username and NFT (for this assignment, a very simple JSON document [nft_example.json](./nft_example.json) is used as a placeholder NFT), and creates a DID for the artist and a IFPS hash links to the signed credential.

## Verifier
Verifier takes the IPFS hashes of two NFT credentials, checks if the credentials can be  authenticated, and compare their issuance date to verify which NFT credential was issued earlier.

## Architecture
General architecture of the solution is illustrated in the diagram below.

![Architecture Diagram](/diagrams/Architecture-Diagram.png "Optional Title")


## Installation and Configuration

Use [npm](https://www.npmjs.com/) to install the package.

```bash
npm install 
```
This implementation uses a [local docker-compose](https://wiki.iota.org/integration-services/getting_started/installation/docker_compose) setup for the IOTA Integration Service API. See [config.ts](./config.ts)

![Docker API's](screenshots/DockerAPI.png "Optional Title")

## Usage

```bash
# Run createSignerIdentity.ts to create a 
# signerIdentity.json file, which will be 
# used by signer.js 

npm run createSignerIdentity

# Run signer.js app

npm run signer

# Run verifier.js app

npm run verifier
```
Both applications run at [http://localhost:3001/](http://localhost:3001/) by default.

## Screenshots
![Signer Home](/screenshots/Signer_Home.png "Optional Title")
![Signer Upload](/screenshots/Signer_Upload.png "Optional Title")
![Verifier Home](/screenshots/Verifier_Home.png "Optional Title")
![Verifier Upload](/screenshots/Verifier_Upload.png "Optional Title")


## Known Issues

I was unable to get in communication with the team regarding the technical questions I had about the assignment, mostly questions around the concept of signature. In the assignment, I am told to append a signature to the file that represents the NFT, and the VerifiableCredentialJson object does have a signature value , however I couldnt find a way to access to the rest of the credential using the signature value (by some search/find API), which meant that I couldnt successfully authenticate a NFT using the signature value alone. I chose to use the VerifiableCredentialJson Object as the signed NFT, since it contains the NFT file itself as part of the JSON Object. That is probably not the correct way to do it, and I would be happy to correct it if given more clarification.

I also did not clearly understand what was asked of me regarding the SW-Diagrams. I have experience from university with creating SW-Diagrams that visulize the high-level architecture and dependencies of a solution, which is what I tried to do. However, for the other requested diagram, "provide a diagram of the deployed infrastructure, showing the service you are using, the ones you deployed (if any) and their IP addresses.", I couldn't exactly understand what was asked from me. I would also be very happy to come up with a infrastructure-diagram if someone can clarify it.
