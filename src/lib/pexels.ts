const PEXELS_API_KEY = 'afsRCc0Tqa9ycvGExcwWV5siUPyyTETac2GBmRvsYu8k7JQxN3OMoxpD';
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

export const getImages = async (query: string, perPage = 5) => {
  if (!PEXELS_API_KEY || PEXELS_API_KEY === 'YOUR_PEXELS_API_KEY') {
    console.error('Pexels API key is not configured.');
    return [];
  }

  try {
    const response = await fetch(`${PEXELS_API_URL}?query=${query}&per_page=${perPage}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.photos.map((photo: any) => photo.src.large);
  } catch (error) {
    console.error(error);
    return [];
  }
};
