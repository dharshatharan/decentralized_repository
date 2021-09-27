import { Image } from '.prisma/client';
import { useState } from 'react';
import { useIPFS } from '../hooks/UseIPFS';

export default function Upload() {
	const ipfs = useIPFS();
	const [imageUrl, setImageUrl] = useState('');

	const uploadPhoto = async (e: any) => {
		const file = e.target.files[0];
		const filename = encodeURIComponent(file.name);

		console.log(file)
		console.log(filename);


		if (ipfs) {
			const date = new Date()
			const data = {
				createdAt: date,
				updatedAt: date,
				title: "Test",
				description: "Test Description",
			}

			const dataResults = await ipfs.addAll(
				[
					{ path: 'image', content: file },
					{ path: 'metadata.json', content: JSON.stringify(data) },
				],
				{ wrapWithDirectory: true }
			)

			console.log(dataResults)

			for await (const result of dataResults) {
				if (result.path === '') {
					setImageUrl("https://ipfs.io/ipfs/" + result.cid + "/image")
				}
			}
		}
	};

	return (
		<>
			<p>Upload a .png or .jpg image (max 1MB).</p>
			<input
				onChange={uploadPhoto}
				type="file"
				accept="image/png, image/jpeg"
			/>
		</>
	);
}