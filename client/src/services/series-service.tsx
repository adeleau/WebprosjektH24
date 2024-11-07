import axios from "axios"

export type Series = {
    series_id: number,
    name: string,
}

class SeriesService {
    getAll(){
        return axios
            .get<Array<Series>>("/series")
            .then((res) => {return res.data})
            .catch((err) => {console.log(err)})
    }
    // Fetch a single series by ID
    getById(id: number) {
        return axios
            .get<Series>(`/series/${id}`)
            .then((res) => res.data)
            .catch((err) => {
                console.error(`Error fetching series with id ${id}:`, err);
                throw err;
            });
    }
}

export default new SeriesService();