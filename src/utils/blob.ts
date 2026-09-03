/**
 * Fetch a remote image as a Blob. Needed because createImageBitmap
 * works only with Blob/File/ImageBitmap sources, not with HTMLImageElement.
 */
export async function fetchAsBlob(url: string): Promise<Blob> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    return response.blob();
}
