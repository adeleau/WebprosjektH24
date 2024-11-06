import axios from "axios"

export type Series = {
    series_id: number,
    name: string,
}


class SeriesService {
    getAll(){
        return axios.get<Array<Series>>("/series")
        .then((res) => {return res.data})
        .catch((err) => {console.log(err)})
    }

}

export default new SeriesService();