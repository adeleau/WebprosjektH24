import axios from "axios"

export type Series = {
    series_id: number,
    name: string,
}

class SeriesService {
    
    getAll(): Promise<Series[]>{
        return axios
            .get<Series[]>('/series')
            .then((response) => {return response.data})
            .catch((error) => {console.log(error); return [];})
    }
   

    getName(id: number): Promise<string> {
        return axios
            .get<string>('/series/name/' + id)
            .then((response) => {return response.data})
            .catch((error) => {
                console.error('Error getting name with id' + id + ':' + error)
                throw error;
    })
    }

    

  // Add a new series (new method)
  createSeries(series: { name: string }): Promise<Series> {
    return axios
      .post<Series>('/series', series)
      .then((response) => response.data)
      .catch((error) => {
        console.error('Error creating series:', error);
        throw error;
      });
  }

  deleteSeries(series_id: number): Promise<void> {
    return axios
      .delete(`/series/${series_id}`)
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error deleting series:", error.response?.data || error.message);
        throw error;
      });
  }
  
}


export default new SeriesService();