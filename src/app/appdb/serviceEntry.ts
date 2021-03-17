/**
 * Digital Archive API
 * An interface to distributed nodes for personal storage. An account holder is referred to as an amigo, and content can be shared and referenced by labels. The following custom formatk types will be used throughout the API secure-token - hex encoded 256 bit random number pass-token - hex encoded 32 bit random number amigo-id - hex encoded sha256 of an amigo 4096 public key label-id - uuid without the dashes attribute-id - uuid without the dashes attribute-key - hex encoded sha256 of attribute schema alert-id - uuid without the dashes config-id - system defined strings prompt-id - uuid without the dashes answer-id - uuid without the dashes subject-id - uuid without the dashes subject-key - hex encoded sha256 of subject schema asset-id - uuid without the dashes ref-id - uuid without the dashes amigo-key - hex encoded public key base-image - base64 encoded image data signature - base64 encoded signature protocol-version - string comprising of \"xx.yyyy.zzzz-stack\" xx - 2 digit hex value for major version yyy - 3 digit hex value for minor version zzzz - 4 digit hex value for build version stack - up to 16 character string for stack name
 *
 * OpenAPI spec version: 1.0.4
 * Contact: rosborne@coredb.org
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ServiceAccess } from './serviceAccess';

export interface ServiceEntry { 
    amigoId: string;
    accountAccess: ServiceAccess;
    serviceAccess: ServiceAccess;
}