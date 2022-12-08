import axios from "axios";

const BASE_URL = 'https://pixabay.com/api/?key=31851558-820ac2f97dae79a9951146e00&';

export default function axiosTheme(search, page) {
    url = `${BASE_URL}q=${search}&orientation=horizontal&image_type=photo&safesearch=true&per_page=40&page=${page}`
    return axios.get(url).then(response => {
        console.log('В функции axios');
        return response.data;
    });
}

