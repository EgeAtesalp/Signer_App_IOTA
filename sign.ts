import {
  IdentityClient, CredentialTypes, UserType,
  IdentityJson
} from 'iota-is-sdk';
import { readFileSync } from 'fs';
import { config } from './config';

//"$ npm run createSignerIdentity " to create signerIdentity.json if it doesnt exists


//Using the signerIdentity.json, creates a new DID for the artist,
//signs and create credentials for the NFT, and returns both the DID and the credentials
export async function sign(artistUsername: string, NFT: JSON) {

   //Read the signer DID (signerIdentity.json) from local directory, get its public credentials to create NFT Credential
  const identityClient = new IdentityClient(config);
  const signerIdentity = JSON.parse(readFileSync('./signerIdentity.json').toString()) as IdentityJson;
  await identityClient.authenticate(signerIdentity.doc.id, signerIdentity.key.secret);
  const signerIdentityPublic = await identityClient.find(signerIdentity.doc.id);
  const identityCredential = signerIdentityPublic?.verifiableCredentials?.[0];

  //Create Artist DID and Credentials, using the public credentials of the signer
  const artistIdentity = await identityClient.create(artistUsername) as IdentityJson;
  const artistCredential = await identityClient.createCredential(
    identityCredential,
    artistIdentity?.doc?.id,
    CredentialTypes.BasicIdentityCredential,
    UserType.Product,
    {
      Image: NFT
    }
  );

  //return the Artist DID and Credential
  return [artistIdentity, artistCredential];

}
