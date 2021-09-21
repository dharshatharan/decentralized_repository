import { useState, useEffect } from "react";
import _IPFS, { IPFS } from 'ipfs-core'

export function useIPFS() {
	const [ipfs, setIpfs] = useState<IPFS | null>(null);
	
	useEffect(() => {
		async function fetchData() {
			setIpfs(await _IPFS.create());
		}
		fetchData();
	}, [])

	return ipfs;
}