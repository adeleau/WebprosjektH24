import axios from "axios"

export type Series = {
    series_id: number,
    name: string,
}

class SeriesService {
    
    getAll(){
        return axios
            .get<Series[]>('/series')
            .then((response) => {return response.data})
            .catch((error) => {console.log(error)})
    }

    get(name: string) {
        return axios
            .get<Series>('/series/' + name)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching series with name' + name + ':', error);
                throw error;
            });
    }
}

export default new SeriesService();