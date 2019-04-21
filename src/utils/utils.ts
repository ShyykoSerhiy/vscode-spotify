export function artistsToArtist(artists: { name: string }[]): string {
	return artists.map((a => a.name)).join(', ');
}