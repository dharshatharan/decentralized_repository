# Centralized vs Decentralized Image Repositories

This application was initial created as a submission for the [Shopify Developer Intern Challenge](https://docs.google.com/document/d/1eg3sJTOwtyFhDopKedRD6142CFkDfWp1QvRKXNTPIOc/edit)

In this application we compare two types of storage solutions side by side.

**Centralized Storage:** Using proven technologies like [Google Cloud Storage](https://cloud.google.com/storage/) and [MySQL](https://www.mysql.com/) ([PlantScale](https://planetscale.com/))  
**Decentralized Storage:** Using a [Interplanetary File System (IPFS)](https://ipfs.io/)

# Demo - https://decentralized-repository.vercel.app/

# Learnings
* **IPFS is much faster at uploading** the image (since it is hosted in the same machine it is uploaded from), but not as efficient at retrieving it if the image is not available by neighbouring peers. Google Cloud Storage on the other hand is much more efficient at retrieving the image, but slower at uploading it as it uploads to a remote server. Although this characteristic of IPFS can be very effective at scale.
* **IPFS's uses the system cache to host the images**, this means that the images might not be available if not referenced by other peers. This can be fixed by a concept called [pinning](https://docs.ipfs.io/concepts/persistence/#pinning-in-context).
* **IPFS is a distributed system**, this means that the images are not stored on the same machine unlike Google Cloud Storage where there is only one source of truth.
* **IPFS can store metadata in the same directory** as the image, this means that the metadata can be retrieved by other peers easily and a seperate database isn't required.

# Improvements to be made
* Use the existing [PlantScale Database](https://planetscale.com/) ([here](https://github.com/dharshatharan/decentralized_repository/blob/main/prisma/schema.prisma)) and [GrapQL API](https://graphql.org/) ([here](https://github.com/dharshatharan/decentralized_repository/blob/main/pages/api/graphql.ts)) to store the metadata for the Centralized System
* Store accurate metadata for the Decentralized System (currently using hardcoded values)