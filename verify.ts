import {
    IdentityClient,
    IdentityJson,
    VerifiableCredentialJson
  } from 'iota-is-sdk';
  import { readFileSync } from 'fs';
  import { config } from './config';
  
  //Verifies both credentials using IdentityClient, returns a pair of booleans as result
  export async function verify(credential1 : VerifiableCredentialJson, credential2: VerifiableCredentialJson) {
  
  
    
    const identityClient = new IdentityClient(config);
    

    const verified1 = await identityClient.checkCredential(credential1);
    const verified2 = await identityClient.checkCredential(credential2);
 
   
    return [verified1, verified2];
  
  }
  