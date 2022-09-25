const axios = require('axios').default;
export async function fetchPicture(request, page) {
  try {
    const pictures = await axios.get(
      `https://pixabay.com/api/?key=29111135-c68df28752f5bff5a67727daa&q=${request}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    const response = await pictures.data;
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.status);
    }
  }
}
