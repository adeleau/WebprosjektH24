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
    // bruker ikke?
    /*get(name: string) 
        return axios
            .get<Series>('/series/' + name)
            .then((response) => response.data)
            .catch((error) => {
                console.error('Error fetching series with name' + name + ':', error);
                throw error;
            });
    */

    getName(id: number): Promise<string> {
        return axios
            .get<string>('/series/name/' + id)
            .then((response) => {return response.data})
            .catch((error) => {
                console.error('Error getting name with id' + id + ':' + error)
                throw error;
    })
    }

    
}


export default new SeriesService();